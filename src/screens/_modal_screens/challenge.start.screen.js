import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, ProgressBar, MD3Colors, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import haversine from 'haversine'

import PercentageCircle from 'react-native-percentage-circle'
import ViewShot from 'react-native-view-shot'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import Storer from '../../utils/storer'
import ChallengeStartMap from '../../components/_challenge/mapview'
import ChallengeStartActionsIndividual from '../../components/_challenge/actions.individual'
import ChallengeStartActionsTeam from '../../components/_challenge/actions.team'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, trackStep,
    completed, started, startTime }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  // useEffect(() => {
  //   console.log('currentChallenge =', currentChallenge)
  // }, [])


  // const [reloaded, setReloaded] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      doReload()
    }, 60000) //? reload every 60 seconds

    /* cleanup the interval on complete */
    return () => clearInterval(interval)
  }, [])

  const doReload = () => {
    // console.log('[challenge.start][doReload] CALLED ~~')

    if (currentChallenge != null) {
      userAPI.getChallengeAcceptedStatus({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        console.log('[challenge.start][doReload] res =', res)

        if (res.data != null && res.data.active !== currentChallenge.active && currentChallenge._id === currentChallenge._id) {
          const currentChallenge_updated = {
            ...currentChallenge,
            active: res.data.active,
          }
          Storer.set('currentChallenge', currentChallenge_updated)
          onSetDispatch('setCurrentChallenge', 'currentChallenge', currentChallenge_updated)
        }
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }


  /*
   * If is `individual` mode, start now.
   * If is `team` mode, needs the host to click Start => is handled in `actions.team`
   */
  const startNow = async () => {
    console.log('[challenge.start] startNow CALLED')

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
    // console.log('[challenge.start] started =', started, ' | startTime =', startTime, ' | currentChallenge =', currentChallenge)
    console.log('[challenge.start] started =', started, ' | startTime =', startTime)

    if ((!started || startTime == null) && currentChallenge != null && currentChallenge.mode === 'individual') {
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
    console.log('[challenge.start][onFinished] CALLED')

    // navigation.navigate('_ChallengeDetailCompleted', {
    //   key: '_ChallengeDetailCompleted',

    //   currentChallenge.challenge_detail: obj.currentChallenge.challenge_detail,
    //   currentChallenge._id: obj.currentChallenge._id,
    //   captured_image: obj.uri,

    //   distanceTravelled: obj.distanceTravelled,
    //   routeCoordinates: obj.routeCoordinates,

    //   trackMemberLocationStates: obj.trackMemberLocationStates,
    //   trackMemberStepStates: obj.trackMemberStepStates,
    // })
  }, [])


  /* **********************************************
   *
   * On canceled
   * 
   * ---
   * 
   * Things been cleaned up
   *
   * **********************************************/
  const onCanceled = useCallback((obj) => {
    // navigation.navigate('ChallengeStack', {
    //   screen: 'ChallengeListMapDiscover'
    // })
    navigation.navigate('DashboardStack')
    // navigation.navigate('ChallengeStack', {
    //     screen: 'ChallengeDetailInfo',
    //     params: { key: 'ChallengeDetailInfo', currentChallenge.challenge_detail: obj }
    // })
  }, [])



  /* **********************************************
   *
   * Set currentChallenge global variable after back, so that when exit this screen, the current challenge will display at bottom bar
   *
   * **********************************************/
  useEffect(() => {
    onSetDispatch('setShowBottomBar', 'showBottomBar', false)

    // if (completed === 0 && (currentChallenge == null || currentChallenge._id !== currentChallenge._id)) {
    //   Storer.set('currentChallenge', currentChallenge)
    //   onSetDispatch('setCurrentChallenge', 'currentChallenge', currentChallenge)
    //   //console.log('set Storage var !')
    // }
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

      {currentChallenge != null && completed !== 4 && (<>

        <View style={{ flex: 0.9, flexDirection: 'row' }}>
          <ChallengeStartMap
            // challenge_accepted_data={currentChallenge}
            showFull={true}
            onFinished={onFinished}
            onCanceled={onCanceled}
          />
        </View>

        {currentChallenge.mode === 'individual' ? (
          <ChallengeStartActionsIndividual showFull={true} />
        )
          : (
            <ChallengeStartActionsTeam showFull={true} />
          )}

      </>)}

    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default ChallengeStartScreen
