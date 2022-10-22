import React, { useCallback, useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native'

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import * as Location from 'expo-location'
import { Pedometer } from 'expo-sensors'
import { SOCKET_URL } from '../services/APIServices'
import io from 'socket.io-client'


function Sensors() {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc, privateSockMsg, privateSockMsgs, socket, init }, dispatch] = useGlobals()

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log('[sensors] called')
  //   }, 10000)
  //   return () => clearInterval(interval)
  // }, [])


  useEffect(() => {
    if (init === false) {
      const socket_ = io.connect(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
        withCredentials: false,
      })
      dispatch({
        type: 'setSocket',
        socket: socket_
      })


      dispatch({
        type: 'setInit',
        socket: true
      })

      requestLocationPermission()
      requestPedometerPermission()
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
      dispatch({
        type: 'setPrivateSockMsg',
        privateSockMsg: obj
      })
    }
  }, [privateSockMsg, socket, currentChallenge])


  useEffect(() => {
    if (privateSockMsg != null) {
      console.log('[sensors] *************  privateSockMsg', privateSockMsg)

      dispatch({
        type: 'setPrivateSockMsgs',
        privateSockMsgs: [...privateSockMsgs, privateSockMsg]
      })
    }
  }, [privateSockMsg])



  /* **********************************************
   *
   * Location
   * 
   * -------------------
   * Request location, retrieve location, dispatch to all screens
   * Get my current position to find nearby challenges, etc.
   *
   * **********************************************/
  const [locationStatus, setLocationStatus] = useState(0)
  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
    console.log('[sensors][requestLocationPermission] CALLED')
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
          // setLoading(false)
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
    _subscriptionLocation = null
  }

  /*
   * Process retrieved lng lat 
   */
  const processPosition = (position) => {
    // console.log('[sensors][detail processPosition] position', position)
    setLocationStatus(1)
    // setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    console.log('[sensors] dispatch setCurrentLocation ', JSON.stringify({ latitude: currentLatitude, longitude: currentLongitude }))

    dispatch({
      type: 'setCurrentLocation',
      currentLocation: {
        latitude: currentLatitude,
        longitude: currentLongitude,
      },
    })
  }



  /* **********************************************
   *
   * Step counter
   * 
   * -------------------
   * Request pedometer, retrieve data, dispatch to all screens
   *
   * **********************************************/
  const [stepCounterStatus, setStepCounterStatus] = useState(0)
  /*
   * Request user's permission to retrieve sensor data
   */
  const requestPedometerPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION, {
      })

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        subscribePedometer()
      } else {
        setStepCounterStatus(0)
      }
    } catch (err) {
      console.warn(err)
    }
  }

  /*
   * Subscribe so that the app will track the user's step without asking for permission again
   */
  let _subscriptionPedometer = null
  const subscribePedometer = () => {
    console.log('[sensors][subscribePedometer] >>> CALLED')

    _subscriptionPedometer = Pedometer.watchStepCount(result => {
      setStepCounterStatus(1)

      console.log('[sensors] dispatch setTrackStep ', result)

      dispatch({
        type: 'setTrackStep',
        trackStep: {
          ...trackStep,
          currentStepCount: result.steps
        },
      })
    })
  }
  const unsubscribePedometer = () => {
    _subscriptionPedometer = null
  }


  return null

}

export default Sensors