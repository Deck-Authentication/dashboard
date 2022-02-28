import { URL } from "../../constants"
import Spinner from "../../components/spinner"
import { useUsers, useTemplate } from "../../utils"

export default function User({ BACKEND_URL }) {
  const { users, areUsersBeingLoaded, isUsersLoadingFailed } = useUsers(URL(BACKEND_URL).LIST_ALL_USERS)
  const { template, isTemplateLoading, isTemplateError } = useTemplate(URL(BACKEND_URL).LIST_ALL_TEMPLATES)

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

  if (isTemplateError)
    return (
      <div>
        Error loading the teams for users. Contact us at{" "}
        <a href="mailto:peter@withdeck.com" className="underline text-blue-800">
          peter@withdeck.com
        </a>{" "}
        and we will resolve the issue as soon as possible.
      </div>
    )
  if (isTemplateLoading)
    return (
      // Loading data
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )

  const getTeams = (teamIds) => {
    const teams = []
    teamIds.forEach((id) => {
      const team = template.find((t) => t._id.toString() === id)
      if (team) teams.push(team.name)
    })

    return teams.join(" | ")
  }

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
            <tr className="hover:mix-blend-multiply cursor-pointer" key={`${user._id}_${key}`}>
              <th>{key + 1}</th>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{getTeams(user.team)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export async function getServerSideProps() {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

  console.log("BACKEND_URL inside getServerSideProps = ", BACKEND_URL)

  return {
    props: {
      BACKEND_URL,
    },
  }
}
