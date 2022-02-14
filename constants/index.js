const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080"

export const URL = {
  // Templates
  GET_TEMPLATE_BY_ID: `${BACKEND_URL}/template/get-template-by-id`,
  UPDATE_TEMPLATE_MEMBER: `${BACKEND_URL}/template/update/members`,
  // Users
  GET_USER_BY_ID: `${BACKEND_URL}/users/get-user`,
  LIST_ALL_USERS: `${BACKEND_URL}/users/list-all`,
  UPDATE_USER_TEAM: `${BACKEND_URL}/users/update/team`,
  // Slack
  UPDATE_SLACK_TEMPLATE: `${BACKEND_URL}/template/update-template/app/slack`,
  GET_SLACK_CONVERSATIONS: `${BACKEND_URL}/slack/list-conversations`,
  REMOVE_FROM_CHANNELS: `${BACKEND_URL}/slack/remove-from-channels`,
  INVITE_TO_CHANNELS: `${BACKEND_URL}/slack/invite-to-channel`,
  // Google Group
  GET_GOOGLE_GROUPS: `${BACKEND_URL}/google/group/list-all-groups`,
  UPDATE_GOOGLE_GROUP_TEMPLATE: `${BACKEND_URL}/template/update-template/app/google`,
  REMOVE_FROM_GOOGLE_GROUPS: `${BACKEND_URL}/google/group/remove-members`,
  ADD_TO_GOOGLE_GROUPS: `${BACKEND_URL}/google/group/add-members`,
  // Atlassian Cloud
  UPDATE_ATLASSIAN_TEMPLATE: `${BACKEND_URL}/template/update-template/app/atlassian`,
  GET_ATLASSIAN_GROUPS: `${BACKEND_URL}/atlassian/jira/get-all-groups`,
  REMOVE_FROM_ATLASSIAN_GROUPS: `${BACKEND_URL}/atlassian/jira/remove-from-team`,
  INVITE_TO_ATLASSIAN_GROUPS: `${BACKEND_URL}/atlassian/jira/invite-to-team`,
}
