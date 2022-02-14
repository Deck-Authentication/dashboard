import useSWR from "swr"
import axios from "axios"

export function useSlackConversations(url = "") {
  const fetchConversation = async (url) =>
    await axios({ method: "get", url })
      // slack conversations returned from backend
      .then((res) => res.data.conversations)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetchConversation)

  return {
    conversations: data,
    areConversationsLoading: !data,
    areConversationsFailed: error,
  }
}

export function useGoogleGroups(url = "") {
  const fetchGoogleGroups = async (url) =>
    await axios({ method: "get", url })
      // google groups returned from backend
      .then((res) => res.data.groups)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetchGoogleGroups)

  return {
    groups: data,
    areGroupsLoading: !data,
    areGroupsFailed: error,
  }
}

export function useTemplate(url = "") {
  const fetchTemplates = async (url) =>
    await axios({ method: "get", url })
      // template returned from backend
      .then((res) => res.data.message)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetchTemplates)

  return {
    template: data,
    isTemplateLoading: !data,
    isTemplateError: error,
  }
}

export function useAtlassianGroups(url = "") {
  const fetchAtlassianGroups = async (url) =>
    await axios({ method: "get", url })
      // google groups returned from backend
      .then((res) => res.data.groups)
      .catch((err) => {
        console.error(err)
        throw new Error(err)
      })
  const { data, error } = useSWR(url, fetchAtlassianGroups)

  return {
    atlassianGroups: data,
    areGroupsLoading: !data,
    areGroupsFailed: error,
  }
}

export function useUsers(url = "") {
  const fetcher = (_url) => axios.get(_url).then((res) => res.data.users)

  const { data, error } = useSWR(url, fetcher)

  return {
    users: data,
    areUsersBeingLoaded: !data,
    isUsersLoadingFailed: error,
  }
}
