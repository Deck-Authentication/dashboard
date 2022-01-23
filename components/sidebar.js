export default function SideBar() {
  return (
    <div
      className="min-h-full bg-zinc-800 text-white py-5 px-3"
      style={{ width: "300px" }}
    >
      <h1 className="text-indigo-400 text-4xl px-3 mb-3 font-bold">Deck</h1>
      <ul className="menu p-4 overflow-y-auto w-full text-base-content">
        <li>
          <a>Team</a>
        </li>
        <li>
          <a>User</a>
        </li>
        <li>
          <a>App</a>
        </li>
      </ul>
    </div>
  )
}
