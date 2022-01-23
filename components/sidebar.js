export default function SideBar() {
  return (
    <div
      className="min-h-full bg-zinc-800 text-white py-5 px-3"
      style={{ width: "300px" }}
    >
      <h1 className="text-indigo-400 text-4xl px-3 mb-3 font-bold">Deck</h1>
      <ul className="menu p-4 overflow-y-auto w-full text-base-content">
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 p-0.5 mr-0.5 rounded"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{
                background: "linear-gradient(to right, #009fff, #ec2f4b)",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
            Template
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 p-0.5 mr-0.5 rounded"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              style={{
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
              }}
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            User
          </a>
        </li>
        <li>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 p-0.5 mr-0.5 rounded"
              viewBox="0 0 20 20"
              fill="currentColor"
              stroke="currentColor"
              style={{
                background: "linear-gradient(to right, #76b852, #8dc26f)",
              }}
            >
              <path
                fillRule="evenodd"
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
            Application
          </a>
        </li>
      </ul>
    </div>
  )
}
