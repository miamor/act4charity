import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, ProgressBar, MD3Colors, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'

import * as Location from 'expo-location'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import { GOOGLE_API_KEY } from '../../constants/keys'
import haversine from 'haversine'

import { Pedometer } from 'expo-sensors'

import PercentageCircle from 'react-native-percentage-circle'
import ViewShot from 'react-native-view-shot'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeWalkDetailStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  const { challenge_accepted_data } = route.params
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('>>> challenge_accepted_id', challenge_accepted_id)
  }, [])


  /*
   * state to identify if the challenge is complete
   */
  const [completed, setCompleted] = useState(0)


  /* **********************************************
   *
   * Set currentChallenge global variable after back, so that when exit this screen, the current challenge will display at bottom bar
   *
   * **********************************************/
  useEffect(() => {
    dispatch({
      type: 'setCurrentChallenge',
      currentChallenge: null,
    })
  }, [])
  useEffect(() => {
    if (completed === 0) {
      navigation.addListener('beforeRemove', (e) => {
        dispatch({
          type: 'setCurrentChallenge',
          currentChallenge: challenge_accepted_data,
        })
      })
    }
  }, [navigation, completed])



  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/
  useEffect(() => {
      requestLocationPermission()
      return () => unsubscribeLocation()
  }, [])

  /*
   * states to store user's location
   */
  // const [getPosition, setGetPosition] = useState(false)
  //? location status: 
  //? 0: not retrieved yet
  //? 1: retrieved
  //? 2: retrieving
  //? -1: retrived error
  //? -2: permission denied
  const [locationStatus, setLocationStatus] = useState(0)

  const LATITUDE = -37.82014135870454
  const LONGITUDE = 144.96851676141537

  /* 
   * To set region on map
   */
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [startCoord, setStartCoord] = useState()

  const onRegionChange = (value) => {
    setRegion(value)
  }

  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      // getOneTimeLocation()
      subscribeLocation()
    } else {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
          title: 'Location Access Required',
          message: 'This App needs to Access your location',
        })

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //? check if permission is granted
          // getOneTimeLocation()
          subscribeLocation()
        } else {
          setLocationStatus(-2)
          setLoading(false)
        }
      } catch (err) {
        console.warn(err)
      }
    }
  }

  /*
   * Subscribe so that the app will track the user's location without asking for permission again
   */
  let _subscriptionLocation = null
  const subscribeLocation = () => {
    _subscriptionLocation = Location.watchPositionAsync({}, (position) => {
      processPosition(position)
    })
  }
  const unsubscribeLocation = () => {
    // if (_subscriptionLocation != null) {
    //   _subscriptionLocation.remove()
    //   _subscriptionLocation = null
    // }
    _subscriptionLocation = null
  }


  /*
   * Process retrieved lng lat 
   */
  const [myLocation, setMyLocation] = useState()
  const processPosition = async (position) => {
    console.log('\n')
    console.log('[detail processPosition] position', position)
    setLocationStatus(1)
    setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    setRegion({
      ...region,
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
    setMyLocation({
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
    if (startCoord == null) {
      await setStartCoord({
        latitude: currentLatitude,
        longitude: currentLongitude
      })
    }
  }
  /*
   * When myLocation is updated, update trackLocationState
   */
  useEffect(() => {
    // console.log('>>> [processPosition] trackLocationState.routeCoordinates', trackLocationState.routeCoordinates)
    updateTrackLocationState()
  }, [myLocation])


  /* **********************************************
   *
   * Keep track of the user's route
   *
   * **********************************************/
  const [trackLocationState, setTrackLocationState] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    routeCoordinates: [],
    distanceTravelled: 0,
    prevLatLng: {},
    coordinate: new AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE
    })
  })
  const [animatedMarker, setAnimatedMarker] = useState()
  const refMap = useRef()
  // const markerRef = React.useRef()

  /*
   * Calculate distance travelled
   */
  const calcDistance = (newLatLng) => {
    const { prevLatLng } = trackLocationState
    return haversine(prevLatLng, newLatLng) || 0
  }

  /*
   * Update track state
   */
  const updateTrackLocationState = async () => {
    console.log('[updateTrackState] CALLED ~~~~~~~~~~~~~~')

    //? update user's position and user's route
    const { coordinate, routeCoordinates, distanceTravelled } = trackLocationState

    const myTrackState = {
      latitude: myLocation.latitude,
      longitude: myLocation.longitude,
      routeCoordinates: [...routeCoordinates, myLocation],
      distanceTravelled: distanceTravelled + calcDistance(myLocation),
      prevLatLng: myLocation
    }
    await setTrackLocationState(myTrackState)
  }



  /* **********************************************
   *
   * Step counter
   *
   * **********************************************/
  useEffect(() => {
    if (completed === 0) {
      requestPedometerPermission()
      return () => unsubscribePedometer()
    }
  }, [completed])

  const [trackStepState, setTrackStepState] = useState({
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  })

  let _subscriptionPedometer = null
  const subscribePedometer = () => {
    console.log('>>> [subscribePedometer] CALLED')

    _subscriptionPedometer = Pedometer.watchStepCount(result => {
      console.log('>>> [watchStepCount] result', result)

      setTrackStepState({
        ...trackStepState,
        currentStepCount: result.steps,
      })
    })
  }
  const unsubscribePedometer = () => {
    // if (_subscriptionPedometer != null) {
    //   _subscriptionPedometer.remove()
    //   _subscriptionPedometer = null
    // }
    _subscriptionPedometer = null
  }

  /*
   * Request user's permission to retrieve sensor data
   */
  const requestPedometerPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION, {
      })

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the pedometer")
        subscribePedometer()
      } else {
        console.log("Pedometer permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }



  /* **********************************************
   *
   * Calculate distance travelled, 
   * to detect if the user walked the required distance
   *
   * **********************************************/
  const ref_mapview = useRef()
  useEffect(() => {
    // console.log('>>>>>>>>>>> (detail) processPosition CALLED. completed =', completed)

    if (completed === 0) {
      if (trackLocationState.distanceTravelled >= challengeDetail.distance) { //? identify as completed
        onComplete()
      }
    }
  }, [trackLocationState, completed])


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
    setLoading(true)
    setCompleted(1)
    setShowConfirmComplete(true)
  }
  /* 
   * Confirm complete 
   */
  const onConfirmComplete = () => {
    userAPI.completeChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('[onConfirmComplete] res', res)

      ref_mapview.current.capture().then((uri) => {
        console.log('>>>> captured uri', uri)
        setLoading(false)

        navigation.navigate('ChallengeDetailCompleted', {
          key: 'ChallengeDetailCompleted',
          challengeDetail: challengeDetail,
          distanceTravelled: trackLocationState.distanceTravelled,
          routeCoordinates: trackLocationState.routeCoordinates,
          captured_image: uri,
          challenge_accepted_id: challenge_accepted_id,
        })
      })
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
    setLoading(true)
    setCompleted(-1)

    /*
     * Update in db
     */
    userAPI.cancelChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('>> res', res)
      navigation.navigate('ChallengeListMapDiscover', { key: 'ChallengeListMapDiscover' })
      setLoading(false)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  /* **********************************************
   *
   * Hide bottom bar
   *
   * **********************************************/
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: 'none'
      }
    })
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: undefined
    })
  }, [navigation])


  const windowWidth = Dimensions.get('window').width / 2


  return (
    <DefaultView>
      {loading && <Loading />}

      <View style={{ flex: 0.7 }}>
        <ViewShot
          style={{ flex: 1 }}
          ref={ref_mapview}
          options={{ format: 'jpg', quality: 1 }}
        >
          {locationStatus == 1 ? (<MapView
            style={styles.map}
            initialRegion={region}
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
            <Marker coordinate={startCoord} />
            <Polyline coordinates={trackLocationState.routeCoordinates} strokeWidth={5} />
            {trackLocationState.coordinate != null && (<Marker.Animated
              ref={marker => setAnimatedMarker(marker)}
              coordinate={trackLocationState.coordinate}
            />)}
          </MapView>)
            : (<Text>Location must be enabled to use map</Text>)}
        </ViewShot>
      </View>


      <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
        {/* <Text>Pedometer.isAvailableAsync(): {trackStepState.isPedometerAvailable}</Text>
        <Text>Steps taken in the last 24 hours: {trackStepState.pastStepCount}</Text>
        <Text>Walk! And watch this go up: {trackStepState.currentStepCount}</Text> */}

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TextBold style={{ fontSize: 30, lineHeight: 60 }}>00:08:00</TextBold><Text style={{ fontSize: 13, marginTop: 10, marginLeft: 5, lineHeight: 60 }}>Time</Text>
        </View>
        <View style={{ width: windowWidth }}>
          <ProgressBar progress={0.5} color={MD3Colors.primary0} />
        </View>

        <View style={{ marginTop: 20, flexDirection: 'row' }}>
          {/* <View>
            <TextBold style={{ fontSize: 26, lineHeight: 50 }}>{trackLocationState.distanceTravelled}</TextBold>
            <Text>km</Text>
          </View> */}

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PercentageCircle radius={35} percent={50} color={MD3Colors.primary10}>
              <TextBold style={{ fontSize: 26, lineHeight: 50 }}>{trackLocationState.distanceTravelled}</TextBold>
            </PercentageCircle>
          </View>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <PercentageCircle radius={35} percent={50} color={MD3Colors.primary20}>
              <TextBold style={{ fontSize: 26, lineHeight: 50 }}>{trackStepState.currentStepCount}</TextBold>
            </PercentageCircle>
          </View>
        </View>
      </View>



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
        <Modal visible={showConfirmComplete} onDismiss={hideConfirmComplete} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
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


      <View style={{
        position: 'absolute', zIndex: 2,
        // bottom: currentSnapPoint === 0 ? dimensions.height * 0.15 - 55 : currentSnapPoint === 1 ? dimensions.height * 0.5 - 55 : dimensions.height * 0.9 - 55,
        // bottom: currentSnapPoint === 0 ? (dimensions.height - 65) * 0.15 - 10 : currentSnapPoint === 1 ? (dimensions.height - 65) * 0.9 - 10 : 0,
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
      </View>


    </DefaultView>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default ChallengeWalkDetailStartScreen
