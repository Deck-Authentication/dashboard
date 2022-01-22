import Sidebar from "./sidebar.js"
import Header from "./header.js"
import Head from "next/head"

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Deck</title>
      </Head>
      <Sidebar />
      <Header />
      <main>{children}</main>
    </>
  )
}
