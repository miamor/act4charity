import { APIServices } from './APIServices'

const constructListParams = (postData) => {
  if (!postData.hasOwnProperty('filter')) {
    postData = {
      ...postData,
      filter: {},
    }
  }

  if (!postData.hasOwnProperty('page')) {
    postData = {
      ...postData,
      page: 1,
    }
  }

  if (!postData.hasOwnProperty('num_per_page')) {
    postData = {
      ...postData,
      num_per_page: 10,
    }
  }

  if (!postData.hasOwnProperty('do_count')) {
    postData = {
      ...postData,
      do_count: 1,
    }
  }

  // postData = {
  //   ...postData,
  //   page: 1,
  //   num_per_page: 10,
  //   do_count: 1
  // }

  return postData
}

export const ping = () => {
  return APIServices().makeAuthRequest({
    url: '/auth/ping',
    method: 'GET',
  })
}

export const listInterests = (postData) => {
  const postData_ = constructListParams(postData)
  return APIServices().makeAuthRequest({
    url: '/user/interests/list',
    method: 'POST',
    data: postData_,
  })
}

export const updateProfile = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/me/update',
    method: 'POST',
    data: postData,
  })
}


export const listChallenges = (postData) => {
  const postData_ = constructListParams(postData)
  //console.log('[listChallenges] postData_', postData_)
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list',
    method: 'POST',
    data: postData_,
  })
}

export const getChallengeAcceptedStatus = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/accepted_status',
    method: 'POST',
    data: postData,
  })
}

export const listChallengesWalk = (postData) => {
  const postData_ = constructListParams(postData)
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list_walk',
    method: 'POST',
    data: postData_,
  })
}

export const listChallengesDiscover = (postData) => {
  const postData_ = constructListParams(postData)
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list_discover',
    method: 'POST',
    data: postData_,
  })
}

export const startChallenge = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/join',
    method: 'POST',
    data: postData,
  })
}

export const cancelChallenge = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/cancel',
    method: 'POST',
    data: postData,
  })
}

export const completeChallenge = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/complete',
    method: 'POST',
    data: postData,
  })
}

export const findUsers = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/users/find',
    method: 'POST',
    data: postData,
  })
}

export const startTeamChallenge = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/start_team',
    method: 'POST',
    data: postData,
  })
}

export const getChallengeInvitations = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/invitations',
    method: 'POST',
    data: postData,
  })
}

export const acceptInvitation = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/accept_invitation',
    method: 'POST',
    data: postData,
  })
}

export const cancelInvitation = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/cancel_invitation',
    method: 'POST',
    data: postData,
  })
}

export const declineInvitation = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/decline_invitation',
    method: 'POST',
    data: postData,
  })
}

export const getCurrentChallenge = (postData) => {
  const postData_ = constructListParams(postData)
  return APIServices().makeAuthRequest({
    url: '/user/me_challenges/ongoing',
    method: 'POST',
    data: postData_,
  })
}

export const getCompletedChallenge = (postData) => {
  const postData_ = constructListParams(postData)
  return APIServices().makeAuthRequest({
    url: '/user/me_challenges/completed',
    method: 'POST',
    data: postData_,
  })
}

export const getPendingInvitations = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/me_challenges/invitations_to_me',
    method: 'POST',
    data: postData,
  })
}

export const listStory = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list_story',
    method: 'POST',
    data: postData,
  })
}

export const sendChat = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/send_chat',
    method: 'POST',
    data: postData,
  })
}

export const listChat = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list_chat',
    method: 'POST',
    data: postData,
  })
}