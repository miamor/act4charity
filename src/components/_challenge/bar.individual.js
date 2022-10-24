import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, ProgressBar, MD3Colors, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { useGlobals } from '../../contexts/global'
import PercentageCircle from 'react-native-percentage-circle'
import { msToTime, secToTime } from '../../utils/timer'
import haversine from 'haversine'


function ChallengeBarIndividual(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion, trackStep, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, started, completed, startTime }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challenge_accepted_data } = props
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id



  /*
   * Start tracking and checking if completed.
   * Only when the challenge is started and not completed.
   */
  const [distFromStartToTarget, setDistFromStartToTarget] = useState(null)
  useEffect(() => {
    console.log('[bar.individual] got hereeee', ' | started =', started, ' | startTime =', startTime, ' | completed =', completed, ' currentLocation =', JSON.stringify(currentLocation))

    if (started && startTime != null && completed === 0 && currentLocation != null) {
      if (distFromStartToTarget === null) {
        if (challengeDetail.type === 'discover') {
          const dist_from_start_to_target = haversine(currentLocation, challengeDetail.place_detail.coordinates) || 0
          setDistFromStartToTarget(dist_from_start_to_target)
        } else {
          setDistFromStartToTarget(-1)
        }
      }
      checkComplete()
    }
    // else if (completed === 5) {
    //   navigation.navigate('ChallengeStack', { screen: 'ChallengeListMap' })
    // }
  }, [trackLoc, started, startTime, completed])



  /* **********************************************
   *
   * Calculate distance from target, 
   * to detect if the user arrived the destination
   *
   * **********************************************/
  const [distToTarget, setDistToTarget] = useState(-1)
  const checkComplete = () => {
    //~console.log('[challenge.start][checkComplete] currentLocation', currentLocation, ' | trackLoc.distanceTravelled =', trackLoc.distanceTravelled, ' | challengeDetail.distance =', challengeDetail.distance)

    if (challengeDetail.type === 'walk') {
      /*
       * Walk challenge
       */

      if (trackLoc.distanceTravelled >= challengeDetail.distance) { //? identify as completed
      // if (trackLoc.distanceTravelled > 0.01) { //? identify as completed
        //console.log('[checkComplete] completed !')
        // setCompleted(1)
        onSetDispatch('setCompleted', 'completed', 1)
      }

    }

    else {
      /*
       * Discover challenge
       * ---
       * For discover challenge, in team mode, each member should reach target destination.
       * The challenge is completed when the host end the challenge.
       */

      // console.log('[bar.individual] trackLoc.prevLatLng', trackLoc.prevLatLng)
      if (Object.keys(trackLoc.prevLatLng).length > 0) {
        const dist_to_target = haversine(trackLoc.prevLatLng, challengeDetail.place_detail.coordinates) || 0

        setDistToTarget(dist_to_target)

        //console.log('>>> dist_to_target', dist_to_target)

        if (dist_to_target < 0.02) { //? identify as arrived
          // setCompleted(1)
          onSetDispatch('setCompleted', 'completed', 1)
        }
      }
    }
  }



  /* **********************************************
   *
   * Count time. Called every 1000
   *
   * **********************************************/
  const [time, setTime] = useState()
  useEffect(() => {
    //~console.log('[bar.individual] startTime', startTime)
    const interval = setInterval(() => {
      setTime(lastTimerCount => {
        if (lastTimerCount == null) {
          if (startTime != null) {
            const now = new Date()
            const seconds = (now.getTime() - startTime.getTime()) / 1000

            // console.log('[bar.individual.discover] seconds', seconds)
            return seconds
          }
        }
        else {
          if (currentChallenge != null) {
            // console.log('[bar.individual] startTime', startTime)

            // lastTimerCount <= 1 && clearInterval(interval)
            // if (!started || startTime == null) {
            //   clearInterval(interval)
            // }
            if (started && completed !== 0) {
              clearInterval(interval)
            }
            else if (started && completed === 0 && startTime != null) {
              // console.log('[bar.individual.discover] lastTimerCount + 1', lastTimerCount + 1)
              return lastTimerCount + 1
            }
          }
        }

        return null
      })
    }, 1000) //? each count lasts for a second

    /* cleanup the interval on complete */
    return () => clearInterval(interval)
  }, [started, startTime])


  return (<>

    {challengeDetail.type === 'walk' && (<View style={{ marginTop: 5, marginBottom: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <TextBold style={{ fontSize: 30, lineHeight: 30 }}>
        {time != null ? secToTime(time) : '--:--:--'}
      </TextBold>
      <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 30 }}>Time</Text>
    </View>)}


    <View style={{ marginTop: 6, flexDirection: 'row' }}>
      <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
        <View style={{ backgroundColor: 'transparent' }}>
          {challengeDetail.type === 'walk' && (<PercentageCircle radius={30} percent={trackLoc.distanceTravelled / challengeDetail.distance} color={MD3Colors.primary10}>
            <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
              {Math.round(trackLoc.distanceTravelled * 10) / 10}
            </TextBold>
          </PercentageCircle>)}

          {challengeDetail.type === 'discover' && (<PercentageCircle radius={30} percent={distToTarget > -1 && distFromStartToTarget != null ? distToTarget / distFromStartToTarget : 0} color={MD3Colors.primary10}>
            <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
              {distToTarget > -1 ? Math.round((distToTarget) * 10) / 10 : '--'}
            </TextBold>
          </PercentageCircle>)}
        </View>
      </View>

      {challengeDetail.type === 'walk' && (<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
        <View style={{ backgroundColor: 'transparent' }}>
          <PercentageCircle radius={30} percent={100} color={MD3Colors.primary20}>
            <TextBold style={{ fontSize: 26, lineHeight: 50 }}>
              {trackStep.currentStepCount}
            </TextBold>
          </PercentageCircle>
        </View>
      </View>)}

      {challengeDetail.type === 'discover' && (<View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
        <TextBold style={{ fontSize: 30, lineHeight: 30 }}>
          {time != null ? secToTime(time) : '--:--:--'}
        </TextBold>
        <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 15 }}>Time</Text>
      </View>)}

    </View>
  </>)
}

export default ChallengeBarIndividual