import React, { PropTypes, Component, useCallback } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native'
import { ProgressBar, Button, useTheme, Appbar, Modal, Portal, Paragraph } from 'react-native-paper'
import { H3, Text, TextBold } from '../../components/paper/typos'

import { levels_ranges, useGlobals } from '../../contexts/global'
import { DefaultView } from '../../components/containers'

import Storer from '../../utils/storer'
import { CURRENT_CHALLENGE_KEY, default_loggedUser, LOGGED_USER_KEY, TOKEN_KEY } from '../../constants/keys'

import * as ImagePicker from 'react-native-image-picker'
import { REACT_APP_API_URL } from '../../services/APIServices'
import axios from 'axios'
import Loading from '../../components/animations/loading'

import InterestsModal from './interests.modal'
import InformationModal from './information.modal'
import LogOutModal from './logout.modal'
import NotificationsModal from './notifications.modal'
import HelpModal from './help.modal'
import FeedbackModal from './feedback.modal'


function ProfileScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [targetModal, setTargetModalVisibility] = useState(false)
  const [notificationsModal, setNotificationsModalVisibility] = useState(false)
  const [helpModal, setHelpModalVisibility] = useState(false)
  const [feedbackModal, setFeedbackModalVisibility] = useState(false)
  const [personalInformationModal, setPersonalInformationModal] = useState(false)
  const [interestsModal, setInterestsModalVisibility] = useState(false)
  const [informationModal, setInformationModalVisibility] = useState(false)

  const [levelProgress, setLevelProgress] = useState(0.3)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [nextLevel, setNextLevel] = useState(1)

  /*
   * Logout
   */
  const onConfirmLogOut = () => {
    Storer.delete(TOKEN_KEY)
    dispatch({
      type: 'setToken',
      token: null,
    })

    Storer.delete(LOGGED_USER_KEY)
    dispatch({
      type: 'setLoggedUser',
      loggedUser: default_loggedUser,
    })

    Storer.delete(CURRENT_CHALLENGE_KEY)
    dispatch({
      type: 'setCurrentChallenge',
      currentChallenge: null,
    })
  }


  /*
   * Compute current level, next level and level progress
   */
  useEffect(() => {
    let i = -1
    const reachMaxLevel = levels_ranges.every(level => {
      i += 1
      if (loggedUser.current_reward < level.start) {
        setNextLevel(i)
        setCurrentLevel(i - 1)

        setLevelProgress(loggedUser.current_reward / levels_ranges[i].start)

        return false
      }
      return true
    })

    console.log('>>> reachMaxLevel', reachMaxLevel)
    if (reachMaxLevel) {
      setNextLevel(i)
      setCurrentLevel(i)
    }
  }, [loggedUser])


  /*
   * Click avatar. Ask which source to update
   */
  const [showAskImgSource, setShowAskImgSource] = useState(false)
  const hideAskImgSource = () => setShowAskImgSource(false)
  const onPressAvatar = () => {
    setShowAskImgSource(true)
  }

  /*
   * Select / Capture image from source
   */
  const [pickerResponse, setPickerResponse] = useState(null)
  const onImageLibraryPress = useCallback(() => {
    hideAskImgSource()
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    }
    ImagePicker.launchImageLibrary(options, setPickerResponse)
  }, [])

  const onCameraPress = React.useCallback(() => {
    hideAskImgSource()
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
  useEffect(() => {
    if (pickerResponse != null && pickerResponse.assets != null) {
      console.log('[profile] >> pickerResponse', pickerResponse)
      handleUploadPhoto()
    }
  }, [pickerResponse])

  const handleUploadPhoto = async () => {
    setLoading(true)

    const accessToken = await Storer.get(TOKEN_KEY)

    let fileToUpload = {
      uri: pickerResponse.assets[0].uri,
      type: pickerResponse.assets[0].type,
      name: pickerResponse.assets[0].fileName,
    }

    console.log('[handleUploadPhoto] fileToUpload =', fileToUpload)

    let data = new FormData()
    data.append('files', fileToUpload)

    console.log('[handleUploadPhoto] data =', data)

    axios({
      method: 'POST',
      url: REACT_APP_API_URL + '/user/me/uploadAvt',
      data: data,
      headers: {
        'Authorization': accessToken,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      const res = response.data
      if (res.status === 'success') {
        console.log('[handleUploadPhoto] res =', res)

        Storer.set(LOGGED_USER_KEY, {
          ...loggedUser,
          avatar: res.data.avatar
        })

        dispatch({
          type: 'setLoggedUser',
          loggedUser: {
            ...loggedUser,
            avatar: res.data.avatar
          }
        })

        setLoading(false)
      }
    }).catch(error => {
      console.error(error)
    })
  }


  return (<DefaultView>
    <Appbar.Header statusBarHeight={0}>
      <Appbar.Content title="Profile" color={colors.primary} />
    </Appbar.Header>

    {loading && <Loading />}

    {showAskImgSource && (<Portal>
      <Modal visible={showAskImgSource} onDismiss={hideAskImgSource} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
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
          <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideAskImgSource}>Close</Button>
        </View>
      </Modal>
    </Portal>)}


    <ScrollView style={{ backgroundColor: 'transparent' }}>
      <View style={styles.mainViewContainer}>

        <View style={styles.profileDetailsViewContainer}>
          <TouchableOpacity onPress={onPressAvatar}>
            <Image
              source={{ uri: loggedUser.avatar }}
              style={{ height: 80, width: 80, borderRadius: 100 }}
            />
          </TouchableOpacity>
          <View style={styles.profileDetailsTextContainer}>
            <H3>{loggedUser.first_name}</H3>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Image source={levels_ranges[currentLevel].image} style={{ height: 20, width: 20, marginLeft: -5 }} />
              <Text style={{ alignSelf: 'flex-start', marginBottom: 5, color: '#777', fontSize: 14, lineHeight: 18 }}>
                {levels_ranges[currentLevel].title}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Image
            source={require('../../../assets/icons/settings.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Settings
          </TextBold>
        </View>

        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => setInformationModalVisibility(!informationModal)}>
            <Text variant="bodyMedium">Personal Information</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => setNotificationsModalVisibility(!notificationsModal)}>
            <Text variant="bodyMedium">Notifications</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => setInterestsModalVisibility(!interestsModal)}>
            <Text variant="bodyMedium">Interests</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => navigation.navigate('_Target')}>
            <Text variant="bodyMedium">Target</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>


        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
          <Image
            source={require('../../../assets/icons/support.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Support
          </TextBold>
        </View>
        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => setHelpModalVisibility(!helpModal)}>
            <Text variant="bodyMedium">Help</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => setFeedbackModalVisibility(!feedbackModal)}>
            <Text variant="bodyMedium">Feedback</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>



        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
          <Image
            source={require('../../../assets/icons/legal.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Support
          </TextBold>
        </View>
        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              console.log('tos clicked')
            }}>
            <Text variant="bodyMedium">Terms of Service</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text variant="bodyMedium">Privacy Policy</Text>
            <Image
              source={require('../../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>
      </View>


      <Button
        mode="text"
        style={{ width: 100, marginTop: 12 }}
        onPress={() => setModalVisible(!modalVisible)}>
        {
          <Text style={{
            color: colors.primary, // '#6750A4',
            // textDecorationLine: 'underline'
          }}>
            Log Out
          </Text>
        }
      </Button>


      <LogOutModal
        modalVisibility={modalVisible}
        setModalVisibility={setModalVisible}
        onConfirmLogOut={onConfirmLogOut}
      />
      <NotificationsModal
        notificationModalVisibility={notificationsModal}
        setNotificationModalVisibility={setNotificationsModalVisibility}
      />
      <HelpModal
        helpModalVisibility={helpModal}
        setHelpModalVisibility={setHelpModalVisibility}
      />
      <FeedbackModal
        feedbackModalVisibility={feedbackModal}
        setFeedbackModalVisibility={setFeedbackModalVisibility}
      />
      <InterestsModal
        interestModalVisibility={interestsModal}
        setInterestModalVisibility={setInterestsModalVisibility}
      />
      <InformationModal
        informationModalVisibility={informationModal}
        setInformationModalVisibility={setInformationModalVisibility}
      />
    </ScrollView>

  </DefaultView>)
}

const styles = StyleSheet.create({
  mainViewContainer: {
    // marginLeft: 24,
    // marginRight: 24,
    paddingHorizontal: 20,
    marginRight: 10
  },
  profileDetailsViewContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
  },
  profileDetailsTextContainer: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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

export default ProfileScreen
