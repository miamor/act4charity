import React, { useCallback, useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { H3, Text } from '../components/paper/typos'
import { useGlobals } from '../contexts/global'
import { Badge, Button, MD3Colors, useTheme } from 'react-native-paper'
import { useNavigation } from '@react-navigation/core'

import ChallengeStartMap from '../components/_challenge/mapview'
import ChallengeStartActionsIndividual from '../components/_challenge/actions.individual'
import ChallengeStartActionsTeam from '../components/_challenge/actions.team'
import haversine from 'haversine'
import * as userAPI from '../services/userAPI'
import Storer from '../utils/storer'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeBottomSheet({ }) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, trackStep,
    completed, started, startTime, showBottomBar }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const challenge_accepted_data = currentChallenge
  const challenge_accepted_id = challenge_accepted_data._id
  const challengeDetail = challenge_accepted_data.challenge_detail


  /*
   * If is `individual` mode, start now.
   * If is `team` mode, needs the host to click Start => is handled in `actions.team`
   */
  const startNow = async () => {
    //~console.log('[challenge.start] startNow CALLED')

    await Storer.set('started', true)
    onSetDispatch('setStarted', 'started', true)

    await Storer.set('completed', 0)
    onSetDispatch('setCompleted', 'completed', 0)

    const dt = new Date()
    await Storer.set('startTime', dt)
    //~console.log('[challenge.start] startTime == ', dt)
    onSetDispatch('setStartTime', 'startTime', dt)
  }
  useEffect(() => {
    //~console.log('[challenge.start] startTime', startTime)
    if (!started && currentChallenge != null && currentChallenge.mode === 'individual') {
      startNow()
    }
  }, [started, currentChallenge, startTime])




  /* **********************************************
   *
   * On receive updates from child components
   * 
   * ---
   * 
   * Really finish challenge
   *
   * **********************************************/
  const onFinished = useCallback((obj) => {
    console.log('[challenge.bottom][onFinished] CALLED')
    
    // navigation.navigate('_ChallengeDetailCompleted', {
    //   key: '_ChallengeDetailCompleted',

    //   challengeDetail: obj.challengeDetail,
    //   challenge_accepted_id: obj.challenge_accepted_id,
    //   captured_image: obj.uri,

    //   distanceTravelled: obj.distanceTravelled,
    //   routeCoordinates: obj.routeCoordinates,

    //   trackMemberLocationStates: obj.trackMemberLocationStates,
    //   trackMemberStepStates: obj.trackMemberStepStates,
    // })
  }, [])



  const [showFull, setShowFull] = useState(false)
  const openChallenge = () => {
    // //console.log('[challenge.bottom] challenge_accepted_data', challenge_accepted_data)
    navigation.navigate('_ChallengeDetailStart', {
      key: '_ChallengeDetailStart',
      challenge_accepted_data: currentChallenge
    })
    // navigation.navigate('DashboardStack')
    // Storer.set('currentChallenge', currentChallenge)
    // onSetDispatch('setCurrentChallenge', 'currentChallenge', currentChallenge)
    // console.log('[challenge.bottom] openChallenge CALLED')
    // // onSetDispatch('setShowBottomBar', 'showBottomBar', true)
    // setShowFull(true)
  }
  const onMinimize = () => {
    setShowFull(false)
  }


  const { width } = Dimensions.get('window')


  return (<View style={{
    position: 'absolute',
    bottom: 0, right: 0, left: 0,
  }}>
    {!showFull && <TouchableOpacity style={{
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#a2a2a22f',
      borderRadius: 6,
      paddingHorizontal: 15,
      paddingVertical: 10,
      // shadowRadius: 2,
      // shadowOffset: {
      //   width: 0,
      //   height: -3,
      // },
      shadowColor: '#777',
      elevation: 4,

      flex: 1,
      zIndex: 10,
      position: 'absolute',
      bottom: 74,
      left: 10,
      // right: 10,
      width: width * 2 / 3,

      flexDirection: 'row',
      justifyContent: 'center',
    }} onPress={openChallenge}>
      <Image style={{ height: 30, width: 30, marginLeft: 0, marginRight: 5, zIndex: 3, alignSelf: 'center' }}
        source={currentChallenge.challenge_detail.type == 'walk' ? require('../../assets/icons/walking.png') : require('../../assets/icons/discover.png')} />

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11, color: '#999', lineHeight: 15 }}>Ongoing challenge</Text>
        <Text style={{ color: colors.primary, fontWeight: 'normal', lineHeight: 20, fontSize: 14.5 }}>
          {currentChallenge.challenge_detail.name}
        </Text>
        <Badge style={{
          paddingHorizontal: 8, position: 'absolute', right: -8, marginTop: -3, 
          lineHeight: 9, fontSize: 8, height: 16,
          backgroundColor: currentChallenge.mode === 'individual' ? MD3Colors.primary40 : MD3Colors.primary25
        }}>{currentChallenge.mode}</Badge>
      </View>
    </TouchableOpacity>}

    {completed !== 4 && (<>

      <View style={{ flex: 0.9, flexDirection: 'row' }}>
        {challenge_accepted_data && <ChallengeStartMap
          challenge_accepted_data={challenge_accepted_data}
          showFull={showFull}
          onFinished={onFinished}
        />}
      </View>

      {challenge_accepted_data.mode === 'individual' ? (
        <ChallengeStartActionsIndividual
          challenge_accepted_data={challenge_accepted_data}
          showFull={showFull}
        />
      )
        : (
          <ChallengeStartActionsTeam
            challenge_accepted_data={challenge_accepted_data}
            showFull={showFull}
          />
        )}

      {/* {showFull && <Button onPress={onMinimize} style={{ backgroundColor: '#0f0' }}>Back</Button>} */}

    </>)}


  </View>)
}

const styles = StyleSheet.create({
})

export default ChallengeBottomSheet
