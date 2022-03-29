import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0"
import { config } from "dotenv"

config()

// This is not the backend endpoint but the identifier name staying at https://manage.auth0.com/dashboard/us/dev-fh2bo4e4/apis/6226d19340ecc8004045f5c9/settings
const audience = "http://localhost:8080"

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

export default handlers
