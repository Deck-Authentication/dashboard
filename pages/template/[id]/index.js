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
import { SlackSideBar } from "../../../components/slack"

function useTemplate(url = "") {
  const fetcher = async (url) =>
    await axios({ method: "get", url })
      // template returned from backend
      .then((res) => res.data.template)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetcher)

  return {
    template: data,
    isTemplateLoading: !data,
    isTemplateError: error,
  }
}

function useSlackConversations(url = "") {
  const fetcher = async (url) =>
    await axios({ method: "get", url })
      // slack conversations returned from backend
      .then((res) => res.data.conversations)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetcher)

  return {
    conversations: data,
    areConversationsLoading: !data,
    areConversationsFailed: error,
  }
}

export default function Template({ id, BACKEND_URL }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const URL = {
    GET_TEMPLATE_BY_ID: `${BACKEND_URL}/template/get-template-by-id/${id}`,
    UPDATE_SLACK_TEMPLATE: `${BACKEND_URL}/template/update-template/app/slack`,
    GET_SLACK_CONVERSATIONS: `${BACKEND_URL}/slack/list-conversations`,
    REMOVE_FROM_CHANNELS: `${BACKEND_URL}/slack/remove-from-channels`,
    INVITE_TO_CHANNELS: `${BACKEND_URL}/slack/invite-to-channel`,
  }

  const { template, isTemplateLoading, isTemplateError } = useTemplate(URL.GET_TEMPLATE_BY_ID)
  const { conversations, areConversationsLoading, areConversationsFailed } = useSlackConversations(URL.GET_SLACK_CONVERSATIONS)

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
  } else if (isTemplateLoading) return <div>Loading...</div>

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
  } else if (areConversationsLoading) return <div>Loading...</div>

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
  const appsData = [
    {
      appData: slack,
      name: "Slack",
      imgSrc: Slack_Mark,
      imgAlt: "Slack",
      href: `/template/${id}/slack`,
    },
    {
      appData: google,
      name: "Google Group",
      imgSrc: Google_Group,
      imgAlt: "Google Group",
      href: `/template/${id}/google_group`,
    },
    {
      appData: atlassian,
      name: "Atlassian Cloud",
      imgSrc: Atlassian,
      imgAlt: "Atlassian",
      href: `/template/${id}/atlassian`,
    },
  ].filter((app) => app.appData !== undefined)

  const handleSlackChannelsUpdate = async (addedChannels) => {
    // Remove users from every existing channel in the template.
    if (slack?.channels?.length && members?.length) {
      const memberEmails = members.map((member) => member.email)

      await axios({
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
        })

      // Update the template with the new channels in MongoDB database.
      await axios({
        method: "put",
        url: URL.UPDATE_SLACK_TEMPLATE,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ id: id, channels: addedChannels }),
      })
        .then((response) => {
          console.log(JSON.stringify(response.data))
        })
        .catch(function (error) {
          console.log("Error at update the template: ", error)
          throw new Error(error)
        })

      // Invite users to the new channels in the template.
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

      const toastOption = {
        autoClose: 4000,
        type: toast.TYPE.SUCCESS,
        hideProgressBar: false,
        position: toast.POSITION.BOTTOM_CENTER,
        pauseOnHover: true,
      }

      toast.success("Successfully updated Slack channels.", toastOption)
    }
  }

  return (
    <div className="w-full h-full flex flex-col relative justify-items-start">
      <section className="p-5">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <div className="h-0.5 w-1/4 bg-gray-300" />
        <div className="my-8 drawer-content">
          <h2 className="text-xl mb-2">Applications ({appsData.length})</h2>
          <div className="flex flex-row space-x-8">
            {appsData
              .filter((app) => Boolean(app.appData))
              .map((app, key) =>
                AppCard({
                  ...app,
                  key: key,
                  handleDrawer: () => setDrawerOpen(!isDrawerOpen),
                })
              )}
          </div>
        </div>
        <div>
          <h2 className="text-xl mb-2">Members ({members.length})</h2>
          <div className="flex flex-row space-x-8">{members.map((member, key) => MemberCard({ ...member, key }))}</div>
        </div>
      </section>
      {/* Sidebars appear after clicking one of the card in the app cards list */}
      <Transition
        show={isDrawerOpen}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <aside className="absolute inset-0 w-full h-full flex flex-row">
          <div className="flex-auto bg-zinc-300/80" onClick={() => setDrawerOpen(!isDrawerOpen)}></div>
          {/*
            We must add something in this area
          */}
          <div className="flex-none w-128 p-5 flex flex-col bg-[#f0f0f0]">
            <SlackSideBar
              {...{
                isOpen: isDrawerOpen,
                setOpen: setDrawerOpen,
                allConversations: conversations,
                templateConversations: slack.channels,
                handleSlackChannelsUpdate,
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

const AppCard = ({ imgSrc = "", imgAlt = "", name = "", key = "", handleDrawer = () => {}, href = "" }) => {
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

const MemberCard = ({ email, name, referenceId, key }) => {
  return (
    <a
      key={`${name}_${referenceId}_${key}`}
      href="#"
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200 flex flex-col"
      title={name}
    >
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
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: {
      BACKEND_URL,
      id,
    },
  }
}
