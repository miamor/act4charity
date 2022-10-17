import Axios from 'axios'
import { TOKEN_KEY } from '../constants/keys'
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

  // const accessToken = localStorage.getItem(TOKEN_KEY)
  const accessToken = await Storer.get(TOKEN_KEY)
  // console.log('>>> accessToken', accessToken)

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

// const REACT_APP_API_URL = 'http://149.28.157.194:5005'
const REACT_APP_API_URL = 'http://192.168.58.21:5005'
export const SOCKET_URL = 'http://192.168.56.1:3000'

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
