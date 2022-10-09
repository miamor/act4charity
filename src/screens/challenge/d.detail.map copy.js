import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Button, useTheme, IconButton, MD3Colors, Avatar } from 'react-native-paper'
import { Text, H2 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'

import * as Yup from 'yup'
import { Formik } from 'formik'
import axios from 'axios'

import Geolocation from 'react-native-geolocation-service'
import MapView, { Marker, Polyline, AnimatedRegion, enableLatestRenderer, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GOOGLE_API_KEY } from '../../constants/keys'
// import MapViewNavigation, { NavigationModes, TravelModeBox, TravelIcons, Geocoder, TravelModes, DirectionsListView, ManeuverView, DurationDistanceView } from 'react-native-maps-navigation'
import haversine from 'haversine'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeDiscoveryDetailMapScreen({ route, navigation }) {
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



  /* **********************************************
   *
   * Location and map
   *
   * **********************************************/
  // useEffect(() => {
  //   (async () => {
  //     // requestLocationPermission()
  //     const granted_gps = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
  //     console.log('granted_gps', granted_gps)

  //     if (granted_gps == PermissionsAndroid.RESULTS.GRANTED) {
  //       subscribeLocation()
  //     } else {
  //       requestLocationPermission()
  //     }

  //     console.log('~~~~~~ locationStatus', locationStatus)
  //   })()
  // }, [locationStatus])

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
    _subscriptionLocation = Geolocation.watchPosition((position) => {
      processPosition(position)
    }, (error) => {
      setLocationStatus(-1)
      console.error('[subscribeLocation]', error.message)
    }, { enableHighAccuracy: false, maximumAge: 1000 })
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
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    []
  )
  const snapPoints = useMemo(() => ['15%', '50%', '90%'], [])
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0)

  //? callbacks
  const handleSheetChange = useCallback((index) => {
    console.log('handleSheetChange', index)
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

      <View style={{ flex: 0.9 }}>
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
          <Marker coordinate={region} />
          <Marker coordinate={challengeDetail.coordinates} />

          <MapViewDirections
            origin={region}
            destination={challengeDetail.coordinates}
            apikey={GOOGLE_API_KEY} // insert your API Key here
            strokeWidth={4}
            strokeColor="#111111"
          />

          <Polyline coordinates={trackLocationState.routeCoordinates} strokeWidth={5} />
          {trackLocationState.coordinate != null && (<Marker.Animated
            ref={marker => setAnimatedMarker(marker)}
            coordinate={trackLocationState.coordinate}
          />)}

          {/* <MapViewNavigation
          origin={region}
          destination={challengeDetail.coordinates}
          navigationMode={navigationMode}
          travelMode={travelMode}
          // ref={ref => this.refNavigation = ref}
          map={refMap}
          apiKey={GOOGLE_API_KEY}
          simulate={true}
          // onRouteChange={route => setMapRoute(route)}
          // onStepChange={(step, nextStep) => changeStep(step, nextStep)}
          displayDebugMarkers={true}
          onNavigationStarted={route => console.log("Navigation Started")}
          onNavigationCompleted={route => setIsNavigation(false)}
        /> */}

        </MapView>)
          : (<Text>Location must be enabled to use map</Text>)}

      </View>


      <View style={{ flex: 0.1 }}>
        <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
        <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
        <Button title="Snap To 10%" onPress={() => handleSnapPress(0)} />
        <Button title="Close" onPress={() => handleClosePress()} />
      </View>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>

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
              {/* {currentSnapPoint == 0 ? (<>
                <Avatar.Image size={70} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/829b523aec90326da9113bd875d55273.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/360_F_57953437_rqwzwzS4Bfb7UiclmisK6XsJW69bBZps.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/EV7GQDAX0AAYSpg.jpg')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/Lynne Pickering cat.png')} style={{ marginRight: 10 }} />
                <Avatar.Image size={70} source={require('../../../assets/kitten/stock-photo-kitten-art-oil-painting-cute-cat-foreign-country-inspirational-art-funny-face-cat-colorful-canvas-backgrounds-for-design-81c403a2-12dd-4deb-8c8f-3fa3491c324f.jpg')} style={{ marginRight: 10 }} />
              </>) :
                (<Text>Upload your status</Text>)} */}
            </View>
          </View>


          {/* {currentSnapPoint != 0 && (<>
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>Hello</Text>
                </View>
                <Image source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>Hello</Text>
                </View>
                <Image source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>Hello</Text>
                </View>
                <Image source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginBottom: 30 }}>
              <Avatar.Image size={60} source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginRight: 10, width: 60 }} />

              <View>
                <View style={{ marginLeft: 5 }}>
                  <Text>Hello</Text>
                </View>
                <Image source={require('../../../assets/kitten/5d-diamond-painting-white-cat-kitten-kit-15583777259623__30548.1631188766.jpg')} style={{ marginTop: 10, height: imageHeight, width: imageWidth }} />
              </View>
            </View>
          </>)} */}

        </BottomSheetScrollView>
      </BottomSheet>


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

export default ChallengeDiscoveryDetailMapScreen
