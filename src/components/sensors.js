import React, { useCallback, useEffect, useState } from 'react'
import { PermissionsAndroid, ToastAndroid } from 'react-native'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import * as Location from 'expo-location'
import { Pedometer } from 'expo-sensors'
import { SOCKET_URL } from '../services/APIServices'
import io from 'socket.io-client'
import haversine from 'haversine'


function Sensors() {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc, privateSockMsg, privateSockMsgs, socket, init, started }, dispatch] = useGlobals()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     //console.log('[sensors] called')
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [])


  const [initLoc, setInitLoc] = useState(false)
  const [initStep, setInitStep] = useState(false)
  useEffect(() => {
    if (init === false) {
      const socket_ = io.connect(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        withCredentials: false,
      })
      onSetDispatch('setSocket', 'socket', socket_)


      onSetDispatch('setInit', 'init', true)

      requestPermissions()
      // requestPedometerPermission()
      // requestLocationPermission()
      return () => {
        unsubscribeLocation()
        unsubscribePedometer()
      }
    }
  }, [init])



  /* **********************************************
   *
   * If there is a team challenge running (currentChallenge != null && currentChallenge.mode === 'team'),
   * listen for socket updates 
   *
   * **********************************************/
  const [listened, setListened] = useState(false)
  useEffect(() => {
    if (socket != null && currentChallenge != null && currentChallenge.mode === 'team') {
      // setListened(true)

      socket.on('cast_private_' + currentChallenge._id, obj => {
        rcvSocket(obj)
      })

    }
  }, [socket, currentChallenge, listened])

  const rcvSocket = useCallback((obj) => {
    if (socket != null) {
      onSetDispatch('setPrivateSockMsg', 'privateSockMsg', obj)
    }
  }, [privateSockMsg, socket, currentChallenge])


  // useEffect(() => {
  //   if (privateSockMsg != null) {
  //     //console.log('[sensors] *************  privateSockMsg', privateSockMsg)

  //     dispatch({
  //       type: 'setPrivateSockMsgs',
  //       privateSockMsgs: [...privateSockMsgs, privateSockMsg]
  //     })
  //   }
  // }, [privateSockMsg])



  /* **********************************************
   *
   * Request all permissions needed
   * 
   * -------------------
   * Request location, 
   *
   * **********************************************/
  const [locationStatus, setLocationStatus] = useState(0)
  const [stepCounterStatus, setStepCounterStatus] = useState(0)
  /*
   * Request user's permission to retrieve location
   */
  const requestPermissions = async () => {
    //console.log('[sensors][requestLocationPermission] CALLED')
    if (Platform.OS === 'ios') {
      // getOneTimeLocation()
      subscribeLocation()
    } else {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        // PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      ]).then((result) => {
        if (result['android.permission.ACCESS_FINE_LOCATION']
          && result['android.permission.ACTIVITY_RECOGNITION'] === 'granted') {
          subscribeLocation()
          subscribePedometer()
        }
        else if (result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.ACTIVITY_RECOGNITION'] === 'never_ask_again') {
          setLocationStatus(-2)
          setStepCounterStatus(-2)

          ToastAndroid.show('Please Go into Settings -> Applications -> APP_NAME -> Permissions and Allow permissions to continue', ToastAndroid.SHORT)
        }
      })
    }
  }

  /* **********************************************
   *
   * Location
   * 
   * -------------------
   * Retrieve location, dispatch to all screens
   * Get my current position to find nearby challenges, etc.
   *
   * **********************************************/
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
    _subscriptionLocation = null
  }

  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    console.log('[sensors][detail processPosition] position', position)

    setLocationStatus(1)
    // setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    //console.log('[sensors] dispatch setCurrentLocation ', JSON.stringify({ latitude: currentLatitude, longitude: currentLongitude }))

    onSetDispatch('setCurrentLocation', 'currentLocation', {
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
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
  let _subscriptionPedometer = null
  const subscribePedometer = () => {
    //console.log('[sensors][subscribePedometer] >>> CALLED')

    _subscriptionPedometer = Pedometer.watchStepCount(result => {
      setStepCounterStatus(1)

      //console.log('[sensors] dispatch setTrackStep ', result)

      onSetDispatch('setTrackStep', 'trackStep', {
        ...trackStep,
        currentStepCount: result.steps
      })
    })
  }
  const unsubscribePedometer = () => {
    _subscriptionPedometer = null
  }


  return null

}

export default Sensors