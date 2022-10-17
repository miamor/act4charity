import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal, TextInput } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'

import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

import * as Location from 'expo-location'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY } from '../../constants/keys'
// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation'
import haversine from 'haversine'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import ViewShot from 'react-native-view-shot'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import io from 'socket.io-client'
import { SOCKET_URL } from '../../services/APIServices'



const socket = io.connect(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: false,
})


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeDiscoverDetailStartTeamScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  const { challenge_accepted_data } = route.params
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id

  const room_id = challenge_accepted_id

  const [loading, setLoading] = useState(true)


  const [isHost, setIsHost] = useState(false)
  const [joinStatus, setJoinStatus] = useState(false)


  /* ************************
   *
   * check if current user is host
   *
   * ************************/
  useEffect(() => {
    console.log('>>> challenge_accepted_id', challenge_accepted_id)
    if (loggedUser._id === challenge_accepted_data.user) {
      setIsHost(true)
      setJoinStatus(true)
      //? host joined for the first time
      socket.emit('join', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' joined' })
    }
  }, [])

  /* ************************
   *
   * load all members and members status (accepted / declined / out)
   *
   * ************************/
  useEffect(() => {
    console.log('[getChallengeInvitation] challenge_accepted_id', challenge_accepted_id)
    loadMembersStatus()
  }, [])

  const [membersJoinStatus, setMembersJoinStatus] = useState()
  const loadMembersStatus = () => {
    userAPI.getChallengeInvitations({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('[getChallengeInvitations] res', res)

      let members_joins = {}
      res.data.forEach((invitation) => {
        console.log('>> invitation', invitation)
        // members_joins[invitation.to_uid] = invitation.accept
        members_joins[invitation.to_uid] = invitation.accept
      })

      console.log('[first fetch] members_joins', members_joins)
      setMembersJoinStatus(members_joins)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /*
   * state to identify if I completed the chalenge
   */
  const [completed, setCompleted] = useState(0)



  /* **********************************************
   * 
   * Team communicate
   *
   * ----------------------
   * Team members must wait until the host click "Start"
   * The host can see the list of accepted members
   * to decide whether to Start the challenge or not.
   * 
   * Everything will be communicated via socket.
   * Members join, start challenge command, chat, share routes state / location /... all via socket.
   *
   * **********************************************/
  const [chatMessages, setChatMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const [trackMemberLocationStates, setTrackMemberLocationStates] = useState({})
  // useEffect(() => {
  //   console.log('socket', socket)
  // }, [])

  /*
   * For team challenge, we need to wait until the host click Start the challenge.
   * Use this state to detect when the host starts the challenge.
   */
  const [isStarted, setIsStarted] = useState(false)

  /* 
   * This function is triggered when the host started the challenge.
   * This function starts on each member's screen
   */
  const startNow = () => {
    setIsStarted(true)
  }

  /*
   * state to identify if everyone within the team completed the chalenge
   */
  const [teamCompleted, setTeamCompleted] = useState(0)


  /* ************************
   *
   * User must click `Join` to accept the invitation and join the challenge
   *
   * ************************/
  const onJoin = () => {
    setLoading(true)

    //? update db. only when current user is not host
    if (loggedUser._id !== challenge_accepted_data.user && challenge_accepted_data.hasOwnProperty(loggedUser._id) && membersJoinStatus[loggedUser._id] === 0) {

      /*
       * Update invitation accept status db 
       */
      userAPI.acceptInvitation({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('[acceptInvitation] res', res)

        /*
         * join the room 
         */
        socket.emit('join', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' joined' })

        setLoading(false)
        setJoinStatus(1)
        loadMembersStatus()

      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })

    } else { //? or else, just join the chat ? well, no need to rejoin
      // socket.emit('join', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' joined' })

      setJoinStatus(1)
      setLoading(false)
    }
  }

  /* ************************
   *
   * Decline the invitation
   *
   * ************************/
  const onDecline = () => {
    setLoading(true)

    //? update db. only when current user is not host
    if (loggedUser._id !== challenge_accepted_data.user && challenge_accepted_data.hasOwnProperty(loggedUser._id) && membersJoinStatus[loggedUser._id] === 0) {

      /*
       * Update invitation accept status db 
       */
      userAPI.declineInvitation({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('[declineInvitation] res', res)
        setLoading(false)
        setJoinStatus(-1)

        navigation.goBack()

      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })

    }
  }

  /* ************************
   *
   * The host click Start the challenge. 
   * Start for the whole team.
   * Team challenge can only be started once at least one person (other than host) accepted the invitation and joined the challenge
   *
   * ************************/
  const [showWarningCantStart, setShowWarningCantStart] = useState(false)
  const hideWarningCantStart = () => setShowWarningCantStart(false)
  const onStartTeam = () => {
    //? if totStt > 0 => at least one member accepted.
    const totStt = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0)
    if (totStt === 0) {
      setShowWarningCantStart(true)
      return null
    }

    // setIsStarted(true)
    setLoading(true)

    userAPI.startTeamChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('[startTeamChallenge] res', res)

      socket.emit('start', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: 'Host started the challenge' })

      setLoading(false)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  /* ************************
   *
   * Send chat message
   *
   * ************************/
  const submitChatMessage = () => {
    console.log('[submitChatMessage] CALLED', chatMessage)
    socket.emit('chat', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: chatMessage })
    setChatMessage('')
  }

  /* ************************
   *
   * Send user stats (loc states and steps state etc.)
   *
   * ************************/
  const submitUserLocState = () => {
    const loc_state = {
      latitude: trackLocationState.latitude,
      longitude: trackLocationState.longitude,
      routeCoordinates: trackLocationState.routeCoordinates,
      distanceTravelled: trackLocationState.distanceTravelled,
      prevLatLng: trackLocationState.prevLatLng,
    }
    socket.emit('loc_state', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loc_state })
  }



  /* ************************
   *
   * On receive signals
   * 
   * -------
   * 
   * Update my screen when receiving new messages / states / ...
   *
   * ************************/
  useEffect(() => {

    /*
     * host start
     */
    socket.on('start_' + room_id, res => {
      console.log('[start_] someone out.', res)
      setChatMessages([...chatMessages, res])
      startNow()
    })

    /*
     * someone accepted (joined)
     */
    socket.on('join_' + room_id, res => {
      console.log('[join_] someone joined.', res)
      setChatMessages([...chatMessages, res])

      //? update membersJoinStatus
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: 1,
      }
      console.log('[someone joined] members_joins', members_joins)
      setMembersJoinStatus(members_joins)
    })

    /*
     * someone declined
     */
    socket.on('decline_' + room_id, res => {
      console.log('[decline_] someone declined.', res)
      setChatMessages([...chatMessages, res])

      //? update membersJoinStatus
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: -1,
      }
      console.log('[someone declined] members_joins', members_joins)
      setMembersJoinStatus(members_joins)
    })

    /*
     * someone out
     */
    socket.on('out_' + room_id, res => {
      console.log('[out_] someone out.', res)
      setChatMessages([...chatMessages, res])

      //? update membersJoinStatus
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: -2,
      }
      console.log('[someone out] members_joins', members_joins)
      setMembersJoinStatus(members_joins)
    })

    /*
     * host killed the challenge
     */
    socket.on('kill_' + room_id, res => {
      console.log('[kill_] host killed.', res)
      setChatMessages([...chatMessages, res])
      setCompleted(-1)
      if (challengeDetail.type === 'discover') {
        navigation.navigate('ChallengeDiscoverDetailInfo', { key: 'ChallengeDiscoverDetailInfo', challengeDetail: item })
      } else {
        navigation.navigate('ChallengeWalkDetailInfo', { key: 'ChallengeWalkDetailInfo', challengeDetail: item })
      }
    })

    /*
     * host end the challenge 
     * ---
     * end is equivalent to complete. 
     * The host can only end the challenge when at least 1 team member completes the challenge.
     * For challenges type `discover`:
     *   donation of team challenge = (donation * number of members completed the challenge) + (donation / 4 * (number of members in the team but not completed the challenge))
     * If all team members completed the challenge:
     *   donation of team challenge = donation * number of members * 1.5
     */
    socket.on('end_' + room_id, res => {
      console.log('[end_] host ended.', res)
      setChatMessages([...chatMessages, res])
      // setCompleted(1)
      // onConfirmComplete()
      onComplete()
    })

    /*
     * someone sent a chat message
     */
    socket.on('chat_' + room_id, res => {
      console.log('[chat_] res', res)
      setChatMessages([...chatMessages, res])
    })

    /*
     * received location updates
     */
    socket.on('loc_state_' + room_id, res => {
      console.log('[loc_state_] res', res)

      if (res.user_id !== loggedUser._id) {
        setTrackMemberLocationStates({
          ...trackMemberLocationStates,
          // [res.user_id]: [
          //   ...trackMemberLocationStates[res.user_id],
          //   res.data
          // ]
          [res.user_id]: res.data,
        })
        setChatMessages([...chatMessages, JSON.stringify(res)])
      }
    })

    return () => {
      socket.off('start_' + room_id)
      socket.off('join_' + room_id)
      socket.off('decline_' + room_id)
      socket.off('out_' + room_id)
      socket.off('kill_' + room_id)
      socket.off('end_' + room_id)
      socket.off('chat_' + room_id)
      socket.off('loc_state_' + room_id)
    }
  }, [chatMessages, trackMemberLocationStates])


  // useEffect(() => {
  //   console.log('[chatMessages]', chatMessages)
  //   console.log('[trackMemberLocationStates]', trackMemberLocationStates)
  // }, [chatMessages, trackMemberLocationStates])




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
          currentChallenge: challenge_accepted_data
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
    // setRegion({
    //   ...region,
    //   latitudeDelta: value.latitudeDelta,
    //   longitudeDelta: value.longitudeDelta,
    // })
    // console.log('value.latitudeDelta | value.longitudeDelta', value.latitudeDelta, value.longitudeDelta)
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
    if (startCoord == null) {
      await setStartCoord({
        latitude: currentLatitude,
        longitude: currentLongitude
      })
    }

    // console.log('>>> [processPosition] trackLocationState.routeCoordinates', trackLocationState.routeCoordinates)
    await updateTrackState(currentLatitude, currentLongitude)
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
  const updateTrackState = async (currentLatitude, currentLongitude) => {
    // console.log('\n')
    // console.log('----------------------------------')
    // console.log('>>> [updateTrackState] _trackLocationState.routeCoordinates', trackLocationState.routeCoordinates)

    //? update user's position and user's route
    const { coordinate, routeCoordinates, distanceTravelled } = trackLocationState

    const newCoordinate = {
      latitude: currentLatitude,
      longitude: currentLongitude
    }

    // if (Platform.OS === "android") {
    //   if (animatedMarker != null) {
    //     animatedMarker.animateMarkerToCoordinate(newCoordinate, 500)
    //   }
    // } else {
    //   coordinate.timing(newCoordinate).start()
    // }

    // let routeCoordinates_new = [...routeCoordinates, newCoordinate]
    // console.log('>>> [updateTrackState] routeCoordinates', routeCoordinates)
    // console.log('>>> [updateTrackState] newCoordinate', newCoordinate)
    // console.log('>>> [updateTrackState] routeCoordinates_new', routeCoordinates_new)
    await setTrackLocationState({
      latitude: currentLatitude,
      longitude: currentLongitude,
      routeCoordinates: [...routeCoordinates, newCoordinate], //routeCoordinates.concat([newCoordinate]),
      distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
      prevLatLng: newCoordinate
    })

    // submitUserLocState() //? share my state to my teammates
  }



  /* **********************************************
   *
   * Calculate distance from target, 
   * to detect if the user arrived the destination
   *
   * **********************************************/
  const ref_mapview = useRef()
  useEffect(() => {
    // console.log('>>>>>>>>>>> (detail) processPosition CALLED. completed =', completed)

    if (completed === 0) {
      // console.log('  locationStatus', locationStatus)
      // console.log('  trackLocationState', trackLocationState)
      // console.log('  trackLocationState.prevLatLng.length', Object.keys(trackLocationState.prevLatLng).length)

      // if (trackLocationState.distanceTravelled > 0) {
      if (Object.keys(trackLocationState.prevLatLng).length > 0) {
        const dist_to_target = haversine(trackLocationState.prevLatLng, challengeDetail.place_detail.coordinates) || 0
        console.log('>>> dist_to_target', dist_to_target)

        if (dist_to_target < 0.2) { //? identify as arrived
          onComplete()
        }
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

        navigation.navigate('ChallengeDiscoverDetailCompleted', {
          key: 'ChallengeDiscoverDetailCompleted',
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
  const onPressCancelChallenge = () => {
    setShowConfirmCancel(true)
  }
  const hideConfirmCancel = () => setShowConfirmCancel(false)
  const onConfirmCancel = () => {
    setLoading(true)
    setCompleted(-1)

    if (isHost) {
      /*
       * When the user is host (host cancel)
       * Update in db and kill for others. 
       */
      userAPI.cancelChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('>> res', res)

        socket.emit('kill', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' canceled this challenge' })

        navigation.navigate('ChallengeListMapDiscover', { key: 'ChallengeListMapDiscover' })
        setLoading(false)
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    } else {
      /*
       * When the user is not host
       * Simply out the challenge
       */
      userAPI.cancelInvitation({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('>> res', res)

        socket.emit('out', { room_id: room_id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' withdrawn from this challenge' })

        navigation.navigate('ChallengeListMapDiscover', { key: 'ChallengeListMapDiscover' })
        setLoading(false)
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
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


  /* **********************************************
   *
   * Bottom Scroll Sheet
   *
   * **********************************************/
  const sheetRef = useRef()//<BottomSheet>(null)
  const data = useMemo(
    () =>
      Array(50).fill(0).map((_, index) => `index-${index}`),
    []
  )
  const snapPoints = useMemo(() => ['15%', '90%'], [])
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0)

  //? callbacks
  const handleSheetChange = useCallback((index) => {
    setCurrentSnapPoint(index)
  }, [])
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
  }, [])
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close()
  }, [])

  //? render
  const renderItem = useCallback((item) => (
    <View key={item} style={styles.itemContainer}>
      <Text>{item}</Text>
    </View>
  ), [])


  const dimensions = Dimensions.get('window')
  const imageHeight = Math.round(dimensions.width * 9 / 16)
  const imageWidth = dimensions.width - 100


  return (
    <DefaultView>
      {loading && <Loading />}

      <View style={{ flex: 0.9, flexDirection: 'row' }}>
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
            <Marker coordinate={challengeDetail.place_detail.coordinates} />

            <MapViewDirections
              origin={startCoord}
              destination={challengeDetail.place_detail.coordinates}
              apikey={GOOGLE_API_KEY} //? insert your API Key here
              strokeWidth={4}
              strokeColor="#111111"
            />

            {/* <Polyline coordinates={trackLocationState.routeCoordinates} strokeWidth={5} strokeColor="#f54245" /> */}
            {/* {trackLocationState.coordinate != null && (<Marker.Animated
              ref={marker => setAnimatedMarker(marker)}
              coordinate={trackLocationState.coordinate}
            />)} */}

            {/* {trackMemberLocationStates != null && Object.keys(trackMemberLocationStates).length > 0 && Object.keys(trackMemberLocationStates).map((user_id, i) => (
              <Polyline key={`loc-state-` + i} coordinates={trackMemberLocationStates[user_id].routeCoordinates} strokeWidth={5} />
            ))} */}
            {/* {Object.keys(trackMemberLocationStates).map((user_id, i) => {
              if (trackMemberLocationStates[user_id].coordinate != null) {
                return (<Marker.Animated
                  key={`marker-` + i}
                  ref={marker => setAnimatedMarker(marker)}
                  coordinate={trackLocationState.coordinate}
                />)
              }
            }} */}


          </MapView>)
            : (<Text>Location must be enabled to use map</Text>)}
        </ViewShot>
      </View>


      <View style={{ flex: 0.1 }}>
        <Button title="Snap To 90%" onPress={() => handleSnapPress(1)} />
        <Button title="Snap To 10%" onPress={() => handleSnapPress(0)} />
        <Button title="Close" onPress={() => handleClosePress()} />
      </View>


      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        style={{ zIndex: 100 }}
      >
        <BottomSheetScrollView contentContainerStyle={{ zIndex: 100 }}>
          {membersJoinStatus != null && challenge_accepted_data.participants_details.map((user, i) => {
            if (loggedUser._id !== user._id && !membersJoinStatus.hasOwnProperty(user._id)) return null
            return (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
              <Text>{user.username}</Text>
              <Text>{loggedUser._id === user._id ? 1 : membersJoinStatus[user._id]}</Text>
            </View>)
          })}

          {joinStatus && (<View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 0.4, backgroundColor: '#0f0' }}>
              {chatMessages.map((msg, i) => {
                if (msg.data.length > 0) {
                  return (<View key={`msg-` + i} style={{ flexDirection: 'row' }}>
                    <TextBold>{msg.username}</TextBold>
                    <Text style={{ borderWidth: 2 }}>{msg.data}</Text>
                  </View>)
                }
              })}
            </View>

            <View style={{ flex: 0.3, flexDirection: 'row' }}>
              <TextInput
                style={{ flex: 0.8, height: 40, borderWidth: 2 }}
                autoCorrect={false}
                value={chatMessage}
                onSubmitEditing={() => submitChatMessage()}
                onChangeText={msg => {
                  setChatMessage(msg)
                }}
                onFocus={() => setCurrentSnapPoint(1)}
              />
              <Button mode="contained" onPress={submitChatMessage}>
                Send
              </Button>
            </View>
          </View>)}

          {!joinStatus && (<View style={{ flexDirection: 'row', paddingHorizontal: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button mode="contained" onPress={onJoin}>
              Accept
            </Button>
            <Button onPress={onDecline}>
              Decline
            </Button>
          </View>)}
        </BottomSheetScrollView>
      </BottomSheet>





      {showConfirmCancel && (<Portal>
        <Modal visible={showConfirmCancel} onDismiss={hideConfirmCancel} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure to cancel?</H3>

          {isHost && (<Paragraph>
            Since you're the host, this will also cancel for other members
          </Paragraph>)}

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



      {showWarningCantStart && (<Portal>
        <Modal visible={showWarningCantStart} onDismiss={hideWarningCantStart} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Not yet!</H3>

          <Paragraph>
            You need at least one partner to start a challenge in team mode
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideWarningCantStart}>Close</Button>
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
        {!isStarted && isHost && (<Button mode="contained" onPress={onStartTeam} labelStyle={{ paddingBottom: 1 }}>
          <MaterialCommunityIcons name="close" size={14} />
          Start now
        </Button>)}
        
        <Button mode="contained" onPress={onPressCancelChallenge} labelStyle={{ paddingBottom: 1 }}>
          <MaterialCommunityIcons name="close" size={14} />
          {isHost ? 'End Challenge' : 'Out Challenge'}
        </Button>
      </View>


    </DefaultView>
  )
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4
  },
  item: {
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center',
    marginVertical: 10,
  },
})

export default ChallengeDiscoverDetailStartTeamScreen
