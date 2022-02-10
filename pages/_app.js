import AppWrapper from "../context"
import Layout from "../components/layout"
import "../styles/globals.scss"
import { UserProvider } from "@auth0/nextjs-auth0"

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <AppWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppWrapper>
    </UserProvider>
  )
}

export default MyApp
