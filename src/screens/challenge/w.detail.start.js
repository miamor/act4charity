import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, ProgressBar, MD3Colors } from 'react-native-paper'
import { TextBold, Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import { Backgrounds } from '../../svgs'
import Aquarius from '../../svgs/Aquarius'

import axios from 'axios'

import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { TabView, SceneMap } from 'react-native-tab-view'

import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import { GOOGLE_API_KEY } from '../../constants/keys'
import haversine from 'haversine'

import { Pedometer } from 'expo-sensors'
// import PedometerDetails from 'react-native-pedometer-details'

import PercentageCircle from 'react-native-percentage-circle'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeWalkDetailStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  const { challengeDetail } = route.params


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
    navigation.addListener('beforeRemove', (e) => {
      dispatch({
        type: 'setCurrentChallenge',
        currentChallenge: challengeDetail,
      })
    })
  }, [navigation])



  // useEffect(() => {
  //   (async () => {
  //     const granted_pedo = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION)

  //     if (granted_pedo == PermissionsAndroid.RESULTS.GRANTED) {
  //       subscribePedometer()
  //     } else {
  //       requestPedometerPermission()
  //     }


  //     const granted_gps = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  //     console.log('granted_gps', granted_gps)

  //     if (granted_gps == PermissionsAndroid.RESULTS.GRANTED) {
  //       subscribeLocation()
  //     } else {
  //       requestLocationPermission()
  //     }

  //     requestLocationPermission()
  //     requestPedometerPermission()

  //     return () => {
  //       unsubscribePedometer()
  //     }
  //   })()
  // }, [locationStatus])



  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/
  useEffect(() => {
    requestLocationPermission()
    return () => unsubscribeLocation()
  }, [locationStatus])

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
    _subscriptionLocation && _subscriptionLocation.remove()
    _subscriptionLocation = null
  }


  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    console.log('position', position)
    setLocationStatus(1)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    setRegion({
      ...region,
      latitude: currentLatitude,
      longitude: currentLongitude,
    })


    //? update user's position and user's route
    const { coordinate, routeCoordinates, distanceTravelled } = trackLocationState

    const newCoordinate = {
      latitude: currentLatitude,
      longitude: currentLongitude
    };

    if (Platform.OS === "android") {
      if (animatedMarker != null) {
        animatedMarker.animateMarkerToCoordinate(newCoordinate, 500)
      }
    } else {
      coordinate.timing(newCoordinate).start()
    }

    setTrackLocationState({
      latitude: currentLatitude,
      longitude: currentLongitude,
      routeCoordinates: routeCoordinates.concat([newCoordinate]),
      distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
      prevLatLng: newCoordinate
    })
  }


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



  /* **********************************************
   *
   * Step counter
   *
   * **********************************************/
  useEffect(() => {
    requestPedometerPermission()
    return () => unsubscribePedometer()
  }, [])

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

    Pedometer.isAvailableAsync().then(result => {
      console.log('>>> [isAvailableAsync] result', result)

      setTrackStepState({
        ...trackStepState,
        isPedometerAvailable: String(result),
      })
    }, error => {
      setTrackStepState({
        ...trackStepState,
        isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
      })
    })
  }

  const unsubscribePedometer = () => {
    _subscriptionPedometer && _subscriptionPedometer.remove()
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
      <View style={{ flex: 0.7 }}>
        {locationStatus == 1 ? (<MapView
          style={styles.map}
          region={region}
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
        </MapView>)
          : (<Text>Location must be enabled to use map</Text>)}
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

    </DefaultView>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default ChallengeWalkDetailStartScreen
