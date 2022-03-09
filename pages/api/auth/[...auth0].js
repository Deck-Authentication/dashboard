import { handleAuth, handleLogin } from "@auth0/nextjs-auth0"
import { config } from "dotenv"

config()

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          audience: process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "https://api.withdeck.com" : "http://localhost:8080",
          scope: "read:current_user update:current_user_metadata openid profile email",
        },
      })
    } catch (error) {
      res.status(error.status || 400).end(error.message)
    }
  },
})
