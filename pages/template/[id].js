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

  const {
    app: { slack, google, atlassian } = {
      slack: undefined,
      google: undefined,
      atlassian: undefined,
    },
  } = data

  return (
    <>
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <hr className="h-0.5 w-1/4 bg-gray-400" />
      <div>
        <h2>Applications</h2>
        {slack && (
          <Image src={Slack_Mark} height={100} width={100} alt="Slack logo" />
        )}
        {google && (
          <Image
            src={Google_Group}
            height={100}
            width={100}
            alt="Google Group logo"
          />
        )}
        {atlassian && (
          <Image
            src={Atlassian}
            height={100}
            width={200}
            alt="Atlassian Cloud logo"
          />
        )}
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
