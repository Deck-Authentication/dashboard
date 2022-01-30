// This function renders the sidebar for the Slack app with channels search view and list of channels in the template.
export function SlackSideBar({ isOpen, setOpen, allConversations }) {
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
      <section className="w-full flex flex-col bg-red-100 pt-2">
        <h2>Channels</h2>
        <button onClick={() => setOpen(!isOpen)}>Close</button>
      </section>
    </div>
  )
}
