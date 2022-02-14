import { UserIcon } from "@heroicons/react/solid"
import { XCircleIcon } from "@heroicons/react/solid"

export default function MemberCard({ email, name, _id, key, removeUser }) {
  return (
    <a
      key={`${name}_${_id}_${key}`}
      href="#"
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200 flex flex-col relative"
      title={name}
    >
      <XCircleIcon
        className="absolute top-0 right-0 m-2 w-5 h-5 hover:text-red-600"
        onClick={async (event) => {
          event.preventDefault()
          await removeUser(_id)
        }}
      />
      <div>
        <UserIcon style={{ height: 100, width: 200 }} />
      </div>
      <p className="w-full text-center">{name}</p>
    </a>
  )
}
