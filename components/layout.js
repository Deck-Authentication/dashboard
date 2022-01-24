import Sidebar from "./sidebar.js"
import Header from "./header.js"
import Head from "next/head"
import axios from "axios"

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
        <p></p>
      </Head>
      <Sidebar />
      <div className="w-full">
        <Header />
        <main className="p-5">{props.children}</main>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: {
      BACKEND_URL,
    },
  }
}
