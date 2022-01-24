import { createContext, useContext, useState } from "react"

const AppContext = createContext()

export default function AppWrapper(props) {
  // set context as a state so children components will rerender when context changes
  const [context, setContext] = useState({})

  return (
    <AppContext.Provider value={[context, setContext]}>
      {props.children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
