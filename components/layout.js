import Sidebar from "./sidebar.js"
import Header from "./header.js"
import Head from "next/head"

export default function Layout({ children }) {
  return (
    <div className="flex flex-row min-h-screen min-w-screen bg-white text-black">
      <Head>
        <title>Deck</title>
        <meta name="title" content="Deck Admin Dashboard" />
        <meta
          name="description"
          content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
        />
      </Head>
      <Sidebar />
      <div className="w-full">
        <Header />
        <main className="p-5">{children}</main>
      </div>
    </div>
  )
}
