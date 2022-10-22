import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { Text } from './paper/typos'
import { useGlobals } from '../contexts/global'
import { useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/core'

import ChallengeStartMap from './_challenge/mapview'
import ChallengeStartActionsIndividual from './_challenge/actions.individual'
import ChallengeStartActionsTeam from './_challenge/actions.team'
import haversine from 'haversine'
import * as userAPI from '../services/userAPI'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeBottomSheet({ }) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, trackStep,
    completed, confirmCompleted, started, finished }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const challenge_accepted_data = currentChallenge
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
    console.log('[challenge.bottom][checkComplete] currentLocation', currentLocation, ' | trackLoc.distanceTravelled =', trackLoc.distanceTravelled, ' | challengeDetail.distance =', challengeDetail.distance)

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

        console.log('[challenge.bottom] >>> dist_to_target', dist_to_target)

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



  const [showFull, setShowFull] = useState(false)
  const openChallenge = () => {
    console.log('[challenge.bottom] challenge_accepted_data', challenge_accepted_data)
    navigation.navigate('_ChallengeDetailStart', { key: '_ChallengeDetailStart', challenge_accepted_data: currentChallenge })
  }



  return (<>
    <TouchableOpacity style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#aaaaaa2f',
      borderRadius: 6,
      paddingHorizontal: 15,
      paddingVertical: 10,
      // shadowRadius: 2,
      // shadowOffset: {
      //   width: 0,
      //   height: -3,
      // },
      shadowColor: '#888888',
      elevation: 4,

      flex: 1,
      zIndex: 10,
      position: 'absolute',
      bottom: 74,
      left: 10,
      right: 10
    }} onPress={openChallenge}>
      <Text style={{ color: colors.primary }} style={{ lineHeight: 22 }}>{currentChallenge.challenge_detail.name}</Text>
    </TouchableOpacity>

    {completed !== 4 && (<>

      <View style={{ flex: 0.9, flexDirection: 'row' }}>
        {challenge_accepted_data && <ChallengeStartMap
          challenge_accepted_data={challenge_accepted_data}
          showFull={showFull}
          onFinished={onFinished}
        />}
      </View>

      {challenge_accepted_data.mode === 'individual' ? (<ChallengeStartActionsIndividual challenge_accepted_data={challenge_accepted_data} showFull={showFull} />)
        : (<ChallengeStartActionsTeam challenge_accepted_data={challenge_accepted_data} showFull={showFull} />)}

    </>)}


  </>)
}

const styles = StyleSheet.create({
})

export default ChallengeBottomSheet
