import useSWR from "swr"
import axios from "axios"

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

  return (
    <>
      <h1>{data.name}</h1>
      <hr style={{ backgroundColor: "black" }} />
      <div>{JSON.stringify(data)}</div>
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
