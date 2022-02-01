import { CheckCircleIcon, TrashIcon } from "@heroicons/react/solid"
import { useState } from "react"

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

// This function renders the sidebar for the Google Group app with groupp search view and list of groups in the template.
export function AtlassianSidebar({ isOpen, setOpen, allGroups, templateGroups, handleGroupsUpdate }) {
  const [addedGroups, setAddedGroups] = useState(templateGroups)
  const [isSaveButtonLoading, setSaveButtonLoading] = useState(false)

  // if the added channels are the same as the template channels from the database,
  // we should not update the template and allow the save button to be active
  // this line contains a bug, must fix later
  const shouldSaveActive = !equalsIgnoreOrder(addedGroups, templateGroups)

  const removeGroup = (_group) => {
    setAddedGroups(addedGroups.filter((group) => group !== _group))
  }

  return (
    <div className="w-full h-full divide-y divide-gray-300 space-y-4 p-3">
      <section className="w-full h-1/2 flex flex-col">
        <input placeholder="Search groups" className="card w-full mb-4" style={{ padding: "0.5rem" }} />
        <ul className="search-result flex flex-col space-y-2 max-h-80 overflow-y-auto">
          {allGroups.map((group, key) => {
            const isGroupSelected = addedGroups.includes(group.name)

            return (
              <li
                key={`${group.groupId}_${key}`}
                className={`flex flex-row justify-between rounded-lg shadow-lg hover:bg-zinc-200 ${
                  isGroupSelected ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ padding: "0.5rem" }}
                onClick={() => !isGroupSelected && setAddedGroups([...addedGroups, group.name])}
                disabled={isGroupSelected}
              >
                <p>{group.name}</p>
                {isGroupSelected && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
              </li>
            )
          })}
        </ul>
      </section>
      <section className="w-full flex flex-col pt-2 h-1/2">
        <h2 className="defined-badge p-1 mt-4 mb-2 w-fit bg-indigo-400 text-white">ADDED GROUPS</h2>
        <ul className="space-y-2 divide-y divide-neutral-300 h-full overflow-y-auto">
          {addedGroups.map((group, key) => (
            <li key={`${group}_${key}`} className="flex flex row justify-between" style={{ padding: "0.5rem" }}>
              <p>{group}</p>
              <TrashIcon className="h-5 w-5 hover:text-red-400 cursor-pointer" onClick={() => removeGroup(group)} />
            </li>
          ))}
        </ul>
        <div className="defined-btn-group flex flex-row justify-end gap-x-4 my-4">
          <button
            className={`btn btn-primary ${
              shouldSaveActive ? "rounded-btn " : "rounded-btn-disabled text-white cursor-not-allowed"
            } ${isSaveButtonLoading ? "loading" : ""} bg-indigo-500`}
            // disabled={!shouldSaveActive}
            onClick={async (event) => {
              event.preventDefault
              setSaveButtonLoading(true)
              await handleGroupsUpdate(addedGroups)
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
