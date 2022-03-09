import { Popover } from "@headlessui/react"
import { useUser } from "@auth0/nextjs-auth0"
import Spinner from "../components/spinner"
import { useRouter } from "next/router"
import { useAppContext } from "../context"

export default function Header() {
  const router = useRouter()
  const { user, error, isLoading } = useUser()
  const [_, setContext] = useAppContext()

  const handleLogout = (event) => {
    event.preventDefault()
    // clean up context before logging out
    setContext({})
    router.push("/api/auth/logout")
  }

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )
  if (error) return <div>{error.message}</div>

  return user ? (
    <header
      className="flex-none px-5 py-4 bg-white flex justify-end"
      style={{ boxShadow: "0 8px 6px -6px #ccc", height: "60px" }}
    >
      <Popover className="relative">
        <Popover.Button
          tabIndex="0"
          className="m-1 flex flex-row pl-2 border-l-slate-400 items-end cursor-pointer hover:opacity-70"
          style={{ borderLeftWidth: "0.5px" }}
        >
          {user.name || user.email}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Popover.Button>
        <Popover.Panel className="absolute z-10 right-0 mt-2 bg-white border border-gray-300 p-1 w-52 rounded-xl">
          <ul tabIndex="0" className="p-2 rounded-box w-full">
            <a href="#" onClick={(event) => handleLogout(event)}>
              <li className="hover:bg-zinc-100 rounded-box p-2 rounded-xl">Log out</li>
            </a>
          </ul>
        </Popover.Panel>
      </Popover>
    </header>
  ) : (
    <h1>
      No user found. Contact us at{" "}
      <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
        peter@withdeck.com
      </a>{" "}
      and we will resolve this issue as soon as possible.
    </h1>
  )
}
