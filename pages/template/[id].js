import useSWR from "swr"
import axios from "axios"
import Image from "next/image"
import Slack_Mark from "../../assets/Slack_Mark.svg"
import Google_Group from "../../assets/Google_Group.svg"
import Atlassian from "../../assets/Atlassian.svg"

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
    member,
  } = data

  // filter out missing apps
  const appsData = [
    { appData: slack, name: "Slack", imgSrc: Slack_Mark, imgAlt: "Slack" },
    {
      appData: google,
      name: "Google Group",
      imgSrc: Google_Group,
      imgAlt: "Google Group",
    },
    {
      appData: atlassian,
      name: "Atlassian Cloud",
      imgSrc: Atlassian,
      imgAlt: "Atlassian",
    },
  ].filter((app) => app.appData !== undefined)

  return (
    <>
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <hr className="h-0.5 w-1/4 bg-gray-400" />
      <div className="my-8">
        <h2 className="text-xl mb-2">Applications ({appsData.length})</h2>
        <div className="flex flex-row space-x-8">
          {appsData
            .filter((app) => Boolean(app.appData))
            .map((app) => AppCard(app))}
        </div>
      </div>
      <div className="">
        <h2 className="text-xl mb-2">Members ({member.length})</h2>
      </div>
    </>
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

const AppCard = ({ imgSrc = "", imgAlt = "", name = "" }) => {
  return (
    <a
      href="#"
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200"
    >
      <div>
        <Image src={imgSrc} height={100} width={200} alt={imgAlt} />
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
