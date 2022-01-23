export default function Header() {
  return (
    <div
      className="px-5 py-4 bg-white flex justify-end"
      style={{ boxShadow: "0 8px 6px -6px #ccc" }}
    >
      <div className="dropdown dropdown-end">
        <div
          tabIndex="0"
          className="m-1 flex flex-row pl-2 border-l-slate-400 items-end cursor-pointer hover:opacity-70"
          style={{ borderLeftWidth: "0.5px" }}
        >
          Peter Nguyen{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <ul
          tabIndex="0"
          className="p-2 shadow menu dropdown-content bg-white rounded-box w-52"
        >
          <li className="hover:bg-zinc-100 rounded-box">
            <a>Profile</a>
          </li>
          <li className="hover:bg-zinc-100 rounded-box">
            <a>Log out</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
