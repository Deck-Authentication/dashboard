// This function renders the sidebar for the Slack app with channels search view and list of channels in the template.
export function SlackSideBar({ isOpen, setOpen, allConversations, templateConversations }) {
  return (
    <div className="w-full h-full divide-y divide-gray-300 space-y-4">
      <section className="w-full flex flex-col">
        <input placeholder="Search channels" className="card w-full mb-4" style={{ padding: "0.5rem" }} />
        <ul className="search-result space-y-2 h-80 overflow-y-auto">
          {allConversations.map((conversation, key) => (
            <li
              key={`${conversation.id}_${key}`}
              className="cursor-pointer rounded-lg shadow-lg hover:bg-zinc-200"
              style={{ padding: "0.5rem" }}
            >
              #{conversation.name}
            </li>
          ))}
        </ul>
      </section>
      <section className="w-full flex flex-col pt-2">
        <h2 className="badge p-1 mt-4 mb-2 w-fit bg-green-300 text-white">ADDED CHANNELS</h2>
        <ul className="space-y-2 divide-y divide-neutral-300">
          {templateConversations.map((conversation, key) => (
            <li key={`${conversation}_${key}`}>{conversation}</li>
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
