import React, { PropTypes, Component, useCallback } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Pressable, Platform, Dimensions, ScrollView } from 'react-native'
import { ProgressBar, Button, useTheme, Appbar, Modal, Portal, Paragraph, TextInput } from 'react-native-paper'
import { H3, Text } from '../paper/typos'

import Storer from '../../utils/storer'
import { CURRENT_CHALLENGE_KEY, default_loggedUser, LOGGED_USER_KEY, TOKEN_KEY } from '../../constants/keys'

import * as ImagePicker from 'react-native-image-picker'
import Loading from '../animations/loading'
import { useGlobals } from '../../contexts/global'


function TakePicture(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)


  /*
   * Select / Capture image from source
   */
  const [pickerResponse, setPickerResponse] = useState(null)
  const onImageLibraryPress = useCallback(() => {
    props.hideAskImgSource()
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchImageLibrary(options, setPickerResponse)
  }, [])

  const onCameraPress = React.useCallback(() => {
    props.hideAskImgSource()
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchCamera(options, setPickerResponse)
  }, [])

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri

  /*
   * Image chosen. Update user avatar 
   */
  const [showTextForm, setShowTextForm] = useState(false)
  useEffect(() => {
    if (pickerResponse != null && pickerResponse.assets != null) {
      console.log('[take-picture] >> pickerResponse', pickerResponse, '   |   setShowTextForm true')
      setShowTextForm(true)
    }
  }, [pickerResponse])

  const [statusText, setStatusText] = useState('')
  const submitStory = () => {
    // setLoading(true)

    let fileToUpload = {
      uri: pickerResponse.assets[0].uri,
      type: pickerResponse.assets[0].type,
      name: pickerResponse.assets[0].fileName,
    }

    let data = new FormData()
    data.append('files', fileToUpload)
    data.append('content', statusText)

    props.onSubmitShareStory(data)
  }

  const { width, height } = Dimensions.get('window')


  return (<>

    {/* {loading && <Loading />} */}

    {props.showAskImgSource && (<Portal>
      <Modal visible={props.showAskImgSource} onDismiss={props.onCloseShareStory} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
        <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Choose image source</H3>

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

        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={props.onCloseShareStory}>Close</Button>
        </View>
      </Modal>
    </Portal>)}


    {showTextForm && (<ScrollView style={{ backgroundColor: '#ffffff', flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>

      <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
        {/* <H3>Share with others</H3> */}
        <Image
          source={{ uri: pickerResponse.assets[0].uri }}
          style={{ width: width - 60, height: height / 2 }}
        />
      </View>

      <View style={{ flex: 0.5, paddingHorizontal: 50, backgroundColor: '#00f' }}>
        <TextInput
          style={{ flex: 1, }}
          mode="outlined"
          placeholder="Share something..."
          placeholderTextColor="#C9C5CA"
          multiline={true}
          value={statusText}
          onChangeText={value => setStatusText(value)}
        />
      </View>

      <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Button mode="text" onPress={props.onCloseShareStory} style={{ marginHorizontal: 10 }} labelStyle={{ paddingHorizontal: 10 }}>
            BACK
          </Button>
          <Button mode="contained" onPress={submitStory} style={{ marginHorizontal: 10 }} labelStyle={{ paddingHorizontal: 10 }}>
            POST
          </Button>
        </View>
      </View>

    </ScrollView>)}
  </>)
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    width: 30,
    height: 30,
    margin: 10,
  },
})

export default TakePicture
