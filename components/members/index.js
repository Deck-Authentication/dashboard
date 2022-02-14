import { CheckCircleIcon, TrashIcon } from "@heroicons/react/solid"
import { useState } from "react"
import { Transition } from "@headlessui/react"

// compare two arrays regardless of the order of their elements
function equalsIgnoreOrder(a = [], b = []) {
  if (a.length != b.length) return false
  const uniqueValues = new Set([...a, ...b])

  for (const v of uniqueValues) {
    const aCount = a.filter((e) => e === v).length
    const bCount = b.filter((e) => e === v).length
    if (aCount != bCount) return false
  }

  return true
}

// This function renders the sidebar under the template tab
function MemberSidebar({ isOpen, setOpen, badgeColor, allMembers, templateMembers, handleMembersUpdate }) {
  const [selectedMembers, setSelectedMembers] = useState(templateMembers)
  const [isSaveButtonLoading, setSaveButtonLoading] = useState(false)

  // if the added channels are the same as the template channels from the database,
  // we should not update the template and allow the save button to be active
  const shouldSaveBtnActive = !equalsIgnoreOrder(selectedMembers, templateMembers)

  const removeMember = (member) => {
    setSelectedMembers(selectedMembers.filter((option) => option !== member))
  }

  return (
    <div className="w-full h-full divide-y divide-gray-300 space-y-4 p-3">
      <section className="w-full h-1/2 flex flex-col">
        <input placeholder={`Search members`} className="card w-full mb-4" style={{ padding: "0.5rem" }} />
        <ul className="search-result flex flex-col space-y-2 max-h-80 overflow-y-auto">
          {allMembers.map((_member, key) => {
            const selectedMemberIds = selectedMembers.map((opt) => opt._id)
            const isMemberSelected = selectedMemberIds.includes(_member._id)

            return (
              <li
                key={`${_member.id}_${key}`}
                className={`flex flex-row justify-between rounded-lg shadow-lg hover:bg-zinc-200 ${
                  isMemberSelected ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ padding: "0.5rem" }}
                onClick={() => !isMemberSelected && setSelectedMembers([...selectedMembers, { ..._member }])}
                disabled={isMemberSelected}
              >
                <p>
                  {_member.name} ({_member.email})
                </p>
                {isMemberSelected && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
              </li>
            )
          })}
        </ul>
      </section>
      <section className="w-full flex flex-col pt-2 h-1/2">
        <h2 className={`defined-badge p-1 mt-4 mb-2 w-fit ${badgeColor} text-white`}>ADDED MEMBERS</h2>
        <ul className="space-y-2 divide-y divide-neutral-300 h-full overflow-y-auto">
          {selectedMembers.map((option, key) => (
            <li key={`${option}_${key}`} className="flex flex row justify-between" style={{ padding: "0.5rem" }}>
              <p>
                {option.name} ({option.email})
              </p>
              <TrashIcon className="h-5 w-5 hover:text-red-400 cursor-pointer" onClick={() => removeMember(option)} />
            </li>
          ))}
        </ul>
        <div className="defined-btn-group flex flex-row justify-end gap-x-4 my-4">
          <button
            className={`btn btn-primary ${
              shouldSaveBtnActive ? "rounded-btn " : "rounded-btn-disabled text-white cursor-not-allowed"
            } ${isSaveButtonLoading ? "loading" : ""} bg-indigo-500`}
            disabled={!shouldSaveBtnActive}
            onClick={async (event) => {
              event.preventDefault()
              setSaveButtonLoading(true)

              await handleMembersUpdate(selectedMembers, templateMembers)
              setSaveButtonLoading(false)
            }}
          >
            Save
          </button>
          <button onClick={() => setOpen(!isOpen)} className="rounded-btn bg-white border-base-100">
            Cancel
          </button>
        </div>
      </section>
    </div>
  )
}

export default function MemberOverlay(props) {
  // props will include multiple fields as { isOpen, setOpen, optionBadgeColor, allMembers, templateMembers, handleMembersUpdate }
  return (
    <Transition
      show={props.isOpen}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      key={`${props.appName}_${props.key}`}
    >
      <aside className="absolute inset-0 w-full h-full flex flex-row">
        <div className="flex-auto bg-zinc-300/80" onClick={() => props.setOpen(!props.isOpen)}></div>
        {/*	
            We must add something in this area	
          */}
        <div className="flex-none w-128 p-5 flex flex-col bg-[#f0f0f0]">
          <MemberSidebar {...props} />
        </div>
      </aside>
    </Transition>
  )
}
