import Menu from "./menu.js"
import Header from "./header.js"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

function Layout(props) {
  return (
    <div className="flex flex-row min-h-screen min-w-screen text-black" style={{ backgroundColor: "rgb(241, 245, 249)" }}>
      <Menu />
      <div className="w-full h-screen flex flex-col">
        <Header />
        <section className="w-full flex-auto">{props.children}</section>
      </div>
    </div>
  )
}

export default withPageAuthRequired(Layout)
