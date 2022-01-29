import useSWR from "swr"
import axios from "axios"
import Image from "next/image"
import Slack_Mark from "../../../assets/Slack_Mark.svg"
import Google_Group from "../../../assets/Google_Group.svg"
import Atlassian from "../../../assets/Atlassian.svg"
import { UserIcon } from "@heroicons/react/solid"

export default function Template({ id, BACKEND_URL }) {
  const { data, error } = useSWR(
    `${BACKEND_URL}/template/get-template-by-id/${id}`,
    fetcher
  )
  if (error) {
    return (
      <div>
        Error loading the template. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  }

  if (!data) return <div>Loading...</div>

  // fetch all apps and template's members list from the data received from backend
  const {
    app: { slack, google, atlassian } = {
      slack: undefined,
      google: undefined,
      atlassian: undefined,
    },
    members,
  } = data

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
    <div className="w-full h-full p-5 flex flex-col drawer drawer-end justify-items-start">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      {/* <div className="h-0.5 w-1/4 bg-gray-300" /> */}
      <div className="my-8">
        <h2 className="text-xl mb-2">Applications ({appsData.length})</h2>
        <div className="flex flex-row space-x-8">
          {appsData
            .filter((app) => Boolean(app.appData))
            .map((app, key) => AppCard({ ...app, key: key }))}
        </div>
      </div>
      <div>
        <h2 className="text-xl mb-2">Members ({members.length})</h2>
        <div className="flex flex-row space-x-8">
          {members.map((member, key) => MemberCard({ ...member, key }))}
        </div>
      </div>
    </div>
  )
}

const fetcher = async (url) =>
  await axios({ method: "get", url })
    // template returned from backend
    .then((res) => res.data.template)
    .catch((err) => {
      console.error(err)
      throw new Error(err)
    })

const AppCard = ({
  imgSrc = "",
  imgAlt = "",
  name = "",
  key = "",
  href = "",
}) => {
  return (
    <a
      key={`${name}_${key}`}
      href={href}
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200"
      title={name}
    >
      <div>
        <Image src={imgSrc} height={100} width={200} alt={imgAlt} />
      </div>
      <p className="w-full text-center">{name}</p>
    </a>
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
