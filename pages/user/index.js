import { URL } from "../../constants"
import Spinner from "../../components/spinner"
import useSWR from "swr"
import axios from "axios"

function useUsers(url = "") {
  const fetcher = (url) => axios.get(url).then((res) => res.data.users)

  const { data, error } = useSWR(URL.LIST_ALL_USERS, fetcher)

  return {
    users: data,
    areUsersBeingLoaded: !data,
    isUsersLoadingFailed: error,
  }
}

export default function User() {
  const { users, areUsersBeingLoaded, isUsersLoadingFailed } = useUsers()

  if (isUsersLoadingFailed)
    return (
      <div>
        Error loading users. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  if (areUsersBeingLoaded)
    return (
      // Loading data
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  return (
    <div id="user" className="overflow-x-auto" data-theme="light">
      <table className="table w-full table-zebra">
        <thead>
          <tr className="hover:mix-blend-multiply cursor-pointer">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, key) => (
            <tr className="hover:mix-blend-multiply cursor-pointer" key={`${user?._id}_${key}`}>
              <th>{key + 1}</th>
              <td>{user?.name}</td>
              <td>{user?.email}</td>
              <td>{JSON.stringify(user.team)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
