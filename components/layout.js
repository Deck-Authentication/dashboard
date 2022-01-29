import Sidebar from "./sidebar.js"
import Header from "./header.js"
import Head from "next/head"

export default function Layout(props) {
  return (
    <div
      className="flex flex-row min-h-screen min-w-screen text-black"
      style={{ backgroundColor: "rgb(241, 245, 249)" }}
    >
      <Head>
        <title>Deck</title>
        <meta name="title" content="Deck Admin Dashboard" />
        <meta
          name="description"
          content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
        />
      </Head>
      <Sidebar />
      <div className="w-full h-screen flex flex-col">
        <Header />
        <section className="w-full flex-auto">{props.children}</section>
      </div>
    </div>
  )
}
