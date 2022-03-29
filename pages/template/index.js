import Link from "next/link"
import Router from "next/router"
import axios from "axios"
import useSWR from "swr"
import { useState } from "react"
import { XCircleIcon } from "@heroicons/react/solid"
import { ToastContainer, toast } from "react-toastify"
import Spinner from "../../components/spinner"
import { useAppContext } from "../../context"

const fetcher = async (url, accessToken) =>
  await axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data.message)
    .catch((err) => {
      console.error(err)
      throw new Error(err)
    })

const toastOption = {
  autoClose: 4000,
  type: toast.TYPE.SUCCESS,
  hideProgressBar: false,
  position: toast.POSITION.BOTTOM_CENTER,
  pauseOnHover: true,
}

export default function Templates({ BACKEND_URL }) {
  const URL = {
    CREATE_TEMPLATE: `${BACKEND_URL}/template/create-template`,
    DELETE_TEMPLATE: `${BACKEND_URL}/template/remove-template`,
  }

  const [newTemplateName, setNewTemplateName] = useState("")
  const [isCreateButtonLoading, setCreateButtonLoading] = useState(false)
  const [context] = useAppContext()
  // fetch all the templates from the database
  const { data, error } = useSWR(`${BACKEND_URL}/template/list-all`, (url) => fetcher(url, context.accessToken))

  const createTemplate = async (newTemplate) => {
    const config = {
      method: "post",
      url: URL.CREATE_TEMPLATE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.accessToken}`,
      },
      data: JSON.stringify({ name: newTemplate }),
    }

    await axios(config)
      .then((response) => {
        const id = response.data.template._id.toString()

        console.log(JSON.stringify(response.data))
        Router.push(`/template/${id}`)
      })
      .catch((error) => {
        console.log(error)
        throw new Error(error)
      })
  }

  const deleteTemplate = async (templateId, templateName) => {
    const config = {
      method: "delete",
      url: URL.DELETE_TEMPLATE,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${context.accessToken}`,
      },
      data: JSON.stringify({ id: templateId }),
    }

    await axios(config)
      .then((_) => toast.success(`Successfully delete ${templateName}`, toastOption))
      .catch((err) => {
        console.log(err)
        throw new Error(err)
      })

    // Trigger a reload to get the updated list of templates
    Router.reload(window.location.pathname)
  }

  if (!context.accessToken) return <div>No Access Token found</div>

  if (error)
    return (
      <>
        Error in getting data. Contact us at <a href="mailto:peter@withdeck.com">peter@withdeck.com</a> and we will resolve this
        issue as soon as possible.
      </>
    )
  if (!data)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  return (
    <div id="template" className="w-full p-5">
      <div className="w-full flex flex-row justify-end">
        <label
          htmlFor="add-template-modal"
          className="modal-button pill-btn bg-indigo-600 cursor-pointer normal-case p-1 hover:opacity-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add template
        </label>
        <input type="checkbox" id="add-template-modal" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box bg-white p-10">
            <input
              type="text"
              placeholder="Template name"
              className="text-xl w-full rounded-2xl p-2 border border-blue-300"
              value={newTemplateName}
              onChange={(event) => setNewTemplateName(event.target.value)}
            />
            <div className="modal-action">
              <label
                htmlFor="add-template-modal"
                className={`btn btn-primary ${isCreateButtonLoading ? "loading" : ""}`}
                onClick={async (event) => {
                  event.preventDefault()
                  setCreateButtonLoading(true)
                  await createTemplate(newTemplateName)
                  setCreateButtonLoading(false)
                }}
              >
                Create
              </label>
              <label htmlFor="add-template-modal" className="btn">
                Cancel
              </label>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-5 flex flex-row flex-wrap gap-4">
        {data.map((template, key) => TemplateCard({ template, key, deleteTemplate: deleteTemplate }))}
      </section>
      <ToastContainer />
    </div>
  )
}

function TemplateCard({ template, key, deleteTemplate }) {
  const { name, members, app, _id } = template
  const borderTopColors = [
    "border-t-blue-300",
    "border-t-red-300",
    "border-t-green-300",
    "border-t-purple-300",
    "border-t-orange-300",
    "border-t-yellow-300",
  ]
  const cardBorderTopColor = borderTopColors[key % 6]
  const TemplateCardStyle = `defined-card relative w-1/5 min-w-max h-36 mt-2 mr-2 bg-white cursor-pointer hover:shadow-lg border-gray-100 border-t-8 ${cardBorderTopColor}`

  return (
    <Link href={`/template/${_id}`} key={key} passHref>
      <a className={TemplateCardStyle}>
        <XCircleIcon
          className="absolute z-10 h-6 w-6 top-0 right-0 hover:text-red-600"
          onClick={(event) => {
            event.preventDefault()
            deleteTemplate(_id, name)
          }}
        />
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>Number of members: {members.length}</p>
          <p>Number of apps: {Object.keys(app).length}</p>
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
