import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Subheading, useTheme } from 'react-native-paper'

import { DefaultView } from '../../components/containers'
import Loading from '../../components/animations/loading'

import { useGlobals } from '../../contexts/global'
import Storer from '../../utils/storer'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function AuthScreen({ route, navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const [phrase, setPhrase] = React.useState(0)
  const phrases = [
    'Logging in...',
  ]

  const res = route.params

  const doAuth = () => {
    //console.log('[doAuth] res.user_info', res.user_info)
    //console.log('[doAuth] res.token', res.token)

    Storer.set('token', res.token)
    dispatch({
      type: 'setToken',
      token: res.token,
    })

    Storer.set('loggedUser', res.user_info)
    dispatch({
      type: 'setLoggedUser',
      loggedUser: res.user_info,
    })
  }

  React.useEffect(() => {
    //console.log('loggedUser', loggedUser)
    if (loggedUser == null || loggedUser._id == null) {
      doAuth()
    }
    // const intervalNumber = setInterval(() => {
    //   if (phrase < 5) {
    //     setPhrase(phrase + 1)
    //   } else {
    //     doAuth()
    //   }
    // }, 100)
    // return () => clearInterval(intervalNumber)
  }, [loggedUser])

  return (
    <DefaultView>
      {/* <SpaceSky /> */}
      <View style={{ flex: 1 }} />
      <Loading />
      <View style={{ flex: 3 }}>
        <Subheading style={[styles.textSubheading, { color: colors.primary }]}>
          {phrases[phrase]}
        </Subheading>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  constellation: {
    zIndex: 0,
    position: 'absolute',
    bottom: 20,
    left: 20,
    opacity: 0.1,
  },
  leo: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.2,
  },
  counterContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingTop: 40,
    zIndex: 1,
  },
  textSubheading: {
    textAlign: 'center',
    marginTop: 20,
  },
})

export default AuthScreen
