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
    case 'setShowBottomBar':
      return {
        ...state,
        showBottomBar: action.showBottomBar,
      }
    case 'setCurrentLocation':
      return {
        ...state,
        currentLocation: action.currentLocation,
      }
    case 'setTrackLoc':
      return {
        ...state,
        trackLoc: action.trackLoc,
      }
    case 'setTrackStep':
      return {
        ...state,
        trackStep: action.trackStep,
      }
    case 'setCurrentRegion':
      return {
        ...state,
        currentRegion: action.currentRegion,
      }
    case 'setTrackMemberLocationStates':
      return {
        ...state,
        trackMemberLocationStates: action.trackMemberLocationStates,
      }
    case 'setTrackMemberDistStates':
      return {
        ...state,
        trackMemberDistStates: action.trackMemberDistStates,
      }
    case 'setTrackMemberStepStates':
      return {
        ...state,
        trackMemberStepStates: action.trackMemberStepStates,
      }
    case 'setMembersJoinStatus':
      return {
        ...state,
        membersJoinStatus: action.membersJoinStatus,
      }
    case 'setCompletedMembers':
      return {
        ...state,
        completedMembers: action.completedMembers,
      }
    case 'setChatMessages':
      return {
        ...state,
        chatMessages: action.chatMessages,
      }
    case 'setPrivateSockMsgs':
      return {
        ...state,
        privateSockMsgs: action.privateSockMsgs,
      }
    case 'setPrivateSockMsg':
      return {
        ...state,
        privateSockMsg: action.privateSockMsg,
      }
    case 'setProcessedPrivateSockMsgs':
      return {
        ...state,
        processedPrivateSockMsgs: action.processedPrivateSockMsgs,
      }
    case 'setSocket':
      return {
        ...state,
        socket: action.socket
      }
    case 'setCompleted':
      return {
        ...state,
        completed: action.completed
      }
    case 'setTeamCompleted':
      return {
        ...state,
        teamCompleted: action.teamCompleted
      }
    case 'setFinished':
      return {
        ...state,
        finished: action.finished
      }
    case 'setStarted':
      return {
        ...state,
        started: action.started
      }
    case 'setInit':
      return {
        ...state,
        init: action.init
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
const LATITUDE = -37.82014135870454
const LONGITUDE = 144.96851676141537
export const initialState = {
  theme: 'light',
  token: null,
  loggedUser: default_loggedUser,
  currentChallenge: null,
  showBottomBar: false,

  currentLocation: null,
  trackLoc: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
  },
  trackStep: {
    distanceTravelled: 0,
    currentStepCount: 0
  },
  currentRegion: {
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
  trackMemberLocationStates: {},
  trackMemberDistStates: {},
  trackMemberStepStates: {},
  membersJoinStatus: {},
  completedMembers: [],
  chatMessages: [],
  privateSockMsgs: [],
  privateSockMsg: null,
  processedPrivateSockMsgs: 0,
  socket: null,
  completed: 0,
  teamCompleted: 0,
  finished: false,
  started: false,

  init: false,
  showLoader: false,
  coin: 0
}

export const levels_ranges = [
  {
    start: 0,
    title: 'Bronze member',
    image: require('../../assets/icons/medal-bronze.png')
  },
  {
    start: 200,
    title: 'Silver member',
    image: require('../../assets/icons/medal-silver.png')
  },
  {
    start: 400,
    title: 'Gold member',
    image: require('../../assets/icons/medal-gold.png')
  }
]


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
