import Axios from 'axios'
import Storer from '../utils/storer'

const _makeRequest = createRequest => async args => {
  const _headers = args.headers != null ? args.headers : {}

  const defaultHeaders = {
    'X-App-Version': '1.1.0',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'X-Language': 'en'
  }

  args = {
    ...args,
    headers: {
      ...defaultHeaders,
      ..._headers
    },
  }

  const { data } = await createRequest(args)

  return data
}

const _makeAuthRequest = createRequest => async (args) => {
  const requestHeaders = args.headers ? args.headers : {}

  // const accessToken = localStorage.getItem('token')
  const accessToken = await Storer.get('token')
  // //console.log('>>> accessToken', accessToken)

  let headers = {
    'Authorization': `${accessToken}`,
  }

  args = {
    ...args,
    headers: {
      ...headers,
      ...requestHeaders
    }
  }

  try {
    return await _makeRequest(createRequest)(args)
  } catch (e) {
    const { response } = e

    if (!response || !response.data) {
      throw e
    }

    // if (response.status >= 400 && response.status <= 403) {

    // }
  }

}

export const REACT_APP_API_URL = 'https://act4charity.monster' //'http://149.28.157.194:5005'
export const SOCKET_URL = 'http://149.28.157.194:5007'


export const APIServices = () => {
  const baseUrlValidated = REACT_APP_API_URL

  const instance = Axios.create({
    baseURL: baseUrlValidated,
    headers: {
      'content-type': 'application/json', // whatever you want
    },
    // timeout: 30000,
  })

  return {
    makeRequest: _makeRequest(instance),
    makeAuthRequest: _makeAuthRequest(instance),
  }
}
