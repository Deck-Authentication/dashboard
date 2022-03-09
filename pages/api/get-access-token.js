import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0"

export default withApiAuthRequired(async function handler(req, res) {
  // If your access token is expired and you have a refresh token,
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant

  const { accessToken } = await getAccessToken(req, res, {
    scopes: ["read:current_user"],
  })

  res.status(200).json({ accessToken })
})
