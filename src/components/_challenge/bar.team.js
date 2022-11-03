import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, ProgressBar, MD3Colors, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { useGlobals } from '../../contexts/global'
import PercentageCircle from 'react-native-percentage-circle'
import { secToTime } from '../../utils/timer'
import haversine from 'haversine'
import { useInterval } from '../../hooks/use-interval'


function ChallengeBarTeam(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion, trackStep, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, started, completed, startTime, joined }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  /*
   * Start tracking and checking if completed.
   * Only when the challenge is started and not completed.
   */
  const [distFromStartToTarget, setDistFromStartToTarget] = useState(null)
  // let _timeLastCheck = new Date(Date.now())
  // const [timeLastCheck, setTimeLastCheck] = useState(new Date(Date.now()))
  // const [checked, setChecked] = useState(false)
  useEffect(() => {
    // console.log('['+loggedUser.username+'] [bar.team] got hereeee', ' | started =', started, ' | completed =', completed, ' currentLocation =', JSON.stringify(currentLocation))

    // let _newTime = new Date(Date.now())

    // console.log('['+loggedUser.username+'] [bar.team] timeLastCheck =', timeLastCheck, ' | _newTime =', _newTime)

    if (started && startTime != null && currentChallenge != null && joined === currentChallenge._id && currentLocation != null) {

      if (distFromStartToTarget == null) {
        if (currentChallenge.challenge_detail.type === 'discover') {
          const dist_from_start_to_target = haversine(currentLocation, currentChallenge.challenge_detail.place_detail.coordinates) || 0
          setDistFromStartToTarget(dist_from_start_to_target)
        } else {
          setDistFromStartToTarget(-1)
        }
      }

      // if (checked === false || _newTime.getTime() - timeLastCheck.getTime() > 10000) { //! only recheck every X seconds
      // _timeLastCheck = _newTime

      console.log('[' + loggedUser.username + '] [bar.team] got hereeee', ' | started =', started, ' | completed =', completed, ' currentLocation =', JSON.stringify(currentLocation))

      if (completed === 0) {
        // setTimeLastCheck(_newTime)
        // if (checked === false) setChecked(true)
        checkComplete()
      } else if (completed > 0) {
        setDistToTarget(0)
      }
      // }
    }
    // else if (completed === 5) {
    //   navigation.navigate('ChallengeStack', { screen: 'ChallengeListMap' })
    // }
  }, [started, joined, startTime, completed, trackLoc, trackMemberDistStates])

  // useInterval(() => {
  //   if (started && startTime != null && completed === 0 && currentLocation != null) {
  //     if (completed === 0) {
  //       checkComplete()
  //     } else if (completed > 0) {
  //       setDistToTarget(0)
  //     }
  //   }
  // }, 40000)


  /* **********************************************
   *
   * Calculate distance from target, 
   * to detect if the user arrived the destination
   *
   * **********************************************/
  const [distToTarget, setDistToTarget] = useState(-1)
  const checkComplete = () => {
    console.log('[' + loggedUser.username + '] [bar.team][checkComplete] currentLocation', currentLocation, ' | trackLoc.distanceTravelled =', trackLoc.distanceTravelled, ' | currentChallenge.challenge_detail.distance =', currentChallenge.challenge_detail.distance)
    // console.log('['+loggedUser.username+'] [bar.team][checkComplete] CALLED')

    if (currentChallenge.challenge_detail.type === 'walk') {
      /*
       * For walk challenge, in team mode, complete is when total distance that members walked reached required distance.
       */
      const totDist = Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0)
      console.log('[' + loggedUser.username + '] [bar.team][checkComplete] totDist =', totDist, ' | currentChallenge.challenge_detail.distance =', currentChallenge.challenge_detail.distance)

      if (totDist >= currentChallenge.challenge_detail.distance - 0.01) { //? identify as completed
        // if (totDist > 0.01) { //? identify as completed
        //console.log('['+loggedUser.username+'] [bar.team][checkComplete] completed !')
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

      // console.log('[' + loggedUser.username + '] [bar.team] trackLoc.prevLatLng', trackLoc.prevLatLng)
      if (Object.keys(trackLoc.prevLatLng).length > 0) {
        const dist_to_target = haversine(trackLoc.prevLatLng, currentChallenge.challenge_detail.place_detail.coordinates) || 0

        setDistToTarget(dist_to_target)

        console.log('[' + loggedUser.username + '] >>> dist_to_target', dist_to_target)

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
  // useEffect(() => {
  //   console.log('['+loggedUser.username+'] [bar.team] startTime', startTime)
  //   const interval = setInterval(() => {
  //     setTime(lastTimerCount => {
  //       if (lastTimerCount == null) {
  //         if (startTime != null) {
  //           const now = new Date()
  //           const seconds = (now.getTime() - startTime.getTime()) / 1000

  //           // console.log('['+loggedUser.username+'] [bar.individual.discover] seconds', seconds)
  //           return seconds
  //         }
  //       }
  //       else {
  //         if (currentChallenge != null) {
  //           // console.log('['+loggedUser.username+'] [bar.individual] startTime', startTime)

  //           // lastTimerCount <= 1 && clearInterval(interval)
  //           // if (!started || startTime == null) {
  //           //   clearInterval(interval)
  //           // }
  //           if (started && completed !== 0) {
  //             clearInterval(interval)
  //           }
  //           else if (started && completed === 0 && startTime != null) {
  //             // console.log('['+loggedUser.username+'] [bar.individual.discover] lastTimerCount + 1', lastTimerCount + 1)
  //             return lastTimerCount + 1
  //           }
  //         }
  //       }

  //       return null
  //     })
  //   }, 1000) //? each count lasts for a second

  //   /* cleanup the interval on complete */
  //   return () => clearInterval(interval)
  // }, [started, startTime])
  useInterval(() => {
    // console.log('trackMemberStepStates', trackMemberStepStates)
    setTime(lastTimerCount => {
      if (lastTimerCount == null) {
        if (startTime != null) {
          const now = new Date()
          const seconds = (now.getTime() - startTime.getTime()) / 1000

          // console.log('['+loggedUser.username+'] [bar.individual.discover] seconds', seconds)
          return seconds
        }
      }
      else {
        return lastTimerCount + 1
      }
    })
  }, 1000)


  return (<>
    {started && joined === currentChallenge._id ? (<>

      {currentChallenge.challenge_detail.type === 'walk' && <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TextBold style={{ fontSize: 30, lineHeight: 30 }}>
          {time != null ? secToTime(time) : '--:--:--'}
        </TextBold>
        <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 30 }}>Time</Text>
      </View>}


      <View style={{ marginTop: currentChallenge.challenge_detail.type === 'walk' ? 10 : -5, flexDirection: 'row' }}>

        {currentChallenge.challenge_detail.type === 'walk' && (<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
            <PercentageCircle radius={30} percent={Math.min(100, 100 * Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0) / (currentChallenge.challenge_detail.distance - 0.01))} color={MD3Colors.primary10}>
              <TextBold style={{ fontSize: 24, lineHeight: 50 }}>
                {Object.values(trackMemberDistStates).length === 0 ? 0
                  : Math.round(Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0) * 10) / 10}
              </TextBold>
            </PercentageCircle>
            <Badge style={{ position: 'absolute', zIndex: 1, top: 0 }}>
              {Math.round(trackLoc.distanceTravelled * 10) / 10}
            </Badge>
            <Text style={styles.subtxt}>km walked</Text>
          </View>
        </View>)}

        {currentChallenge.challenge_detail.type === 'discover' && (<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
            <PercentageCircle radius={30} percent={(distToTarget > -1 && distFromStartToTarget != null) ? 100 * distToTarget / distFromStartToTarget : 0} color={MD3Colors.primary10}>
              <TextBold style={{ fontSize: 24, lineHeight: 50 }}>
                {distToTarget > -1 ? Math.round((distToTarget) * 10) / 10 : '--'}
              </TextBold>
            </PercentageCircle>
            <Text style={styles.subtxt}>km left</Text>
          </View>
        </View>)}



        {currentChallenge.challenge_detail.type === 'walk' && (<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'transparent', alignItems: 'center' }}>
            {/* <PercentageCircle radius={30} percent={100} color={MD3Colors.primary20}> */}
            <View>
              <TextBold style={{ fontSize: 24, lineHeight: 50 }}>
                {Object.values(trackMemberStepStates).length === 0 ? 0
                  : Object.values(trackMemberStepStates).reduce((a, b) => a + b, 0)}
              </TextBold>
            </View>
            {/* </PercentageCircle> */}
            <Badge style={{ position: 'absolute', zIndex: 1, top: 0 }}>
              {trackStep.currentStepCount}
            </Badge>
            <Text style={styles.subtxt}>steps</Text>
          </View>
        </View>)}

        {currentChallenge.challenge_detail.type === 'discover' && (<View style={{ flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 4 }}>
          <TextBold style={{ fontSize: 30, lineHeight: 30 }}>
            {time != null ? secToTime(time) : '--:--:--'}
          </TextBold>
          <Text style={{ fontSize: 13, marginLeft: 5, lineHeight: 15 }}>Time</Text>
        </View>)}

      </View>
    </>)
      : (<Text style={{ textAlign: 'center', lineHeight: 23, marginVertical: 6, marginHorizontal: 20 }}>Recorder will start counting once the host starts the challenge</Text>)
    }
  </>)
}

const styles = StyleSheet.create({
  subtxt: {
    fontSize: 13, color: '#999',
    lineHeight: 19
  }
})

export default ChallengeBarTeam