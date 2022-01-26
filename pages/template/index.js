import Link from "next/link"
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

export default function Templates({ BACKEND_URL }) {
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
      <div className="w-full flex flex-row justify-end">
        <button className="btn normal-case p-1 hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add template
        </button>
      </div>
      <section className="mt-5 flex flex-row">
        {data["template"].map((template, key) =>
          TemplateCard({ template, key })
        )}
      </section>
    </div>
  )
}

function TemplateCard({ template, key }) {
  const { name, member, app, _id } = template
  const borderTopColors = [
    "border-t-blue-300",
    "border-t-red-300",
    "border-t-green-300",
    "border-t-purple-300",
    "border-t-orange-300",
    "border-t-yellow-300",
  ]
  const cardBorderTopColor = borderTopColors[key % 6]
  const LinkStyle = `card w-1/4 mt-2 mr-2 bg-white cursor-pointer hover:shadow-lg border-gray-100 border-t-8 ${cardBorderTopColor}`

  return (
    <Link href={`/template/${_id}`} key={key} passHref>
      <a className={LinkStyle}>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>Number of member: {member.length}</p>
          <p>Number of app: {Object.keys(app).length}</p>
        </div>
      </a>
    </Link>
  )
}

export async function getStaticProps() {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: { BACKEND_URL },
  }
}
