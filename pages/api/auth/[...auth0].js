import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0"
import { config } from "dotenv"

config()

const audience = process.env.NEXT_PUBLIC_ENVIRONMENT === "development" ? "http://localhost:8080" : "https://api.withdeck.com"

const handlers = handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: audience, // or AUTH0_AUDIENCE
          // Add the `offline_access` scope to also get a Refresh Token
          scope: "openid profile email offline_access read:current_user", // or AUTH0_SCOPE
        },
      })
    } catch (error) {
      res.status(error.status || 400).end(error.message)
    }
  },
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: "https://withdeck.com",
      })
    } catch (error) {
      res.status(error.status || 400).end(error.message)
    }
  },
})

console.log("handlers: ", handlers)

export default handlers
// export default handleAuth()
