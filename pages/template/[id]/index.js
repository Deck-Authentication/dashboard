import useSWR from "swr"
import axios from "axios"
import Image from "next/image"
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
  const GET_TEMPLATE_BY_ID_URL = `${BACKEND_URL}/template/get-template-by-id/${id}`
  const GET_SLACK_CONVERSATIONS_URL = `${BACKEND_URL}/slack/list-conversations`

  const { template, isTemplateLoading, isTemplateError } = useTemplate(GET_TEMPLATE_BY_ID_URL)
  const { conversations, areConversationsLoading, areConversationsFailed } = useSlackConversations(GET_SLACK_CONVERSATIONS_URL)

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
          <div className="flex-none w-96 p-5 flex flex-col">
            <SlackSideBar {...{ isOpen: isDrawerOpen, setOpen: setDrawerOpen, allConversations: conversations }} />
          </div>
        </aside>
      </Transition>
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
