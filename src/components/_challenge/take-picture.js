import React, { PropTypes, Component, useCallback } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Pressable, Platform, Dimensions, ScrollView } from 'react-native'
import { ProgressBar, Button, useTheme, Appbar, Modal, Portal, Paragraph, TextInput } from 'react-native-paper'
import { H3, Text } from '../paper/typos'

import * as ImagePicker from 'react-native-image-picker'
import Loading from '../animations/loading'
import { useGlobals } from '../../contexts/global'


function TakePicture(props) {
  const [{ loggedUser, joined, currentChallenge }, dispatch] = useGlobals()
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
      maxWidth: 500, maxHeight: 500,
    }
    ImagePicker.launchImageLibrary(options, setPickerResponse)
  }, [])

  const onCameraPress = useCallback(() => {
    props.hideAskImgSource()
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: 500, maxHeight: 500,
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
      // //console.log('[take-picture] >> pickerResponse', pickerResponse, '   |   setShowTextForm true')
      setShowTextForm(true)
    }
  }, [pickerResponse])

  const [statusText, setStatusText] = useState('')
  const submitStory = () => {
    setLoading(true)

    let fileToUpload = {
      uri: pickerResponse.assets[0].uri,
      type: pickerResponse.assets[0].type,
      name: pickerResponse.assets[0].fileName,
    }

    let data = new FormData()
    data.append('files', fileToUpload)
    data.append('content', statusText)

    props.callbackSubmitShareStory(data)
  }

  const { width, height } = Dimensions.get('window')


  return (<>

    {joined === currentChallenge._id && props.showShareStoryModal && (<View style={{ zIndex: 12, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>

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


      {/* {loading && <Loading />} */}

      {showTextForm && (<View style={{ flexDirection: 'column', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', backgroundColor: '#fff', }}>

        {/* <ScrollView> */}
        <View style={{
          // flex: 0.6, 
          // justifyContent: 'center', 
          alignItems: 'center',
          position: 'absolute', top: 60, left: 0, right: 0, bottom: 200
        }}>
          <Image
            source={{ uri: pickerResponse.assets[0].uri }}
            style={{ width: width - 60, height: height / 2 }}
          />
        </View>

        <View style={{ flex: 0.4, paddingHorizontal: 30, paddingVertical: 20, backgroundColor: '#fff', flexDirection: 'column' }}>

          <View style={{ flex: 0.95 }}>
            <TextInput
              // style={{ flex: 1, }}
              // mode="outlined"
              placeholder="Share something..."
              placeholderTextColor="#C9C5CA"
              multiline={true}
              value={statusText}
              onChangeText={value => setStatusText(value)}
            />
          </View>

          <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <Button mode="text" onPress={props.onCloseShareStory} style={{ marginHorizontal: 10 }} labelStyle={{ paddingHorizontal: 10 }}>
                BACK
              </Button>
              <Button mode="contained" onPress={submitStory} style={{ marginHorizontal: 10 }} labelStyle={{ paddingHorizontal: 10 }}>
                POST
              </Button>
            </View>
          </View>

        </View>

        {/* </ScrollView> */}
      </View>)}

    </View>)}

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
