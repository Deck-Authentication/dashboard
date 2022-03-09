import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { useUser } from "@auth0/nextjs-auth0"
const AppContext = createContext()

export default function AppWrapper(props) {
  // set context as a state so children components will rerender when context changes
  const { user } = useUser()
  const [context, setContext] = useState({})

  useEffect(() => {
    if (user) {
      const getAccessToken = async () => {
        const { accessToken } = await axios.get("/api/get-access-token").then((res) => res.data)

        setContext({ ...context, accessToken })
      }
      getAccessToken()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  })

  return <AppContext.Provider value={[context, setContext]}>{props.children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
