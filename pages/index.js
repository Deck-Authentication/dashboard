import { useUser } from "@auth0/nextjs-auth0"
import Spinner from "../components/spinner"

export default function Home() {
  const { user, error, isLoading } = useUser()

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )
  if (error) return <div>{error.message}</div>

  return (
    <div>
      <h1 className="container mx-auto text-3xl font-bold">Hi {user.name || user.email}</h1>
    </div>
  )
}
