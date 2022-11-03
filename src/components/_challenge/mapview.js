import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image, TouchableHighlight } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { DefaultView } from '../containers'
import { useGlobals } from '../../contexts/global'

import * as Location from 'expo-location'
import MapView, { Callout, Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY } from '../../constants/keys'
// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation'
import haversine from 'haversine'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import ViewShot from 'react-native-view-shot'
import Loading from '../animations/loading'

import * as userAPI from '../../services/userAPI'
import { useNavigation } from '@react-navigation/core'
import Storer from '../../utils/storer'
import { members_colors } from '../../utils/vars'
import { Pedometer } from 'expo-sensors'
import { useInterval } from '../../hooks/use-interval'

// import { ImageManipulator } from 'expo'


function ChallengeStartMap(props) {
  const [{ currentChallenge, loggedUser, currentLocation, trackLoc, currentRegion, trackStep,
    trackMemberStartStates, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, membersJoinStatus,
    completed, teamCompleted, started, startTime, finished, donation, joined
  }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const [loading, setLoading] = useState(false)

  const [captured, setCaptured] = useState(false)


  useEffect(() => {
    /*
     * canceled
     */
    if (completed === -1) {
      console.log('[' + loggedUser.username + '] [mapview] completed = -1 !!!! Canceled !!!!')

      // props.onCanceled(challengeDetail)
      navigation.navigate('DashboardStack')

      cleanUp()
    }

    /*
     * individual confirmed completed if in individual mode
     * host confirmed ended if in team mode 
     */
    else if (completed === 3 && captured === false) {
      setCaptured(true)
      takeScreenshot()
      // onSetDispatch('setCompleted', 'completed', 3.5)
    }
  }, [started, captured, completed])


  const [startCoord, setStartCoord] = useState()
  useEffect(() => {
    // console.log('[' + loggedUser.username + '] [mapview] (start or update) started =', started, ' | startTime =', startTime)
    /*
     * only when not detected completed should the tracking be enabled
     */
    if (currentLocation != null) {
      if (started && startTime != null && completed === 0) {
        processPosition(currentLocation)
      }

      if (startCoord == null) {
        setStartCoord({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude
        })
      }
    }
  }, [started, startTime, completed, currentLocation])


  /* **********************************************
   *
   * Reload every X seconds to check the true status of this challenge
   * (in case team challenge, the host cancelled or ended)
   *
   * **********************************************/
  useEffect(() => {
    if (currentChallenge.mode === 'team' && completed < 3) {
      const interval = setInterval(() => {
        doReload()
      }, 120000) //? reload every 120 seconds

      /* cleanup the interval on complete */
      return () => clearInterval(interval)
    }
  }, [])

  const doReload = () => {
    console.log('['+loggedUser.username+'] [challenge.start][doReload] CALLED ~~')

    if (currentChallenge != null) {
      userAPI.getChallengeAcceptedStatus({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        console.log('[' + loggedUser.username + '] [mapview][doReload] res =', res)

        if (res.data != null && res.data.active !== currentChallenge.active && currentChallenge._id === currentChallenge._id) {
          const currentChallenge_updated = {
            ...currentChallenge,
            active: res.data.active,
          }
          // Storer.set('currentChallenge', currentChallenge_updated)
          // onSetDispatch('setCurrentChallenge', 'currentChallenge', currentChallenge_updated)
          if (res.data.active === 2) {
            onSetDispatch('setCompleted', 'completed', 3)
          } else {
            onSetDispatch('setCompleted', 'completed', res.data.active)
          }
        }
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }



  /* **********************************************
   *
   * Step counter
   * 
   * -------------------
   * Retrieve data, dispatch to all screens
   *
   * **********************************************/
  /*
   * Subscribe so that the app will track the user's step without asking for permission again
   */
  // let _subscriptionPedometer = null
  // const subscribePedometer = () => {
  //   //console.log('['+loggedUser.username+'] [sensors][subscribePedometer] >>> CALLED')

  //   _subscriptionPedometer = Pedometer.watchStepCount(result => {
  //     setStepCounterStatus(1)

  //     //console.log('['+loggedUser.username+'] [sensors] dispatch setTrackStep ', result)

  //     // if (result.steps - trackStep.currentStepCount > 3) {
  //     onSetDispatch('setTrackStep', 'trackStep', {
  //       ...trackStep,
  //       currentStepCount: result.steps
  //     })
  //     // }
  //   })
  // }
  // const unsubscribePedometer = () => {
  //   _subscriptionPedometer = null
  // }
  // useEffect(() => {
  //   if (started && startTime != null)
  //   subscribePedometer()
  //   return unsubscribePedometer()
  // }, [started, startTime, joined, currentChallenge])
  // useInterval(() => {
  //   if (currentChallenge.challenge_detail.type === 'walk' && started && startTime != null &&
  //     (currentChallenge.mode === 'individual' ||
  //       (currentChallenge.mode === 'team' && joined === currentChallenge._id)
  //     )
  //     && completed === 0
  //   ) {
  //     console.log('[' + loggedUser.username + '] [mapview] getting step from startTime till now')
  //     const end = new Date(Date.now()) //? now
  //     Pedometer.getStepCountAsync(startTime, end).then(result => {
  //       // this.setState({ pastStepCount: result.steps })
  //       onSetDispatch('setTrackStep', 'trackStep', {
  //         ...trackStep,
  //         currentStepCount: result.steps
  //       })
  //     })
  //   }
  // }, 2000)




  /* **********************************************
   *
   * Take screenshot when finished
   *
   * **********************************************/
  const ref_mapview = useRef()
  const takeScreenshot = () => {
    console.log('[' + loggedUser.username + '] [mapview] takeScreenshot CALLED | donation =', donation)

    /* so that won't capture again */
    setCaptured(true)

    const participants_names = currentChallenge.participants_details.map(user => {
      if (membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] > 0) {
        return user.firstname
      }
      else {
        return null
      }
    }).filter(v => v)

    const obj = {
      challengeDetail: currentChallenge.challenge_detail,
      challenge_accepted_id: currentChallenge._id,
      distanceTravelled: trackLoc.distanceTravelled,
      routeCoordinates: trackLoc.routeCoordinates,
      trackMemberLocationStates,
      trackMemberStepStates,

      donation_amount: donation[0],
      reward_amount: donation[1],

      participants_names: participants_names,
    }

    // const { width, height } = Dimensions.get('window')
    ref_mapview.current.capture().then(async (uri) => {
      //console.log('['+loggedUser.username+'] >>>> captured uri', uri)
      setLoading(true)

      // const newImage = await ImageManipulator.manipulate(
      //   uri,
      //   [{ resize: { width: width/2, height: height/2 } }],
      //   { format: 'jpg' }
      // )
      

      navigation.navigate('_ChallengeDetailCompleted', {
        key: '_ChallengeDetailCompleted',

        challengeDetail: obj.challengeDetail,
        challenge_accepted_id: obj.challenge_accepted_id,
        captured_image: uri,

        distanceTravelled: obj.distanceTravelled,
        routeCoordinates: obj.routeCoordinates,

        trackMemberLocationStates: obj.trackMemberLocationStates,
        trackMemberStepStates: obj.trackMemberStepStates,

        donation_amount: obj.donation_amount,
        reward_amount: obj.reward_amount,

        participants_names: obj.participants_names
      })

      /* clean up and call callback */
      await cleanUp()

      setLoading(false)
    }).catch(async (error) => {
      setLoading(true)

      navigation.navigate('_ChallengeDetailCompleted', {
        key: '_ChallengeDetailCompleted',

        challengeDetail: obj.challengeDetail,
        challenge_accepted_id: obj.challenge_accepted_id,
        captured_image: null,

        distanceTravelled: obj.distanceTravelled,
        routeCoordinates: obj.routeCoordinates,

        trackMemberLocationStates: obj.trackMemberLocationStates,
        trackMemberStepStates: obj.trackMemberStepStates,

        donation_amount: obj.donation_amount,
        reward_amount: obj.reward_amount,

        participants_names: obj.participants_names
      })

      /* clean up and call callback */
      await cleanUp()

      setLoading(false)
    })

  }



  /* **********************************************
   *
   * Clean up
   *
   * **********************************************/
  const cleanUp = async () => {
    console.log('[' + loggedUser.username + '] [mapview] cleanUp CALLED')

    await Storer.delete('currentChallenge')
    onSetDispatch('setCurrentChallenge', 'currentChallenge', null)

    await Storer.set('joined', null)
    onSetDispatch('setJoined', 'joined', null)

    await Storer.delete('startTime')
    onSetDispatch('setStartTime', 'startTime', null)

    // // await Storer.delete('donation')
    // // onSetDispatch('setDonation', 'donation', [0, 0])

    // // onSetDispatch('setFinished', 'finished', false)
    // onSetDispatch('setTrackMemberStartStates', 'trackMemberStartStates', {})
    // onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', {})
    // onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', {})
    // onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', {})
    // onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', {})
    // onSetDispatch('setCompletedMembers', 'completedMembers', [])
    // onSetDispatch('setChatMessages', 'chatMessages', [])
    // onSetDispatch('setPrivateSockMsgs', 'privateSockMsgs', [])
    // onSetDispatch('setPrivateSockMsg', 'privateSockMsg', null)
    // onSetDispatch('setProcessedPrivateSockMsgs', 'processedPrivateSockMsgs', 0)
    // onSetDispatch('setTeamCompleted', 'teamCompleted', 0)
    onSetDispatch('setTrackLoc', 'trackLoc', {
      ...trackLoc,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
    })
    onSetDispatch('setTrackStep', 'trackStep', {
      distanceTravelled: 0,
      currentStepCount: 0
    })

    // onSetDispatch('setShowBottomBar', 'showBottomBar', false)

    // onSetDispatch('setCompleted', 'completed', 4)

    await Storer.set('started', false)
    //! don't do this. reset completed when start a challenge
    // onSetDispatch('setStarted', 'started', false)

  }



  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/

  /* 
   * To set region on map
   */
  const onRegionChange = (value) => {
    onSetDispatch('setCurrentRegion', 'currentRegion', value)
  }


  /*
   * Process retrieved lng lat 
   */
  const processPosition = async (position) => {
    setLoading(false)

    console.log('[' + loggedUser.username + '] [mapview] processPosition CALLED ', position)

    onSetDispatch('setCurrentRegion', 'currentRegion', {
      ...currentRegion,
      latitude: position.latitude,
      longitude: position.longitude,
    })

    updateTrackState(position)

    // props.onUpdateLocation(position)
  }



  /* **********************************************
   *
   * Keep track of the user's route
   *
   * **********************************************/
  /*
   * Calculate distance travelled
   */
  const calcDistance = (newLatLng) => {
    const { prevLatLng } = trackLoc
    return haversine(prevLatLng, newLatLng) || 0
  }

  /*
   * Update track state
   */
  const updateTrackState = (newCoordinate) => {
    // console.log('[' + loggedUser.username + '] [mapview][updateTrackState] CALLED')

    //? update user's position and user's route
    const { coordinate, routeCoordinates, distanceTravelled } = trackLoc

    const track_loc_state = {
      // latitude: newCoordinate.latitude,
      // longitude: newCoordinate.longitude,
      routeCoordinates: routeCoordinates.concat([newCoordinate]),
      distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
      prevLatLng: newCoordinate,
    }

    console.log('['+loggedUser.username+'] [mapview][updateTrackState] dispatch setTrackLoc ', JSON.stringify(track_loc_state))
    //console.log('['+loggedUser.username+'] [mapview][updateTrackState] dispatch setTrackLoc ')
    onSetDispatch('setTrackLoc', 'trackLoc', track_loc_state)
  }



  /*
   * Refmap
   */
  const refMap = useRef()
  // const markerRef = React.useRef()



  return (<>
    {props.showFull && loading && <Loading />}

    <ViewShot
      style={{ flex: 1 }}
      ref={ref_mapview}
      options={{ format: 'jpg', quality: 1 }}
    >
      {currentLocation != null ? (<>
        {props.showFull && (<MapView
          style={[
            styles.map,
            // {
            //   height: height/2,
            //   width: width
            // }
          ]}
          initialRegion={currentRegion}
          onRegionChangeComplete={(value) => onRegionChange(value)}
          ref={refMap}
          showsUserLocation={true}
          showsMyLocationButton={true}
          followsUserLocation={true}
          showsCompass={true}
          scrollEnabled={true}
          zoomEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
        >

          {startCoord != null && (<Marker coordinate={startCoord}>
            <Callout tooltip>
              <TouchableHighlight style={styles.customPopupView}>
                <Text style={styles.calloutTxt}>You</Text>
              </TouchableHighlight>
            </Callout>
          </Marker>)}

          {joined === currentChallenge._id && trackMemberStartStates != null && Object.keys(trackMemberStartStates).length > 0 && Object.keys(trackMemberStartStates).map((username, i) => {
            if (username === loggedUser.username) return null
            return (<Marker key={`user-marker-` + i} coordinate={trackMemberStartStates[username]}>
              <Callout tooltip>
                <TouchableHighlight style={styles.customPopupView}>
                  <Text style={styles.calloutTxt}>{username}</Text>
                </TouchableHighlight>
              </Callout>
            </Marker>)
          })}

          {currentChallenge.challenge_detail.place_detail != null && (<Marker coordinate={currentChallenge.challenge_detail.place_detail.coordinates}>
            <Callout tooltip>
              <TouchableHighlight style={styles.customPopupView}>
                <Text style={styles.calloutTxt}>Destination</Text>
              </TouchableHighlight>
            </Callout>
          </Marker>)}

          {currentChallenge.challenge_detail.place_detail != null && startCoord != null && <MapViewDirections
            origin={startCoord}
            destination={currentChallenge.challenge_detail.place_detail.coordinates}
            apikey={GOOGLE_API_KEY} //? insert your API Key here
            strokeWidth={4}
            strokeColor="#111111"
          />}

          <Polyline coordinates={trackLoc.routeCoordinates} strokeWidth={5} strokeColor={members_colors[currentChallenge.participants.indexOf(loggedUser._id)]} />

          {joined === currentChallenge._id && trackMemberLocationStates != null && Object.keys(trackMemberLocationStates).length > 0 && Object.keys(trackMemberLocationStates).map((user_id, i) => {
            if (user_id === loggedUser._id) return null
            return (<Polyline key={`loc-state-` + i} coordinates={trackMemberLocationStates[user_id].routeCoordinates} strokeWidth={5} strokeColor={members_colors[currentChallenge.participants.indexOf(user_id)]} />)
          })}

        </MapView>)}
      </>)
        : props.showFull && (<Text>Location must be enabled to use map</Text>)}
    </ViewShot>

  </>)
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  customPopupView: {
    zIndex: 1000,
    backgroundColor: '#fff',
    borderColor: '#999',
    shadowColor: '#777',
    elevation: 4,
    borderWidth: 1,
    // paddingHorizontal: 10
  },
  calloutTxt: {
    fontSize: 13,
    lineHeight: 18,
    // paddingHorizontal: 5,
  }
})

export default ChallengeStartMap