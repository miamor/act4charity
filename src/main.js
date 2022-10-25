import React, { useState, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

import { View, Text } from 'react-native'
import { useGlobals } from './contexts/global'
import themes from './constants/themes'

import Storer from './utils/storer'

import AuthStackNavigation from './navigation/auth-stack'
import InitialStackNavigation from './navigation/initial-stack'
import MainStackNavigation from './navigation/main-stack'
import Loading from './components/animations/loading'
import SplashModal from './screens/splash.modal'
import Sensors from './components/sensors'
import ChallengeBottomSheet from './screens/challenge.bottom'

/**
 * @returns {*}
 * @constructor
 */
const Main: () => Node = () => {
  const [{ loggedUser, currentChallenge, showBottomBar, theme }, dispatch] = useGlobals()
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
        //console.log('App has come to the foreground')
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
      // Storer.delete('loggedUser')
      // Storer.delete('token')
      // Storer.delete('currentChallenge')
      // Storer.delete('started')
      // Storer.delete('joined')

      try {
        const _loggedUser = await Storer.get('loggedUser')
        if (_loggedUser) {
          dispatch({
            type: 'setLoggedUser',
            loggedUser: _loggedUser,
          })
        }

        const _currentChallenge = await Storer.get('currentChallenge')
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

        const _joined = await Storer.get('joined')
        if (_joined) {
          dispatch({
            type: 'setJoined',
            joined: _joined,
          })
        }

        const _startTime = await Storer.get('startTime')
        if (_startTime) {
          dispatch({
            type: 'setStartTime',
            startTime: new Date(_startTime),
          })
        }

        // console.log('_loggedUser', _loggedUser)
        console.log('_started', _started)
        console.log('_joined', _joined)
        console.log('_startTime', _startTime)
        console.log('_currentChallenge != null', _currentChallenge != null)

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
        : loggedUser.basicsDone !== true ? (<InitialStackNavigation />)
          : (<>
            <Sensors />
            <MainStackNavigation />
            {!showSpash && currentChallenge != null && showBottomBar && (<ChallengeBottomSheet />)}
          </>)}

      {/* {!isReady ? (<SplashModal onFinishSpash={() => //console.log('onFinishSpash')} />)
        : loggedUser == null || loggedUser._id == null ? (<AuthStackNavigation />)
          : loggedUser.basicsDone != true ? (<InitialStackNavigation />)
            // : (<View />)
            : (<MainStackNavigation />)
      } */}
    </NavigationContainer>
  </PaperProvider>)
}

export default Main
