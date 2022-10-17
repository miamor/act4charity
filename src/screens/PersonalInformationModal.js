import React, { useState, useCallback } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image } from 'react-native'
import { Text, Button, Provider, Surface, TextInput, useTheme, Appbar } from 'react-native-paper'
import * as ImagePicker from 'react-native-image-picker'
import { NavigationContainer } from '@react-navigation/native'

import { ImagePickerModal } from '../components/image-picker-modal'
import { ImagePickerAvatar } from '../components/image-picker-avatar'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { DefaultView } from '../components/containers'
import { useGlobals } from '../contexts/global'

function PersonalInformationModal({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [pickerResponse, setPickerResponse] = useState(null)
  const [visible, setVisible] = useState(false)

  const onImageLibraryPress = useCallback(() => {
    setVisible(!visible)
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchImageLibrary(options, setPickerResponse)
  }, [])

  const onCameraPress = React.useCallback(() => {
    setVisible(!visible)
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchCamera(options, setPickerResponse)
  }, [])

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [secureText, setSecureText] = useState(true)

  return (<DefaultView>
    <Appbar.Header statusBarHeight={0}>
      <Appbar.Content title="Personal Information" color={colors.primary} />
    </Appbar.Header>

    <View style={styles.screen}>
      {/* <View style={styles.screen}>
          <ImagePickerAvatar uri={uri} onPress={() => setVisible(true)} />
          <ImagePickerModal
            isVisible={visible}
            onClose={() => setVisible(false)}
            onImageLibraryPress={onImageLibraryPress}
            onCameraPress={onCameraPress}
          />
        </View> */}
      <View style={styles.mainViewContainer}>
        {/* <Text variant="headlineMedium" style={{color: '#6750A4'}}>
          Personal Information
        </Text> */}
        <View
          style={{
            marginTop: 32,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={uri ? { uri } : require('../../assets/icons/placeholder.png')}
            style={{ height: 80, width: 80, borderRadius: 100 }}
          />
          <Button
            mode="text"
            style={{ width: 200, marginTop: 10 }}
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
          <View>
            {visible && (
              <View style={{ flexDirection: 'row', width: 300 }}>
                <Pressable style={styles.button} onPress={onImageLibraryPress}>
                  <Image
                    style={styles.buttonIcon}
                    source={require('../../assets/icons/gallery.png')}
                  />
                  <Text style={styles.buttonText}>Library</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={onCameraPress}>
                  <Image
                    style={styles.buttonIcon}
                    source={require('../../assets/icons/camera.png')}
                  />
                  <Text style={styles.buttonText}>Camera</Text>
                </Pressable>
              </View>
            )}
          </View>
          <View style={{ width: 366, marginTop: 18 }}>
            <TextInput
              st
              mode="outlined"
              label="Username"
              value={userName}
              onChangeText={userName => setUserName(userName)}
            />
          </View>
          <View style={{ width: 366, marginTop: 18 }}>
            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={email => setEmail(email)}
            />
          </View>
          <View style={{ marginTop: 18, flexDirection: 'row', justifyContent: 'space-between' }}>
            <TextInput
              style={{ width: 316, marginRight: 48 }}
              secureTextEntry={secureText}
              mode="outlined"
              label="Password"
              value={password}
              onChangeText={password => setPassword(password)}
            />
            <Pressable
              style={{ position: 'absolute', marginTop: 20, marginLeft: 332 }}
              onPress={() => {
                console.log('visibility button pressed')
                setSecureText(!secureText)
              }}>
              {secureText ? (
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../assets/icons/visibility_off.png')}
                />
              ) : (
                <Image
                  style={{ width: 24, height: 24 }}
                  source={require('../../assets/icons/visibility_on.png')}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
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
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
})
export default PersonalInformationModal
