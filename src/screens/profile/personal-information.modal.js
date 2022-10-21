import React, { useState, useCallback, useEffect } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions, ScrollView, ToastAndroid } from 'react-native'
import { Button, Provider, Surface, TextInput, useTheme, Appbar } from 'react-native-paper'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import { Text } from '../../components/paper/typos'

import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import Storer from '../../utils/storer'
import { LOGGED_USER_KEY } from '../../constants/keys'


function PersonalInformationModal({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [username, setUsername] = useState(loggedUser.username)
  const [email, setEmail] = useState(loggedUser.email)
  const [name, setName] = useState(loggedUser.first_name)
  // const [password, setPassword] = useState('')
  // const [secureText, setSecureText] = useState(true)


  const onUpdateProfile = () => {
    setLoading(true)

    const update_data = {
      email: email,
      first_name: name
    }
    userAPI.updateProfile(update_data).then((res) => {
      Storer.set(LOGGED_USER_KEY, {
        ...loggedUser,
        ...update_data
      })

      dispatch({
        type: 'setLoggedUser',
        loggedUser: {
          ...loggedUser,
          ...update_data
        }
      })

      setLoading(false)

      // ToastAndroid.show('Your information is updated', ToastAndroid.SHORT)
      navigation.goBack()
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  const { width } = Dimensions.get('window')


  return (<DefaultView>
    <Appbar.Header statusBarHeight={0}>
      <Appbar.Content title="Personal Information" color={colors.primary} />
    </Appbar.Header>

    {loading && <Loading />}

    <ScrollView style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 20 }}>
      <View style={{ flex: 0.6 }}>
        <View style={{ marginTop: 18 }}>
          <TextInput
            mode="outlined"
            label="Username"
            disabled={true}
            value={username}
          // onChangeText={value => setUserName(value)}
          />
        </View>

        <View style={{ marginTop: 18 }}>
          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={value => setEmail(value)}
          />
        </View>

        <View style={{ marginTop: 18 }}>
          <TextInput
            mode="outlined"
            label="Name"
            value={name}
            onChangeText={value => setName(value)}
          />
        </View>

        {/* <View style={{ marginTop: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={{ marginRight: 48, flex: 1 }}
            secureTextEntry={secureText}
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={password => setPassword(password)}
          />
          <Pressable
            style={{ marginTop: 20, marginRight: 5 }}
            onPress={() => {
              console.log('visibility button pressed')
              setSecureText(!secureText)
            }}>
            {secureText ? (
              <Image
                style={{ width: 24, height: 24 }}
                source={require('../../../assets/icons/visibility_off.png')}
              />
            ) : (
              <Image
                style={{ width: 24, height: 24 }}
                source={require('../../../assets/icons/visibility_on.png')}
              />
            )}
          </Pressable>
        </View> */}
      </View>

      <View style={{ flex: 0.6, marginTop: 28, flexDirection: 'row', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} labelStyle={{ paddingHorizontal: 10 }}>
          Cancel
        </Button>
        <Button mode="contained" onPress={onUpdateProfile} labelStyle={{ paddingHorizontal: 10 }}>
          Update
        </Button>
      </View>
    </ScrollView>
  </DefaultView>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
})
export default PersonalInformationModal
