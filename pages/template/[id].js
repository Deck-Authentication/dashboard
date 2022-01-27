import useSWR from "swr"
import axios from "axios"
import { Popover } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { Fragment } from "react"

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
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <hr className="h-0.5 w-1/4 bg-gray-400" />
      <div>{JSON.stringify(data)}</div>
      <MyPopover />
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

function MyPopover() {
  return (
    <Popover className="relative">
      <Popover.Button>Solutions</Popover.Button>

      <Popover.Panel className="absolute z-10 bg-white p-2 w-100 rounded-xl">
        <div className="flex flex-col">
          <a href="/analytics">Analytics</a>
          <a href="/engagement">Engagement</a>
          <a href="/security">Security</a>
          <a href="/integrations">Integrations</a>
        </div>
      </Popover.Panel>
    </Popover>
  )
}
