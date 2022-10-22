import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, ProgressBar, MD3Colors, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import { CURRENT_CHALLENGE_KEY, GOOGLE_API_KEY } from '../../constants/keys'
import haversine from 'haversine'

import PercentageCircle from 'react-native-percentage-circle'
import ViewShot from 'react-native-view-shot'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'
import ChallengeStartMap from '../../components/_challenge/mapview'
import ChallengeStartActionsIndividual from '../../components/_challenge/actions.individual'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, trackStep,
    completed, confirmCompleted, started, finished }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challenge_accepted_data } = route.params
  const challenge_accepted_id = challenge_accepted_data._id
  const challengeDetail = challenge_accepted_data.challenge_detail


  useEffect(() => {
    if (completed === 0 && currentLocation != null) {
      checkComplete()
    }
    else if (completed === 5) {
      navigation.navigate('ChallengeStack', { screen: 'ChallengeListMap' })
    }
  }, [completed, currentLocation, trackLoc])



  /* **********************************************
   *
   * Calculate distance from target, 
   * to detect if the user arrived the destination
   *
   * **********************************************/
  const checkComplete = () => {
    console.log('[challenge.start.walk][checkComplete] currentLocation', currentLocation, ' | trackLoc.distanceTravelled =', trackLoc.distanceTravelled, ' | challengeDetail.distance =', challengeDetail.distance)

    if (challengeDetail.type === 'walk') {
      // if (trackLoc.distanceTravelled > challengeDetail.distance) { //? identify as completed
      if (trackLoc.distanceTravelled > 0.01) { //? identify as completed
        console.log('[checkComplete] completed !')
        // setCompleted(1)
        onSetDispatch('setCompleted', 'completed', 1)
      }
    }
    else {
      if (Object.keys(trackLoc.prevLatLng).length > 0) {
        const dist_to_target = haversine(trackLoc.prevLatLng, challengeDetail.place_detail.coordinates) || 0

        console.log('>>> dist_to_target', dist_to_target)

        if (dist_to_target < 0.2) { //? identify as arrived
          // setCompleted(1)
          onSetDispatch('setCompleted', 'completed', 1)
        }
      }
    }
  }



  /* **********************************************
   *
   * On receive updates from child components
   * 
   * ---
   * 
   * Really finish challenge
   *
   * **********************************************/
  const onFinished = useCallback((uri) => {
    navigation.navigate('_ChallengeDetailCompleted', {
      key: '_ChallengeDetailCompleted',
      challengeDetail: challengeDetail,
      distanceTravelled: trackLoc.distanceTravelled,
      routeCoordinates: trackLoc.routeCoordinates,
      captured_image: uri,
      challenge_accepted_id: challenge_accepted_data._id,
    })
  }, [])




  /* **********************************************
   *
   * Set currentChallenge global variable after back, so that when exit this screen, the current challenge will display at bottom bar
   *
   * **********************************************/
  useEffect(() => {
    onSetDispatch('setShowBottomBar', 'showBottomBar', false)

    if (completed === 0 && (currentChallenge == null || challenge_accepted_data._id !== currentChallenge._id)) {
      Storer.set(CURRENT_CHALLENGE_KEY, challenge_accepted_data)
      onSetDispatch('setCurrentChallenge', 'currentChallenge', challenge_accepted_data)
      console.log('set Storage var !')
    }
  }, [completed])
  useEffect(() => {
    if (completed === 0) {
      navigation.addListener('beforeRemove', (e) => {
        onSetDispatch('setShowBottomBar', 'showBottomBar', true)
      })
    }
  }, [navigation, completed])



  return (
    <DefaultView>

      {completed !== 4 && (<>

        <View style={{ flex: 0.9, flexDirection: 'row' }}>
          {challenge_accepted_data && <ChallengeStartMap
            challenge_accepted_data={challenge_accepted_data}
            showFull={true}
            onFinished={onFinished}
          />}
        </View>

        {challenge_accepted_data.mode === 'individual' ? (<ChallengeStartActionsIndividual challenge_accepted_data={challenge_accepted_data} showFull={true} />)
          : (<ChallengeStartActionsTeam challenge_accepted_data={challenge_accepted_data} showFull={true} />)}

      </>)}

    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeStartScreen
