import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
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


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeDiscoverDetailStartScreen({ route, navigation }) {
  const [{ currentChallenge, loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  const { challenge_accepted_data } = route.params
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('>>> challenge_accepted_id', challenge_accepted_id)
    console.log('>>> mode', mode)
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
  }, [locationStatus, completed])

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
  const processPosition = async (position) => {
    console.log('\n[detail processPosition] position', position)
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
  const updateTrackState = async (currentLatitude, currentLongitude) => {
    //? update user's position and user's route
    const { coordinate, routeCoordinates, distanceTravelled } = trackLocationState

    const newCoordinate = {
      latitude: currentLatitude,
      longitude: currentLongitude
    }

    if (Platform.OS === "android") {
      if (animatedMarker != null) {
        animatedMarker.animateMarkerToCoordinate(newCoordinate, 500)
      }
    } else {
      coordinate.timing(newCoordinate).start()
    }

    await setTrackLocationState({
      latitude: currentLatitude,
      longitude: currentLongitude,
      routeCoordinates: routeCoordinates.concat([newCoordinate]),
      distanceTravelled: distanceTravelled + calcDistance(newCoordinate),
      prevLatLng: newCoordinate
    })
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
  const hideConfirmComplete = () => setShowConfirmCancel(false)
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

  // /* **********************************************
  //  *
  //  * Take screenshot of routes travelled when completed
  //  *
  //  * **********************************************/
  // const ref_mapview = useRef()
  // const captureAndShareScreenshot = async () => {
  //   const uri = await ref_mapview.current.capture()//.then((uri) => {
  //   return uri

  //     // return RNFS.readFile(uri, 'base64').then((res) => {
  //     //   let urlString = 'data:image/jpegbase64,' + res
  //     //   let options = {
  //     //     title: 'Share Title',
  //     //     message: 'Share Message',
  //     //     url: urlString,
  //     //     type: 'image/jpeg',
  //     //   }
  //     //   console.log('>>> options', options)
  //     //   return options
  //     //   // Share.open(options).then((res) => {
  //     //   //   console.log(res)
  //     //   // }).catch((err) => {
  //     //   //   err && console.log(err)
  //     //   // })
  //     // })
  //   //})
  // }



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
  // const snapPoints = useMemo(() => ['15%', '50%', '90%'], [])
  const snapPoints = useMemo(() => ['15%', '90%'], [])
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0)

  //? callbacks
  const handleSheetChange = useCallback((index) => {
    // console.log('handleSheetChange', index)
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

            <Polyline coordinates={trackLocationState.routeCoordinates} strokeWidth={5} />
            {trackLocationState.coordinate != null && (<Marker.Animated
              ref={marker => setAnimatedMarker(marker)}
              coordinate={trackLocationState.coordinate}
            />)}

          </MapView>)
            : (<Text>Location must be enabled to use map</Text>)}
        </ViewShot>
      </View>


      <View style={{ flex: 0.1 }}>
        <Button title="Snap To 90%" onPress={() => handleSnapPress(1)} />
        {/* <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} /> */}
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

        {/* <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: -30 }}>
          <Button mode="contained" onPress={onPressCancelChallenge}>
            <MaterialCommunityIcons name="close" size={20} style={{ marginTop: 2 }} />
            Cancel Challenge
          </Button>
        </View> */}

        <BottomSheetScrollView contentContainerStyle={{ zIndex: 100 }}>

          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 5
          }}>
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
              <IconButton
                icon="camera"
                size={55}
                onPress={() => console.log('Pressed')}
              />
            </View>
            <View style={{ flex: 0.8, flexDirection: 'row' }} contentContainerStyle={{ justifyContent: 'center' }}>
              {currentSnapPoint === 0 ? (<>
                <Avatar.Image size={70} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/829b523aec90326da9113bd875d55273.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/360_F_57953437_rqwzwzS4Bfb7UiclmisK6XsJW69bBZps.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/EV7GQDAX0AAYSpg.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/stock-photo-kitten-art-oil-painting-cute-cat-foreign-country-inspirational-art-funny-face-cat-colorful-canvas-backgrounds-for-design-81c403a2-12dd-4deb-8c8f-3fa3491c324f.jpg')} style={{ marginRight: 10 }} />
              </>) :
                (<Text>Upload your status</Text>)}
            </View>
          </View>


          {currentSnapPoint != 0 && (<>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>Hello</Text>
                </View>
                <Image source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />
              </View>
            </View>
          </>)}

        </BottomSheetScrollView>
      </BottomSheet>



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
  tabBar: {
    flexDirection: 'row',
  },
  tabItem: {
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 2
  },
  tabCont: {
    paddingHorizontal: 15
  },

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

export default ChallengeDiscoverDetailStartScreen
