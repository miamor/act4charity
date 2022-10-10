import React, { useState, useEffect } from 'react'
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


/**
 * @returns {*}
 * @constructor
 */
const Main: () => Node = () => {
  const [{ loggedUser, theme }, dispatch] = useGlobals()
  const [isReady, setIsReady] = useState(false)
  const [appState, setAppState] = useState(AppState.currentState)
  const _theme = themes[theme]

  // Deal with background/active app
  useEffect(() => {
    // Handles screen focus and case when user reopens app one day later (Date has to be updated)
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState)
    }

    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [appState, dispatch])

  // Backbones
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


  return (
    <PaperProvider theme={_theme}>
      <NavigationContainer theme={_theme}>
        {!isReady ? (
          <View style={{ position: 'absolute', backgroundColor: '#00000007', zIndex: 999, top: 0, left: 0, bottom: 0, right: 0 }}>
            <Rotation style={{ position: 'absolute', top: '40%', flex: 1, alignSelf: 'center', opacity: 0.7 }} rotate>
              <SolarSystem />
            </Rotation>
          </View>
        ) : loggedUser == null ? (
          <AuthStackNavigation />
        ) : loggedUser.basicsDone != true ? (
          <InitialStackNavigation />
        ) : (
          <MainStackNavigation />
        )}
      </NavigationContainer>
    </PaperProvider>
  )
}


export default Main
