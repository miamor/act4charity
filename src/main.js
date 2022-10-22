import React, { useState, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

import { View, Text } from 'react-native'
import { useGlobals } from './contexts/global'
import themes from './constants/themes'

import { CURRENT_CHALLENGE_KEY, LOGGED_USER_KEY, TOKEN_KEY } from './constants/keys'
import Storer from './utils/storer'

import AuthStackNavigation from './navigation/auth-stack'
import InitialStackNavigation from './navigation/initial-stack'
import MainStackNavigation from './navigation/main-stack'
import Loading from './components/animations/loading'
import SplashModal from './screens/splash.modal'
import Sensors from './components/sensors'

/**
 * @returns {*}
 * @constructor
 */
const Main: () => Node = () => {
  const [{ loggedUser, currentChallenge, theme }, dispatch] = useGlobals()
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
      // Storer.set(TOKEN_KEY, null)
      // Storer.set(CURRENT_CHALLENGE_KEY, null)

      try {
        const _loggedUser = await Storer.get(LOGGED_USER_KEY)
        if (_loggedUser) {
          dispatch({
            type: 'setLoggedUser',
            loggedUser: _loggedUser,
          })
        }

        const _currentChallenge = await Storer.get(CURRENT_CHALLENGE_KEY)
        if (_currentChallenge) {
          dispatch({
            type: 'setCurrentChallenge',
            currentChallenge: _currentChallenge,
          })
          dispatch({
            type: 'setShowBottomBar',
            showBottomBar: true,
          })
        }

        const _started = await Storer.get('started')
        if (_started) {
          dispatch({
            type: 'setStarted',
            started: _started,
          })
        }

      } finally {
        setIsReady(true)
      }
    })()
  }, [dispatch])


  const [showSpash, setShowSpash] = useState(true)
  const onFinishSpash = () => {
    setShowSpash(false)
  }


  return (<PaperProvider theme={_theme}>
    <NavigationContainer theme={_theme}>
      {showSpash && <SplashModal onFinishSpash={onFinishSpash} />}

      {loggedUser == null || loggedUser._id == null ? (<AuthStackNavigation />)
        : loggedUser.basicsDone != true ? (<InitialStackNavigation />)
          : (<>
            <Sensors />
            <MainStackNavigation />
          </>)}

      {/* {!isReady ? (<SplashModal onFinishSpash={() => console.log('onFinishSpash')} />)
        : loggedUser == null || loggedUser._id == null ? (<AuthStackNavigation />)
          : loggedUser.basicsDone != true ? (<InitialStackNavigation />)
            // : (<View />)
            : (<MainStackNavigation />)
      } */}
    </NavigationContainer>
  </PaperProvider>)
}

export default Main
