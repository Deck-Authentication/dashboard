import AppWrapper from "../context"
import Layout from "../components/layout"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppWrapper>
  )
}

export default MyApp
