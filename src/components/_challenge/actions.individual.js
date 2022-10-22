import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { DefaultView } from '../containers'
import CustomInput from '../paper/custom-input'
import { useGlobals } from '../../contexts/global'

import * as Location from 'expo-location'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY, TOKEN_KEY } from '../../constants/keys'
// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation'
import haversine from 'haversine'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import ViewShot from 'react-native-view-shot'
import Loading from '../animations/loading'

import * as userAPI from '../../services/userAPI'
import { useNavigation } from '@react-navigation/core'
import ChallengeBarDiscoverIndividual from './bar.individual.discover'
import ChallengeBarWalkIndividual from './bar.individual.walk'
import { REACT_APP_API_URL } from '../../services/APIServices'
import Storer from '../../utils/storer'
import TakePicture from './take-picture'
import axios from 'axios'


function ChallengeStartActionsIndividual(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion,
    completed, started }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challenge_accepted_data } = props
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id


  const [loading, setLoading] = useState(false)


  useEffect(() => {
    if (challengeDetail.type === 'discover') {
      setLoading(true)
      listStory()
    }
  }, [])

  useEffect(() => {
    // console.log('[actions.individual.func] currentLocation', currentLocation, ' | completed =', completed)

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
    userAPI.listStory({ challenge_id: challengeDetail._id }).then((res) => {
      /* done loading */
      setLoading(false)
      // console.log('res', res)
      if (res.status === 'success') {
        setStories(res.data)
      }
    }).catch(error => {
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
  const hideConfirmComplete = () => setShowConfirmCancel(false)
  const onComplete = () => {
    setShowConfirmComplete(true)
  }
  /* 
   * Confirm complete 
   */
  const onConfirmComplete = () => {
    console.log('[actions.individual.func][onConfirmComplete] CALLED ~')

    setShowConfirmComplete(false)
    // props.confirmCompleteCallback()

    userAPI.completeChallenge({
      challenge_accepted_id: challenge_accepted_id,
      challenge_donation: challengeDetail.donation,
      challenge_reward: challengeDetail.reward,
      participants: challengeDetail.participants,
    }).then((res) => {
      console.log('[confirmCompleteCallback] res', res)

      /* dispatch global states */
      /* set completed = 3 to take screenshot within `Map` view */
      onSetDispatch('setCompleted', 'completed', 3)

      /* done loading */
      setLoading(false)
    }).catch(error => {
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
    setShowConfirmCancel(false)
    // props.onConfirmCancel()

    /*
     * Update in db
     */
    userAPI.cancelChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('>> res', res)

      /* dispatch global states */
      onSetDispatch('setCompleted', 'completed', -1)

      /* out this screen */
      navigation.navigate('ChallengeStack', {
        screen: 'ChallengeListMapDiscover',
      })

      /* done loading */
      setLoading(false)
    }).catch(error => {
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
  const onSubmitShareStory = useCallback(async (postData) => {
    setLoading(true)

    const accessToken = await Storer.get(TOKEN_KEY)

    postData.append('challenge_accepted_id', challenge_accepted_id)
    postData.append('challenge_id', challengeDetail._id)
    postData.append('public', true)

    // console.log('>>> accessToken =', accessToken)
    // console.log('>>> ', REACT_APP_API_URL + '/user/challenges/share_story')
    // console.log('>>> postData =', JSON.stringify(postData))

    axios({
      method: 'POST',
      url: REACT_APP_API_URL + '/user/challenges/share_story',
      data: postData,
      headers: {
        'Authorization': accessToken,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      const res = response.data
      if (res.status === 'success') {
        console.log('[shareStory] res =', res)
        setLoading(false)
        setShowShareStoryModal(false)

        listStory()
      }
    }).catch(error => {
      console.error(error)
    })
  }, [])

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
    challengeDetail.type === 'discover' ? '25%' : '17%',
    challengeDetail.type === 'discover' ? '90%' : '17%'
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
      style={{ zIndex: 10 }}
    >

      <BottomSheetScrollView contentContainerStyle={{ zIndex: 10 }}>

        {challengeDetail.type === 'discover' ? <ChallengeBarDiscoverIndividual challenge_accepted_data={challenge_accepted_data} />
          : <ChallengeBarWalkIndividual challenge_accepted_data={challenge_accepted_data} />}


        {challengeDetail.type == 'discover' && (<>
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
              <View style={{ flex: 1, paddingHorizontal: 20, height: 100, flexDirection: 'column', marginBottom: 40 }}>
                <TouchableOpacity onPress={onOpenShareStory} style={{ flex: 1, borderRadius: 6, borderWidth: 2, borderColor: '#ddd', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' }}>
                  <MaterialCommunityIcons size={55} name="camera" />
                </TouchableOpacity>
              </View>
            </>)}
          </View>


          {currentSnapPoint != 0 && (<>
            {stories.map((story, i) => (<View key={`story-` + i} style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={{ uri: story.user_detail.avatar }} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>{story.content}</Text>
                </View>
                {story.picture != null && <Image source={{ uri: story.picture }} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />}
              </View>
            </View>))}
          </>)}
        </>)}

      </BottomSheetScrollView>
    </BottomSheet>)}


    {showShareStoryModal && (<View style={{ zIndex: 12, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <TakePicture showAskImgSource={showAskImgSource} hideAskImgSource={hideAskImgSource} onCloseShareStory={onCloseShareStory} onSubmitShareStory={onSubmitShareStory} />
    </View>)}


  </>)
}

const styles = StyleSheet.create({
})

export default ChallengeStartActionsIndividual