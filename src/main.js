import React, { useState, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

import { View, Text } from 'react-native'
import { useGlobals } from './contexts/global'
import themes from './constants/themes'

import Rotation from './components/animations/rotation'
import SolarSystem from './svgs/SolarSystem'

import { LOGGED_USER_KEY } from './constants/keys'
import Storer from './utils/storer'

import AuthStackNavigation from './navigation/auth-stack'
import InitialStackNavigation from './navigation/initial-stack'
import MainStackNavigation from './navigation/main-stack'
import Loading from './components/animations/loading'

/**
 * @returns {*}
 * @constructor
 */
const Main: () => Node = () => {
  const [{ loggedUser, theme }, dispatch] = useGlobals()
  const [isReady, setIsReady] = useState(false)
  const _theme = themes[theme]

  const appState = useRef(AppState.currentState)
  const [appStateVisible, setAppStateVisible] = useState(appState.current)

  /*
   * Deal with background/active app
   */
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground')
      }

      appState.current = nextAppState
      setAppStateVisible(appState.current)
      // console.log('AppState', appState.current)
    })

    return () => {
      subscription.remove()
    }
  }, [])

  /*
   * Backbones
   */
  useEffect(() => {
    (async () => {
      // Storer.set(LOGGED_USER_KEY, null)
      // Storer.set(SESSION_KEY, null)
      try {
        const _loggedUser = await Storer.get(LOGGED_USER_KEY)
        if (_loggedUser) {
          dispatch({
            type: 'setLoggedUser',
            loggedUser: _loggedUser,
          })
        }
      } finally {
        setIsReady(true)
      }
    })()
  }, [dispatch])

  return (<PaperProvider theme={_theme}>
    <NavigationContainer theme={_theme}>
      {/* <MainStackNavigation /> */}
      {!isReady ? (<Loading />)
        : loggedUser == null ? (<AuthStackNavigation />)
          : (
            // ) : loggedUser.basicsDone != true ? (
            //   <InitialStackNavigation />
            <MainStackNavigation />
          )}
    </NavigationContainer>
  </PaperProvider>)
}

export default Main
