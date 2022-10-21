import React, { useState, useCallback, useEffect } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions, ScrollView, ToastAndroid } from 'react-native'
import { Text, Button, Provider, Surface, TextInput, useTheme, Appbar } from 'react-native-paper'
// import * as ImagePicker from 'react-native-image-picker'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import Storer from '../../utils/storer'


function ProfilePictureModal({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [pickerResponse, setPickerResponse] = useState(null)
  const [visible, setVisible] = useState(false)

  const onImageLibraryPress = useCallback(() => {
    setVisible(!visible)
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: true,
    }
    ImagePicker.launchImageLibrary(options, setPickerResponse)
  }, [])

  const onCameraPress = React.useCallback(() => {
    setVisible(!visible)
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: true,
    }
    ImagePicker.launchCamera(options, setPickerResponse)
  }, [])

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri

  const [username, setUsername] = useState(loggedUser.username)
  const [email, setEmail] = useState(loggedUser.email)
  const [name, setName] = useState(loggedUser.first_name)
  // const [password, setPassword] = useState('')
  // const [secureText, setSecureText] = useState(true)

  useEffect(() => {
    console.log('>> pickerResponse', pickerResponse)
  }, [pickerResponse])


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

      ToastAndroid.show('Your information is updated', ToastAndroid.SHORT)
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
      <View style={{
        flex: 0.2,
        marginTop: 32,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Image
          source={uri ? { uri } : require('../../../assets/icons/placeholder.png')}
          style={{ height: 80, width: 80, borderRadius: 100 }}
        />
        <Button
          mode="text"
          style={{ marginTop: 10 }}
          onPress={() => {
            console.log('change picture button pressed')
            setVisible(!visible)
          }}>
          {
            <Text variant="bodySmall" style={{ color: '#6750A4' }}>
              Change picture
            </Text>
          }
        </Button>
      </View>

      <View style={{ flex: 0.6 }}>
        {visible && (
          <View style={{ flexDirection: 'row' }}>
            <Pressable style={styles.button} onPress={onImageLibraryPress}>
              <Image
                style={styles.buttonIcon}
                source={require('../../../assets/icons/gallery.png')}
              />
              <Text style={styles.buttonText}>Library</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={onCameraPress}>
              <Image
                style={styles.buttonIcon}
                source={require('../../../assets/icons/camera.png')}
              />
              <Text style={styles.buttonText}>Camera</Text>
            </Pressable>
          </View>
        )}
      </View>


      <View style={{ flex: 0.6 }}>
        <View style={{ marginTop: 28, flexDirection: 'row', justifyContent: 'center' }}>
          <Button onPress={() => navigation.goBack()} labelStyle={{ paddingHorizontal: 10 }}>
            Cancel
          </Button>
          <Button mode="contained" onPress={onUpdateProfile} labelStyle={{ paddingHorizontal: 10 }}>
            Update
          </Button>
        </View>
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
  buttonIcon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  buttons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
export default ProfilePictureModal
