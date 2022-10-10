import { APIServices } from './APIServices'

export const ping = () => {
  return APIServices().makeAuthRequest({
    url: '/auth/ping',
    method: 'GET',
  })
}

export const listCats = () => {
  return APIServices().makeAuthRequest({
    url: '/cats.json',
    method: 'GET'
  })
}

export const listChallenges = (postData) => {
  return APIServices().makeAuthRequest({
    url: '/user/challenges/list',
    method: 'POST',
    data: postData,
  })
}
