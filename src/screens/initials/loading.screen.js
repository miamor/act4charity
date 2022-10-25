import React, { useState, useEffect } from 'react'
import { StyleSheet, ToastAndroid, View } from 'react-native'
import { Subheading, useTheme } from 'react-native-paper'

import Rotation from '../../components/animations/rotation'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import SolarSystem from '../../svgs/SolarSystem'
import Storer from '../../utils/storer'
import * as userAPI from '../../services/userAPI'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function LoadingScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const [phrase, setPhrase] = useState(0)
  const phrases = [
    'Generating profile',
  ]
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const intervalNumber = setInterval(() => {
      // if (phrase < 5) {
      //   setPhrase(phrase + 1)
      // } else { }
      setPhrase(phrase)

      if (!success) {
        setSuccess(true)

        const finished_user_info = {
          ...loggedUser,
          basicsDone: true,
        }

        userAPI.updateProfile(finished_user_info).then((res) => {
          // //console.log('res', res)
          Storer.set('loggedUser', finished_user_info).then(() => {
            dispatch({
              type: 'setLoggedUser',
              loggedUser: finished_user_info,
            })
          })
        }).catch(error => {
          setLoading(false)
          console.error(error)
          ToastAndroid.show('Oops', ToastAndroid.SHORT)
        })

      }

    }, 100)
    return () => clearInterval(intervalNumber)
  })

  return (
    <DefaultView>
      <View style={{ flex: 1 }} />
      <View style={styles.loadingContainer}>
        <Rotation style={{ opacity: 0.7 }} rotate>
          <SolarSystem />
        </Rotation>
      </View>
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

export default LoadingScreen
