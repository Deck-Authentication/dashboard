import Sidebar from "./sidebar.js"
import Header from "./header.js"
import Head from "next/head"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Deck</title>
        <meta name="title" content="Deck Admin Dashboard" />
        <meta
          name="description"
          content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
        />
      </Head>
      <Sidebar />
      <Header />
      <main>{children}</main>
    </>
  )
}
