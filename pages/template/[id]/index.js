import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
// app logos
import Slack_Mark from "../../../assets/Slack_Mark.svg"
import Google_Group from "../../../assets/Google_Group.svg"
import Atlassian from "../../../assets/Atlassian.svg"
import { useState } from "react"
import AppCard from "../../../components/template/appCard"
import MemberCard from "../../../components/template/memberCard"
import MemberOverlay from "../../../components/members"
import Overlay from "../../../components/template/overlay"
import { PlusCircleIcon } from "@heroicons/react/solid"
import Router from "next/router"
import Spinner from "../../../components/spinner"
import { URL } from "../../../constants"
import { useSlackConversations, useGoogleGroups, useTemplate, useAtlassianGroups, useUsers } from "../../../utils"

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
  const [isMemberDrawerOpen, setMemberDrawerOpen] = useState(false)
  const [isAddUserBtnLoading, setAddUserBtnLoading] = useState(false)
  // const [slackChannels, setSlackChannels] = useState([])
  // const [googleGroupKeys, setGoogleGroupKeys] = useState([])
  // const [atlassianGroupnames, setAtlassianGroupnames] = useState([])
  const { template, isTemplateLoading, isTemplateError } = useTemplate(`${URL.GET_TEMPLATE_BY_ID}/${id}`)
  const { conversations, areConversationsLoading, areConversationsFailed } = useSlackConversations(URL.GET_SLACK_CONVERSATIONS)
  const { groups, areGroupsLoading, areGroupsFailed } = useGoogleGroups(URL.GET_GOOGLE_GROUPS)
  const { atlassianGroups, areAtlassianGroupsLoading, areAtlassianGroupsFailed } = useAtlassianGroups(URL.GET_ATLASSIAN_GROUPS)
  const { users, areUsersBeingLoaded, isUsersLoadingFailed } = useUsers(URL.LIST_ALL_USERS)
  // fetch all apps and template's members list from the data received from backend

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

  if (isUsersLoadingFailed) {
    return (
      <div>
        Error loading template members. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  } else if (areUsersBeingLoaded)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  const {
    app: { slack, google, atlassian } = {
      slack: undefined,
      google: undefined,
      atlassian: undefined,
    },
    // members is an array of reference Ids to users
    members,
  } = template

  // since we only save the members as a list of reference Ids to users,
  // we have to filter the users list by referenceIds to get the full user data
  const memberList = users.filter((user) => members.includes(user._id))
  console.log("memberList: ", memberList)

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
  ].filter((_app) => _app.appData !== undefined)

  const handleSlackChannelsUpdate = async (addedChannels) => {
    // This code has a bug in edge cases.
    const memberEmails = memberList.map((member) => member.email)

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
    const memberEmails = memberList.map((member) => member.email)

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
    const memberEmails = memberList.map((member) => member.email)
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

  // updae the members field in the template collection and the team field in the user collection
  const handleMembersUpdate = async (newMembers, prevMemberList) => {
    newMembers.map(async (newMember) => {
      // call the backend to add the user id to the template under the members field
      await axios({
        method: "put",
        url: URL.UPDATE_TEMPLATE_MEMBER,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          id: id,
          members: prevMemberList.concat(newMember._id),
        }),
      }).catch((error) => {
        console.log(error)
        throw new Error(error)
      })

      // add users to every directory in Slack, Google Group, and Atlassian Cloud
      await inviteAll(newMember.email.trim())
        .then((_) => Router.reload(window.location.pathname))
        .catch((err) => {
          console.log(err)
          throw new Error(err)
        })

      // update the team array field for that user by appending an object of template name and template id
      await axios({
        method: "put",
        url: URL.UPDATE_USER_TEAM,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ _id: newMember._id, team: newMember.team.concat(id) }),
      })
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

  // This needs to be changed to reflect the user id.
  const removeUser = async (_id) => {
    // call the backend to remove the user from the template
    console.log("_id inside removeUser: ", _id)
    const newMemberList = memberList.filter((member) => member._id !== _id)
    const removedMemberEmail = memberList.find((member) => member._id === _id).email
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
    await removeAll(removedMemberEmail.trim())
      .then((_) => Router.reload(window.location.pathname))
      .catch((err) => {
        console.log(err)
        // throw new Error(err)
      })

    Router.reload(window.location.pathname)
  }

  const overlayData = [
    {
      appName: "slack",
      isOpen: isSlackDrawerOpen,
      setOpen: setSlackDrawerOpen,
      optionType: "channels",
      optionBadgeColor: "bg-blue-500",
      allOptions: conversations,
      savedOptions: slack.channels,
      handleOptionsUpdate: handleSlackChannelsUpdate,
    },
    {
      appName: "google",
      isOpen: isGoogleDrawerOpen,
      setOpen: setGoogleDrawerOpen,
      optionType: "groups",
      optionBadgeColor: "bg-green-500",
      allOptions: groups,
      savedOptions: google.groupKeys,
      handleOptionsUpdate: handleGoogleGroupsUpdate,
    },
    {
      appName: "atlassian",
      isOpen: isAtlassianDrawerOpen,
      setOpen: setAtlassianDrawerOpen,
      optionType: "groups",
      optionBadgeColor: "bg-indigo-500",
      allOptions: atlassianGroups,
      savedOptions: atlassian.groupnames,
      handleOptionsUpdate: handleAtlassianGroupsUpdate,
    },
  ]

  const membersOverlayData = {
    appName: "members",
    isOpen: isMemberDrawerOpen,
    setOpen: setMemberDrawerOpen,
    optionType: "members",
    optionBadgeColor: "bg-orange-500",
    allOptions: users,
    savedOptions: memberList,
    handleOptionsUpdate: handleMembersUpdate,
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
        {/* Members section */}
        <div>
          <h2 className="text-xl mb-2">Members ({members.length})</h2>
          <div className="flex flex-row space-x-8">
            {memberList.map((member, key) => MemberCard({ ...member, key, removeUser: removeUser }))}
            {/* Add a new member card */}
            <button
              style={{ height: 150, width: 225 }}
              onClick={(event) => {
                event.preventDefault()
                setMemberDrawerOpen(!isMemberDrawerOpen)
              }}
              className="p-2 flex justify-center items-center border rounded-lg shadow cursor-pointer hover:bg-gray-200"
            >
              <PlusCircleIcon className="h-10 w-10 text-blue-500" />
            </button>
          </div>
        </div>
      </section>
      {/* The overlay appear after clicking one of the card in the app cards list with custom data */}
      {overlayData.map((data, id) => Overlay({ ...data, key: id }))}
      {MemberOverlay(membersOverlayData)}
      {/* Using React Toastify for message notifications */}
      <ToastContainer />
    </div>
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

/* This code sits under the button of the Add a new member card
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
*/

const addUser = async (id) => {
  if (id.trim().length) {
    // search for the user in the database
    const user = await axios
      .get(URL.GET_USER_BY_ID, { params: { id } })
      .then((response) => {
        if (response.data.ok) return response.data.message

        throw new Error(response.data.message)
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
        members: members.concat(user._id.toString()),
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
    await inviteAll(user.email.trim())
      .then((_) => Router.reload(window.location.pathname))
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })
  }
}
