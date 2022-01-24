import { useEffect, useState } from "react"
import axios from "axios"

export default function Template({ BACKEND_URL }) {
  const [template, setTemplate] = useState({})

  useEffect(() => {
    ;(async function () {
      const _template = await axios
        .get(`${BACKEND_URL}/template/get-all-template`)
        .catch((err) => {
          console.error(err)
          isFetchSuccessful = false
        })
        .then((res) => res.data)
      setTemplate(_template)
    })()
  }, [])

  return (
    <div id="template">
      <p>Template</p>
      <p>{JSON.stringify(template)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const BACKEND_URL = process.env.BACKEND_URL

  return {
    props: { BACKEND_URL },
  }
}
