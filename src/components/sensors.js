import React, { useCallback, useEffect, useState } from 'react'
import { PermissionsAndroid, ToastAndroid } from 'react-native'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import * as Location from 'expo-location'
import { Pedometer } from 'expo-sensors'
// import { SOCKET_URL } from '../services/APIServices'
// import io from 'socket.io-client'
import haversine from 'haversine'


function Sensors() {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc, privateSockMsg, privateSockMsgs, socket, init, started, startTime, joined, completed }, dispatch] = useGlobals()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     //console.log('['+loggedUser.username+'] [sensors] called')
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [])



  // /* **********************************************
  //  *
  //  * If there is a team challenge running (currentChallenge != null && currentChallenge.mode === 'team'),
  //  * listen for socket updates 
  //  *
  //  * **********************************************/
  // const [listened, setListened] = useState(false)
  // useEffect(() => {
  //   if (socket != null && currentChallenge != null && currentChallenge.mode === 'team') {
  //     // setListened(true)

  //     socket.on('cast_private_' + currentChallenge._id, obj => {
  //       rcvSocket(obj)
  //     })

  //   }
  // }, [socket, currentChallenge, listened])

  // const rcvSocket = useCallback((obj) => {
  //   if (socket != null) {
  //     onSetDispatch('setPrivateSockMsg', 'privateSockMsg', obj)
  //   }
  // }, [privateSockMsg, socket, currentChallenge])


  // useEffect(() => {
  //   if (privateSockMsg != null) {
  //     //console.log('['+loggedUser.username+'] [sensors] *************  privateSockMsg', privateSockMsg)

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
  // const [locationStatus, setLocationStatus] = useState(0)
  const [stepCounterStatus, setStepCounterStatus] = useState(0)
  /*
   * Request user's permission to retrieve location
   */
  const requestPermissions = async () => {
    //console.log('['+loggedUser.username+'] [sensors][requestLocationPermission] CALLED')
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
          // subscribePedometer() //! call this in mapview only
        }
        else if (result['android.permission.ACCESS_FINE_LOCATION']
          || result['android.permission.ACTIVITY_RECOGNITION'] === 'never_ask_again') {
          // setLocationStatus(-2)
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
  let _timeLoc = new Date(Date.now())
  const subscribeLocation = () => {
    _subscriptionLocation = Location.watchPositionAsync({
      accuracy: Location.Accuracy.High,
      distanceInterval: 100, //? update only when distance changes 30m
      timeInterval: 20000, //? update every 20 seconds
    }, (position) => {
      if (completed !== 3) {
        let _newTime = new Date(Date.now())
        console.log('_newTime', _newTime, ' | _timeLoc', _timeLoc)
        if (currentLocation == null || _newTime.getTime() - _timeLoc.getTime() > 60000) { //! update every X sec only
          _timeLoc = _newTime
          processPosition(position)
        }
      }
    })
  }
  const unsubscribeLocation = () => {
    _subscriptionLocation = null
  }

  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    console.log('[' + loggedUser.username + '] [sensors][detail processPosition] position =', position, ' | completed =', completed)

    // setLocationStatus(1)
    // setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    //console.log('['+loggedUser.username+'] [sensors] dispatch setCurrentLocation ', JSON.stringify({ latitude: currentLatitude, longitude: currentLongitude }))

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
  let _timeStep = new Date(Date.now())
  const subscribePedometer = () => {
    //console.log('['+loggedUser.username+'] [sensors][subscribePedometer] >>> CALLED')
    // let time = new Date(Date.now())
    _subscriptionPedometer = Pedometer.watchStepCount(result => {
      // setStepCounterStatus(1)

      let _newTime = new Date(Date.now())
      console.log('_newTime', _newTime, ' | _timeStep', _timeStep)

      if ((trackStep.currentStepCount === 0 && result.steps > 0) || _newTime.getTime() - _timeStep.getTime() > 40000) { //! update every Xsec only
        //console.log('['+loggedUser.username+'] [sensors] dispatch setTrackStep ', result)
        _timeStep = _newTime

        // if (result.steps - trackStep.currentStepCount > 3) {
        onSetDispatch('setTrackStep', 'trackStep', {
          ...trackStep,
          currentStepCount: result.steps
        })
        // }
      }

    })
  }
  const unsubscribePedometer = () => {
    _subscriptionPedometer = null
  }





  // const [initLoc, setInitLoc] = useState(false)
  // const [initStep, setInitStep] = useState(false)
  useEffect(() => {
    if (init === false) {
      // const socket_ = io.connect(SOCKET_URL, {
      //   transports: ['websocket'],
      //   autoConnect: true,
      //   withCredentials: false,
      // })
      // onSetDispatch('setSocket', 'socket', socket_)
      onSetDispatch('setInit', 'init', true)

      requestPermissions()
      // requestPedometerPermission()
      // requestLocationPermission()
      return () => {
        unsubscribeLocation()
        // unsubscribePedometer() //! call this in mapview only
      }
    }
  }, [init])

  useEffect(() => {
    unsubscribePedometer()
    onSetDispatch('setTrackStep', 'trackStep', {
      ...trackStep,
      currentStepCount: 0
    })

    if (started && startTime != null && currentChallenge != null && (
      currentChallenge.mode === 'individual' ||
      (currentChallenge.mode === 'team' && joined === currentChallenge._id) &&
      completed === 0
    )) {
      subscribePedometer()
      return unsubscribePedometer()
    }
  }, [started, startTime, joined, currentChallenge, completed])





  return null

}

export default Sensors