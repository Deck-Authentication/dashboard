import Menu from "./menu.js"
import Header from "./header.js"
import Head from "next/head"
import { useUser } from "@auth0/nextjs-auth0"
import Router from "next/router"
import Spinner from "./spinner"
import { useEffect } from "react"

export default function Layout(props) {
  const { user, error, isLoading } = useUser()

  useEffect(() => {
    if (!user) Router.push("/api/auth/login")
  })

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />
      </div>
    )
  if (error) return <div>error.message</div>

  return (
    user && (
      <div className="flex flex-row min-h-screen min-w-screen text-black" style={{ backgroundColor: "rgb(241, 245, 249)" }}>
        <Head>
          <title>Deck</title>
          <meta name="title" content="Deck Admin Dashboard" />
          <meta
            name="description"
            content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
          />
        </Head>
        <Menu />
        <div className="w-full h-screen flex flex-col">
          <Header />
          <section className="w-full flex-auto">{props.children}</section>
        </div>
      </div>
    )
  )
}
