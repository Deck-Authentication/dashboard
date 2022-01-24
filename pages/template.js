import axios from "axios"
import useSWR from "swr"

const fetcher = async (url) =>
  await axios
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      console.error(err)
      throw new Error(err)
    })

export default function Template({ BACKEND_URL }) {
  const { data, error } = useSWR(
    `${BACKEND_URL}/template/get-all-template`,
    fetcher
  )

  if (error)
    return (
      <>
        Error in getting data. Contact us at{" "}
        <a href="mailto:peter@withdeck.com">peter@withdeck.com</a> and we will
        resolve this issue as soon as possible.
      </>
    )
  if (!data) return <div>Loading...</div>
  return (
    <div id="template">
      <p>Template length: {data["template"].length}</p>
      {data["template"].map((template, key) => TemplateCard({ template, key }))}
    </div>
  )
}

function TemplateCard({ template, key }) {
  const { name, member, app } = template

  return (
    <div
      className="card card-bordered card-compact w-fit mt-2 mr-2 bg-white"
      key={key}
    >
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>Number of member: {member.length}</p>
        <p>Number of app: {Object.keys(app).length}</p>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: { BACKEND_URL },
  }
}
