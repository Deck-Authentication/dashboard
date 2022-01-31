import { CheckCircleIcon, TrashIcon } from "@heroicons/react/solid"
import { useState } from "react"

// This function renders the sidebar for the Slack app with channels search view and list of channels in the template.
export function SlackSideBar({ isOpen, setOpen, allConversations, templateConversations }) {
  const [addedChannels, setAddedChannels] = useState(templateConversations)

  const removeChannel = (_channel) => {
    setAddedChannels(addedChannels.filter((channel) => channel !== _channel))
  }

  return (
    <div className="w-full h-full divide-y divide-gray-300 space-y-4">
      <section className="w-full h-1/2 flex flex-col">
        <input placeholder="Search channels" className="card w-full mb-4" style={{ padding: "0.5rem" }} />
        <ul className="search-result flex flex-col space-y-2 max-h-80 overflow-y-auto">
          {allConversations.map((conversation, key) => {
            const isConversationSelected = addedChannels.includes(conversation.name)

            return (
              <li
                key={`${conversation.id}_${key}`}
                className={`flex flex-row justify-between rounded-lg shadow-lg hover:bg-zinc-200 ${
                  isConversationSelected ? "bg-gray-200 cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{ padding: "0.5rem" }}
                onClick={() => setAddedChannels([...addedChannels, conversation.name])}
                disabled={isConversationSelected}
              >
                <p>#{conversation.name}</p>
                {isConversationSelected && <CheckCircleIcon className="h-5 w-5 text-green-400" />}
              </li>
            )
          })}
        </ul>
      </section>
      <section className="w-full flex flex-col pt-2 h-1/2">
        <h2 className="badge p-1 mt-4 mb-2 w-fit bg-blue-400 text-white">ADDED CHANNELS</h2>
        <ul className="space-y-2 divide-y divide-neutral-300 h-full overflow-y-auto">
          {addedChannels.map((conversation, key) => (
            <li key={`${conversation}_${key}`} className="flex flex row justify-between" style={{ padding: "0.5rem" }}>
              <p>#{conversation}</p>
              <TrashIcon className="h-5 w-5 hover:text-red-400 cursor-pointer" onClick={() => removeChannel(conversation)} />
            </li>
          ))}
        </ul>
        <div className="btn-group flex flex-row justify-end gap-x-4">
          <button className="rounded-btn text-white bg-indigo-500">Save</button>
          <button onClick={() => setOpen(!isOpen)} className="rounded-btn bg-white border-base-100">
            Cancel
          </button>
        </div>
      </section>
    </div>
  )
}
