import useSWR from "swr"
import axios from "axios"

export async function getAccessToken() {
  const { accessToken } = await axios.get("/api/get-access-token").then((res) => res.data)
  return accessToken
}

export function useSlackConversations(url = "") {
  const fetchConversation = async (url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // slack conversations returned from backend
      .then((res) => res.data.conversations)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  }
  const { data, error } = useSWR(url, fetchConversation)

  return {
    conversations: data,
    areConversationsLoading: !data,
    areConversationsFailed: error,
  }
}

export function useGoogleGroups(url = "") {
  const fetchGoogleGroups = async (url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // google groups returned from backend
      .then((res) => res.data.groups)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  }
  const { data, error } = useSWR(url, fetchGoogleGroups)

  return {
    groups: data,
    areGroupsLoading: !data,
    areGroupsFailed: error,
  }
}

export function useTemplate(url = "") {
  const fetchTemplates = async (url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // template returned from backend
      .then((res) => res.data.message)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  }
  const { data, error } = useSWR(url, fetchTemplates)

  return {
    template: data,
    isTemplateLoading: !data,
    isTemplateError: error,
  }
}

export function useAtlassianGroups(url = "") {
  const fetchAtlassianGroups = async (url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      // google groups returned from backend
      .then((res) => res.data.groups)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  }
  const { data, error } = useSWR(url, fetchAtlassianGroups)

  return {
    atlassianGroups: data,
    areGroupsLoading: !data,
    areGroupsFailed: error,
  }
}

export function useUsers(url = "") {
  const fetchUers = async (_url) => {
    const accessToken = await getAccessToken()
    return await axios
      .get(_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => res.data.users)
  }

  const { data, error } = useSWR(url, fetchUers)

  return {
    users: data,
    areUsersBeingLoaded: !data,
    isUsersLoadingFailed: error,
  }
}
