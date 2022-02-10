import AppWrapper from "../context"
import Layout from "../components/layout"
import "../styles/globals.scss"
import { UserProvider } from "@auth0/nextjs-auth0"
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppWrapper>
        <Head>
          <title>Deck</title>
          <meta name="title" content="Deck Admin Dashboard" />
          <meta
            name="description"
            content="Deck Admin Dashboard for https://withdeck.com- an application to help you invite teammates into multiple cloud applications in one click"
          />
          <link rel="icon" href="/deck.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </UserProvider>
  )
}

export default MyApp
