import { UserIcon } from "@heroicons/react/solid"
import { XCircleIcon } from "@heroicons/react/solid"

export default function MemberCard({ email, name, referenceId, key, removeUser }) {
  return (
    <a
      key={`${name}_${referenceId}_${key}`}
      href="#"
      className="p-2 border shadow relative rounded-lg hover:bg-gray-200 flex flex-col relative"
      title={name}
    >
      <XCircleIcon className="absolute top-0 right-0 m-2 w-5 h-5" onClick={async () => await removeUser(email)} />
      <div>
        <UserIcon style={{ height: 100, width: 200 }} />
      </div>
      <p className="w-full text-center">{name}</p>
    </a>
  )
}
