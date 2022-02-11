import useSWR from "swr"
import axios from "axios"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
// app logos
import Slack_Mark from "../../../assets/Slack_Mark.svg"
import Google_Group from "../../../assets/Google_Group.svg"
import Atlassian from "../../../assets/Atlassian.svg"
import { UserIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { Transition } from "@headlessui/react"
import { TemplateSidebar } from "../../../components/TemplateSidebar"
import { PlusCircleIcon } from "@heroicons/react/solid"
import Router from "next/router"
import { XCircleIcon } from "@heroicons/react/solid"
import Spinner from "../../../components/spinner"
import { URL } from "../../../constants"
import { useSlackConversations, useGoogleGroups, useTemplate, useAtlassianGroups } from "../../../utils"

const toastOption = {
  autoClose: 4000,
  type: toast.TYPE.SUCCESS,
  hideProgressBar: false,
  position: toast.POSITION.BOTTOM_CENTER,
  pauseOnHover: true,
}

export default function Template({ id }) {
  const [isSlackDrawerOpen, setSlackDrawerOpen] = useState(false)
  const [isGoogleDrawerOpen, setGoogleDrawerOpen] = useState(false)
  const [isAtlassianDrawerOpen, setAtlassianDrawerOpen] = useState(false)
  const [isAddUserBtnLoading, setAddUserBtnLoading] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState("")
  const [slackChannels, setSlackChannels] = useState([])
  const [googleGroupKeys, setGoogleGroupKeys] = useState([])
  const [atlassianGroupnames, setAtlassianGroupnames] = useState([])

  const { template, isTemplateLoading, isTemplateError } = useTemplate(`${URL.GET_TEMPLATE_BY_ID}/${id}`)
  const { conversations, areConversationsLoading, areConversationsFailed } = useSlackConversations(URL.GET_SLACK_CONVERSATIONS)
  const { groups, areGroupsLoading, areGroupsFailed } = useGoogleGroups(URL.GET_GOOGLE_GROUPS)
  const { atlassianGroups, areAtlassianGroupsLoading, areAtlassianGroupsFailed } = useAtlassianGroups(URL.GET_ATLASSIAN_GROUPS)

  if (isTemplateError) {
    return (
      <div>
        Error loading the template. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  } else if (isTemplateLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  if (areConversationsFailed) {
    return (
      <div>
        Error loading Slack channels. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  } else if (areConversationsLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  if (areGroupsFailed) {
    return (
      <div>
        Error loading Google Groups. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  } else if (areGroupsLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  if (areAtlassianGroupsFailed) {
    return (
      <div>
        Error loading Atlassian groups. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  } else if (areAtlassianGroupsLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  // fetch all apps and template's members list from the data received from backend
  const {
    app: { slack, google, atlassian } = {
      slack: undefined,
      google: undefined,
      atlassian: undefined,
    },
    members,
  } = template

  // filter out missing apps
  const appCardsData = [
    {
      appData: slack,
      name: "Slack",
      imgSrc: Slack_Mark,
      imgAlt: "Slack",
      handleDrawer: () => setSlackDrawerOpen(!isSlackDrawerOpen),
    },
    {
      appData: google,
      name: "Google Group",
      imgSrc: Google_Group,
      imgAlt: "Google Group",
      handleDrawer: () => setGoogleDrawerOpen(!isGoogleDrawerOpen),
    },
    {
      appData: atlassian,
      name: "Atlassian Cloud",
      imgSrc: Atlassian,
      imgAlt: "Atlassian",
      handleDrawer: () => setAtlassianDrawerOpen(!isAtlassianDrawerOpen),
    },
  ].filter((app) => app.appData !== undefined)

  const handleSlackChannelsUpdate = async (addedChannels) => {
    // This code has a bug in edge cases.
    const memberEmails = members.map((member) => member.email)

    // Remove users from every existing channel in the template.
    memberEmails.length &&
      slack?.channels?.length &&
      (await axios({
        method: "delete",
        url: URL.REMOVE_FROM_CHANNELS,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ emails: memberEmails, channels: slack.channels }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log("Error at remove users from slack channels: ", error)
          throw new Error(error)
        }))

    if (addedChannels.length) {
      // Update the template with the new channels in MongoDB database.
      await axios({
        method: "put",
        url: URL.UPDATE_SLACK_TEMPLATE,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ id: id, channels: addedChannels }),
      })
        .then((response) => console.log(JSON.stringify(response.data)))
        .catch((error) => {
          console.log("Error at update the template: ", error)
          throw new Error(error)
        })

      // Invite users to the new channels in the template.
      if (memberEmails.length) {
        const config = {
          method: "put",
          url: URL.INVITE_TO_CHANNELS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ emails: memberEmails, channels: addedChannels }),
        }

        await axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data))
          })
          .catch(function (error) {
            console.log("Error at invite users to channels: ", error)
            throw new Error(error)
          })
      }
    }

    toast.success("Successfully updated Slack channels.", toastOption)

    Router.reload(window.location.pathname)

    return
  }

  const handleGoogleGroupsUpdate = async (addedGroups) => {
    const memberEmails = members.map((member) => member.email)

    // Remove users from every existing google group in the template.
    memberEmails.length &&
      google?.groupKeys?.length &&
      (await axios({
        method: "delete",
        url: URL.REMOVE_FROM_GOOGLE_GROUPS,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ members: memberEmails, groupKeys: google.groupKeys }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
          return response.data
        })
        .catch((error) => {
          console.log("Error at remove users from google groups: ", error)
          throw new Error(error)
        }))

    if (addedGroups.length) {
      // Update the template with the new google groups in MongoDB database.
      await axios({
        method: "put",
        url: URL.UPDATE_GOOGLE_GROUP_TEMPLATE,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ id: id, groupKeys: addedGroups }),
      })
        .then((response) => console.log(JSON.stringify(response.data)))
        .catch((error) => console.log(error))

      const googleGroupMembers = memberEmails.map((email) => ({ email, role: "MEMBER" }))

      // Invite users to the new google groups in the template.
      memberEmails.length &&
        (await axios({
          method: "post",
          url: URL.ADD_TO_GOOGLE_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ groupKeys: addedGroups, members: googleGroupMembers }),
        })
          .then((response) => console.log(JSON.stringify(response.data)))
          .catch((error) => console.log(error)))
    }

    toast.success("Successfully updated Google groups.", toastOption)

    Router.reload(window.location.pathname)

    return
  }

  const handleAtlassianGroupsUpdate = async (addedGroups) => {
    const memberEmails = members.map((member) => member.email)
    // Remove users from every existing atlassian jira group in the template.
    memberEmails.length &&
      atlassian?.groupnames?.length &&
      (await axios({
        method: "delete",
        url: URL.REMOVE_FROM_ATLASSIAN_GROUPS,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ groupnames: atlassian.groupnames, emails: memberEmails }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
          return response.data
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        }))

    if (addedGroups.length) {
      // Update the template with the new Atlassian groups in MongoDB database.
      await axios({
        method: "put",
        url: URL.UPDATE_ATLASSIAN_TEMPLATE,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ id: id, groupnames: addedGroups }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
          return response.data
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        })

      // Invite users to the new Atlassian groups in the template.
      memberEmails.length &&
        (await axios({
          method: "post",
          url: URL.INVITE_TO_ATLASSIAN_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ emails: memberEmails, groupnames: addedGroups }),
        })
          .then((response) => {
            console.log(JSON.stringify(response.data))
            return response.data
          })
          .catch((error) => {
            console.log(error)
            throw new Error(error)
          }))
    }

    toast.success("Successfully updated Atlassian groups.", toastOption)

    Router.reload(window.location.pathname)

    return
  }

  // invite the user to all directories in the template base on the user's email
  const inviteAll = async (email) => {
    let promises = []
    slack.channels?.length &&
      promises.push(
        axios({
          method: "put",
          url: URL.INVITE_TO_CHANNELS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            emails: [email],
            channels: slack.channels,
          }),
        })
      )

    google?.groupKeys?.length &&
      promises.push(
        axios({
          method: "post",
          url: URL.ADD_TO_GOOGLE_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ groupKeys: google.groupKeys, members: [{ email, role: "MEMBER" }] }),
        })
      )

    atlassian?.groupnames?.length &&
      promises.push(
        axios({
          method: "post",
          url: URL.INVITE_TO_ATLASSIAN_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ groupnames: atlassian.groupnames, emails: [email] }),
        })
      )

    await Promise.all(promises)
      .then((_) => toast.success(`Successfully invited user ${email} to group`, toastOption))
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
  }

  // remove users from all directories in the template
  const removeAll = async (email) => {
    let promises = []
    slack.channels?.length &&
      promises.push(
        axios({
          method: "delete",
          url: URL.REMOVE_FROM_CHANNELS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            emails: [email],
            channels: slack.channels,
          }),
        })
      )

    google?.groupKeys?.length &&
      promises.push(
        axios({
          method: "delete",
          url: URL.REMOVE_FROM_GOOGLE_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({ groupKeys: google.groupKeys, members: [email] }),
        })
      )

    atlassian?.groupnames?.length &&
      promises.push(
        axios({
          method: "delete",
          url: URL.REMOVE_FROM_ATLASSIAN_GROUPS,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            groupnames: atlassian.groupnames,
            emails: [email],
          }),
        })
      )
    await Promise.all(promises)
      .then((_) => toast.success(`Successfully remove ${email} from group`, toastOption))
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
  }

  const addUser = async (email) => {
    if (email.trim().length) {
      // search for the user in the database
      const user = await axios({
        method: "get",
        url: `${URL.GET_USER_BY_EMAIL}/${email}`,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
          return response.data.user
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        })
      // get the user name and referenceId
      // call the backend to add the user to the template
      await axios({
        method: "put",
        url: URL.UPDATE_TEMPLATE_MEMBER,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          id: id,
          members: [
            ...members,
            {
              email: email,
              name: user.name,
              referenceId: user._id.toString(),
            },
          ],
        }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        })

      // add users to every directory in Slack, Google Group, and Atlassian Cloud
      await inviteAll(email.trim())
        .then((_) => Router.reload(window.location.pathname))
        .catch((err) => {
          console.log(err)
          throw new Error(err)
        })
    }
  }

  const removeUser = async (email) => {
    if (email.trim().length) {
      // call the backend to remove the user from the template
      const newMemberList = members.filter((member) => member.email !== email)
      await axios({
        method: "put",
        url: URL.UPDATE_TEMPLATE_MEMBER,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          id: id,
          members: newMemberList,
        }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
        })
        .catch((error) => {
          console.log(error)
          throw new Error(error)
        })

      // remove users from every directory in Slack, Google Group, and Atlassian Cloud
      await removeAll(email.trim())
        .then((_) => Router.reload(window.location.pathname))
        .catch((err) => {
          console.log(err)
          // throw new Error(err)
        })

      Router.reload(window.location.pathname)
    }
  }

  return (
    <div className="w-full h-full flex flex-col relative justify-items-start">
      <section className="p-5">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <div className="h-0.5 w-1/4 bg-gray-300" />
        <div className="my-8 drawer-content">
          <h2 className="text-xl mb-2">Applications ({appCardsData.length})</h2>
          <div className="flex flex-row flex-wrap space-x-8">
            {appCardsData
              .filter((app) => Boolean(app.appData))
              .map((app, key) =>
                AppCard({
                  ...app,
                  key: key,
                })
              )}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Members ({members.length})</h2>
          <div className="flex flex-row space-x-8">
            {members.map((member, key) => MemberCard({ ...member, key, removeUser: removeUser }))}
            <label
              htmlFor="invite-user-modal"
              style={{ height: 150, width: 225 }}
              className="p-2 flex justify-center items-center border rounded-lg shadow cursor-pointer hover:bg-gray-200"
            >
              <PlusCircleIcon className="h-10 w-10 text-blue-500" />
            </label>
            <input type="checkbox" id="invite-user-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box bg-white p-10">
                <input
                  type="text"
                  placeholder="User email"
                  className="text-xl w-full rounded-2xl p-2 border border-blue-300"
                  value={newUserEmail}
                  onChange={(event) => setNewUserEmail(event.target.value)}
                />
                <div className="modal-action">
                  <label
                    htmlFor="invite-user-modal"
                    className={`btn btn-primary ${isAddUserBtnLoading ? "loading" : ""}`}
                    onClick={async (event) => {
                      event.preventDefault()
                      setAddUserBtnLoading(true)
                      await addUser(newUserEmail)
                      setAddUserBtnLoading(false)
                    }}
                  >
                    Add
                  </label>
                  <label htmlFor="invite-user-modal" className="btn">
                    Cancel
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sidebars appear after clicking one of the card in the app cards list */}
      <Transition
        show={isSlackDrawerOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <aside className="absolute inset-0 w-full h-full flex flex-row">
          <div className="flex-auto bg-zinc-300/80" onClick={() => setSlackDrawerOpen(!isSlackDrawerOpen)}></div>
          {/*
            We must add something in this area
          */}
          <div className="flex-none w-128 p-5 flex flex-col bg-[#f0f0f0]">
            <TemplateSidebar
              {...{
                isOpen: isSlackDrawerOpen,
                setOpen: setSlackDrawerOpen,
                optionType: "channels",
                optionBadgeColor: "bg-blue-500",
                allOptions: conversations,
                appName: "slack",
                savedOptions: slack.channels,
                handleOptionsUpdate: handleSlackChannelsUpdate,
              }}
            />
          </div>
        </aside>
      </Transition>
      <Transition
        show={isGoogleDrawerOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <aside className="absolute inset-0 w-full h-full flex flex-row">
          <div className="flex-auto bg-zinc-300/80" onClick={() => setGoogleDrawerOpen(!isGoogleDrawerOpen)}></div>
          {/*
            We must add something in this area
          */}
          <div className="flex-none w-128 p-5 flex flex-col bg-[#f0f0f0]">
            <TemplateSidebar
              {...{
                isOpen: isGoogleDrawerOpen,
                setOpen: setGoogleDrawerOpen,
                optionType: "groups",
                optionBadgeColor: "bg-green-500",
                allOptions: groups,
                appName: "google",
                savedOptions: google.groupKeys,
                handleOptionsUpdate: handleGoogleGroupsUpdate,
              }}
            />
          </div>
        </aside>
      </Transition>
      <Transition
        show={isAtlassianDrawerOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <aside className="absolute inset-0 w-full h-full flex flex-row">
          <div className="flex-auto bg-zinc-300/80" onClick={() => setAtlassianDrawerOpen(!isAtlassianDrawerOpen)}></div>
          {/*
            We must add something in this area
          */}
          <div className="flex-none w-128 p-5 flex flex-col bg-[#f0f0f0]">
            <TemplateSidebar
              {...{
                isOpen: isAtlassianDrawerOpen,
                setOpen: setAtlassianDrawerOpen,
                optionType: "groups",
                optionBadgeColor: "bg-indigo-500",
                allOptions: atlassianGroups,
                appName: "atlassian",
                savedOptions: atlassian.groupnames,
                handleOptionsUpdate: handleAtlassianGroupsUpdate,
              }}
            />
          </div>
        </aside>
      </Transition>
      {/* Using React Toastify for message notifications */}
      <ToastContainer />
    </div>
  )
}

const AppCard = ({ imgSrc = "", imgAlt = "", name = "", key = "", handleDrawer = () => {} }) => {
  return (
    <button
      key={`${name}_${key}`}
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200"
      title={name}
      onClick={handleDrawer}
    >
      <div>
        <Image src={imgSrc} height={100} width={200} alt={imgAlt} />
      </div>
      <p className="w-full text-center">{name}</p>
    </button>
  )
}

const MemberCard = ({ email, name, referenceId, key, removeUser }) => {
  return (
    <a
      key={`${name}_${referenceId}_${key}`}
      href="#"
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200 flex flex-col relative"
      title={name}
    >
      <XCircleIcon className="absolute top-0 right-0 m-2 w-5 h-5" onClick={async () => await removeUser(email)} />
      <div>
        <UserIcon style={{ height: 100, width: 200 }} />
      </div>
      <p className="w-full text-center">{name}</p>
    </a>
  )
}

export async function getServerSideProps(context) {
  // Fetch id as the slug of the page from the context.params
  // set id's default value as undefined to avoid TypeError
  const { params: { id } = { id: undefined } } = context

  return {
    props: {
      id,
    },
  }
}
