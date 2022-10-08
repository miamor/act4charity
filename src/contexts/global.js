import React, { createContext, useContext, useReducer } from 'react'

import default_loggedUser from '../constants/keys'

/**
 * @param state
 * @param action
 * @returns {{isAuthenticated: boolean}|{theme: *}|{theme: *, isAuthenticated: boolean, user: {}}}
 */
export const reducer = (state, action) => {
  switch (action.type) {
    case 'switchTheme':
      return {
        ...state,
        theme: action.theme,
      }
    case 'setLogOut':
      return {
        ...state,
        loggedUser: default_loggedUser,
        token: null,
      }
    case 'toggleLoader':
      return {
        ...state,
        showLoader: !state.showLoader,
      }
    case 'setCoin':
      return {
        ...state,
        coin: action.coin,
      }
    case 'setLoggedUser':
      return {
        ...state,
        loggedUser: action.loggedUser,
      }
    case 'setToken':
      return {
        ...state,
        token: action.token,
      }
    case 'setCurrentChallenge':
      return {
        ...state,
        currentChallenge: action.currentChallenge,
      }
    default:
      return {
        ...state,
      }
  }
}

/**
 *
 * @type {{loggedUser: {}, theme: string, showLoader: boolean}}
 */
export const initialState = {
  theme: 'light',
  token: null,
  loggedUser: default_loggedUser,
  currentChallenge: null,
  showLoader: false,
  coin: 0
}

/**
 * @type {React.Context<{loggedUser: {}, theme: string, showLoader: boolean}>}
 */
export const StateContext = createContext(initialState)

/**
 * Provider
 * @param reducer
 * @param initialState
 * @param children
 * @returns {*}
 * @constructor
 */
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)

/**
 * @returns {{theme: string}}
 */
export const useGlobals = () => useContext(StateContext)
