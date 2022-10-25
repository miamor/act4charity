import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { DefaultView } from '../containers'
import { useGlobals } from '../../contexts/global'

import * as Location from 'expo-location'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY } from '../../constants/keys'
// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation'
import haversine from 'haversine'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import ViewShot from 'react-native-view-shot'
import Loading from '../animations/loading'

import * as userAPI from '../../services/userAPI'
import { useNavigation } from '@react-navigation/core'
import { REACT_APP_API_URL } from '../../services/APIServices'
import Storer from '../../utils/storer'
import TakePicture from './take-picture'
import axios from 'axios'
import ChallengeBarIndividual from './bar.individual'


function ChallengeStartActionsIndividual(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion,
    completed, started, startTime }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const [loading, setLoading] = useState(false)


  const [token, setToken] = useState()
  useEffect(() => {
    (async () => {
      if (token == null) {
        const _token = await Storer.get('token')
        setToken(_token)
      }
    })()
  }, [token])


  // useEffect(() => {
  //   //~console.log('[actions.individual] startTime', startTime)
  // }, [startTime])


  useEffect(() => {
    if (currentChallenge.challenge_detail.type === 'discover') {
      setLoading(true)
      listStory()
    }
  }, [])

  useEffect(() => {
    // //console.log('[actions.individual.func] currentLocation', currentLocation, ' | completed =', completed)

    if (completed === 1) {
      onComplete()
    }
  }, [completed])



  /* **********************************************
   *
   * List story by this challenge_id
   *
   * **********************************************/
  const [stories, setStories] = useState([])
  const listStory = () => {
    userAPI.listStory({ challenge_id: currentChallenge.challenge_detail._id }).then((res) => {
      // //console.log('res', res)
      setStories(res.data)
      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }




  /* **********************************************
   *
   * Complete ?!
   * ---
   * When the system detects that the user completed the challenge,
   * show a button for the user to click to confirm that the challenge is completed
   *
   * **********************************************/
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)
  const hideConfirmComplete = () => setShowConfirmComplete(false)
  const onComplete = () => {
    setShowConfirmComplete(true)
  }
  /* 
   * Confirm complete 
   */
  const onConfirmComplete = () => {
    console.log('[actions.individual][onConfirmComplete] CALLED !!!!!!!!!!!!')
    setLoading(true)
    // setCompleted(1.5)
    // onSetDispatch('setCompleted', 'completed', 1.5)
    hideConfirmComplete()
    //console.log('[actions.individual.func][onConfirmComplete] CALLED ~')

    // props.confirmCompleteCallback()

    userAPI.completeChallenge({
      challenge_accepted_id: currentChallenge._id,
      challenge_donation: currentChallenge.challenge_detail.donation,
      challenge_reward: currentChallenge.challenge_detail.reward,
      participants: currentChallenge.participants,
    }).then(async (res) => {
      //~console.log('[actions.individual][onConfirmComplete] (completeChallenge) res', res)

      /* dispatch global states */
      /* set completed = 3 to take screenshot within `Map` view */
      onSetDispatch('setCompleted', 'completed', 3)

      /* update `current_donation` & `current_reward` */
      const newUserData = {
        ...loggedUser,
        current_donation: loggedUser.current_donation + currentChallenge.challenge_detail.donation,
        current_reward: loggedUser.current_reward + currentChallenge.challenge_detail.reward
      }
      await Storer.set('loggedUser', newUserData)
      onSetDispatch('setLoggedUser', 'loggedUser', newUserData)

      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /* **********************************************
   *
   * Cancel the challenge
   *
   * **********************************************/
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const hideConfirmCancel = () => setShowConfirmCancel(false)
  const onPressCancelChallenge = () => {
    setShowConfirmCancel(true)
  }
  const onConfirmCancel = () => {
    setLoading(true)
    hideConfirmCancel()
    // props.onConfirmCancel()

    /*
     * Update in db
     */
    userAPI.cancelChallenge({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      //console.log('>> res', res)

      /* dispatch global states */
      onSetDispatch('setCompleted', 'completed', -1)

      // /* out this screen */
      // navigation.navigate('ChallengeStack', { screen: 'ChallengeListMapDiscover' })

      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  /* **********************************************
   *
   * Share something during my journey
   *
   * **********************************************/
  const [showAskImgSource, setShowAskImgSource] = useState(true)
  const hideAskImgSource = useCallback(() => setShowAskImgSource(false))

  const [showShareStoryModal, setShowShareStoryModal] = useState(false)
  const callbackSubmitShareStory = useCallback((postData) => {
    // setLoading(true)
    // const accessToken = await Storer.get('token')
    // console.log('postData', JSON.stringify(postData))
    // console.log('accessToken', accessToken)

    if (token != null) {
      setLoading(true)

      console.log('postData', JSON.stringify(postData))
      console.log('token', token)

      postData.append('challenge_accepted_id', currentChallenge._id)
      postData.append('challenge_id', currentChallenge.challenge_detail._id)
      postData.append('public', true)

      // //console.log('>>> accessToken =', accessToken)
      // //console.log('>>> ', REACT_APP_API_URL + '/user/challenges/share_story')
      // //console.log('>>> postData =', JSON.stringify(postData))

      axios({
        method: 'POST',
        url: REACT_APP_API_URL + '/user/challenges/share_story',
        data: postData,
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        const res = response.data

        //console.log('[shareStory] res =', res)
        setLoading(false)
        setShowShareStoryModal(false)

        listStory()
      }).catch(error => {
        setLoading(false)
        console.error(error)
        // ToastAndroid.show(error, ToastAndroid.short)
      })
    }
  }, [token])

  const onOpenShareStory = useCallback((postData) => {
    setShowAskImgSource(true)
    setShowShareStoryModal(true)
  }, [])

  const onCloseShareStory = useCallback((postData) => {
    setShowShareStoryModal(false)
  }, [])




  /* **********************************************
   *
   * Bottom Scroll Sheet
   *
   * **********************************************/
  const sheetRef = useRef()//<BottomSheet>(null)
  const data = useMemo(
    () =>
      Array(50).fill(0).map((_, index) => `index-${index}`),
    []
  )
  const snapPoints = useMemo(() => [
    currentChallenge.challenge_detail.type === 'discover' ? '25%' : '19%',
    currentChallenge.challenge_detail.type === 'discover' ? '90%' : '19%'
  ], [])
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0)

  //? callbacks
  const handleSheetChange = useCallback((index) => {
    setCurrentSnapPoint(index)
  }, [])
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
  }, [])
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  //? render
  const renderItem = useCallback((item) => (
    <View key={item} style={styles.itemContainer}>
      <Text>{item}</Text>
    </View>
  ), [])


  const dimensions = Dimensions.get('window')
  const imageHeight = Math.round(dimensions.width * 9 / 16)
  const imageWidth = dimensions.width - 100



  return (<>
    {props.showFull && loading && <Loading />}

    {started && (<>

      {showConfirmCancel && (<Portal>
        <Modal visible={showConfirmCancel} onDismiss={hideConfirmCancel} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure to cancel?</H3>

          <Paragraph>
            This cannot be undone.
          </Paragraph>
          <Paragraph>
            Are you sure?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onConfirmCancel}>Yes, cancel</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmCancel}>No, continue</Button>
          </View>
        </Modal>
      </Portal>)}


      {showConfirmComplete && (<Portal>
        <Modal visible={showConfirmComplete} onDismiss={onConfirmComplete} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>One more step!</H3>

          <Paragraph>
            Congratulation!
          </Paragraph>
          <Paragraph>
            Click this button to confirm your completion!
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onConfirmComplete}>Complete!</Button>
          </View>
        </Modal>
      </Portal>)}


      {props.showFull && (<View style={{
        position: 'absolute', zIndex: 2,
        top: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Button mode="contained" onPress={onPressCancelChallenge} labelStyle={{ paddingBottom: 1 }}>
          <MaterialCommunityIcons name="close" size={14} />
          Cancel Challenge
        </Button>
      </View>)}

    </>)}


    {props.showFull && (<BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      style={{ zIndex: 10000 }}
    >

      <View style={{
        // flex: 0.17,
        height: currentChallenge.challenge_detail.type === 'discover' ? 65 : 110,
        // backgroundColor: '#00f',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'column', marginBottom: 10
      }}>
        <ChallengeBarIndividual />
      </View>


      {currentChallenge.challenge_detail.type == 'discover' && (<BottomSheetScrollView contentContainerStyle={{ zIndex: 10 }}>
        <View style={{
          flexDirection: 'row',
          paddingLeft: 10,
          paddingRight: 20,
          paddingVertical: 5
        }}>
          {currentSnapPoint === 0 ? (<>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
              <IconButton icon="camera" size={55} onPress={onOpenShareStory} />
            </View>
            <View style={{ flex: 0.8, flexDirection: 'row' }} contentContainerStyle={{ justifyContent: 'center' }}>
              {stories.map((story, i) => (<Avatar.Image key={`story-` + i} size={70} source={{ uri: story.picture }} style={{ marginRight: 10 }} />))}
            </View>
          </>) : (<>
            <View style={{ flex: 1, paddingHorizontal: 20, height: 140, flexDirection: 'column', marginBottom: 40 }}>
              <TouchableOpacity onPress={onOpenShareStory} style={{ flex: 1, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons size={55} name="camera" />
                <Text style={{ marginBottom: -6 }}>Share something on your wayy</Text>
              </TouchableOpacity>
            </View>
          </>)}
        </View>


        {currentSnapPoint != 0 && (<View style={{ flex: 1 }}>
          {stories.map((story, i) => (<View key={`story-` + i} style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
            <Avatar.Image size={60} source={{ uri: story.user_detail.avatar }} style={{ marginRight: 10, width: 60 }} />

            <View>
              <View>
                <Text style={{ color: colors.primary }}>{story.user_detail.username}</Text>
              </View>
              <View style={{ marginLeft: 5 }}>
                <Text>{story.content}</Text>
              </View>
              {story.picture != null && <Image source={{ uri: story.picture }} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />}
            </View>
          </View>))}
        </View>)}
      </BottomSheetScrollView>)}

    </BottomSheet>)}


    {showShareStoryModal && (<View style={{ zIndex: 12, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <TakePicture showAskImgSource={showAskImgSource} hideAskImgSource={hideAskImgSource} onCloseShareStory={onCloseShareStory} callbackSubmitShareStory={callbackSubmitShareStory} />
    </View>)}


  </>)
}

const styles = StyleSheet.create({
})

export default ChallengeStartActionsIndividual