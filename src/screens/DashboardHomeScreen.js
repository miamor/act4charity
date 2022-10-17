import React, { PropTypes, Component, useEffect, useState } from 'react'
import { StyleSheet, View, Image, ScrollView, ToastAndroid, PermissionsAndroid } from 'react-native'
import { ProgressBar, Button, Appbar, useTheme } from 'react-native-paper'
import { H2, H3, Text } from '../components/paper/typos'
import { DefaultView } from '../components/containers'
import { useGlobals } from '../contexts/global'
import TargetScreenModal from './TargetScreenModal'
import Loading from '../components/animations/loading'

import * as userAPI from '../services/userAPI'
import * as Location from 'expo-location'
import haversine from 'haversine'
import { TextBold } from '../components/paper'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */

function DashboardHomeScreen({ navigation }) {
  const [{ loggedUser, currentChallenge }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(true)

  const [targetModal, setTargetModalVisibility] = useState(false)
  const [progress, setProgress] = useState(0.5)
  const [donationProgress, setDonationProgress] = useState(246)
  const [finalDonationAmount, setFinalDonationAmount] = useState(500)
  const donationProgressPercentage = donationProgress / finalDonationAmount

  useEffect(() => {
    loadCurrentChallenge()
    loadPendingInvitations()
    loadCompletedChallenge()

    requestLocationPermission()
    return () => unsubscribeLocation()
  }, [])

  useEffect(() => {
    if (currentChallenges != null && pendingInvitations != null && completedChallenges != null) {
      setLoading(false)
    }
  }, [currentChallenges, pendingInvitations, completedChallenges])


  /* **********************************************
   *
   * Load my current challenge
   *
   * **********************************************/
  const [currentChallenges, setCurrentChallenges] = useState()
  const loadCurrentChallenge = () => {
    userAPI.getCurrentChallenge({}).then((res) => {
      console.log('[loadCurrentChallenge] res', res)
      setCurrentChallenges(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /* **********************************************
   *
   * Load my completed challenge
   *
   * **********************************************/
  const [completedChallenges, setCompletedChallenges] = useState()
  const loadCompletedChallenge = () => {
    userAPI.getCompletedChallenge({}).then((res) => {
      console.log('[loadCompletedChallenge] res', res)
      setCompletedChallenges(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /* **********************************************
   *
   * Load pending invitation
   *
   * **********************************************/
  const [pendingInvitations, setPendingInvitations] = useState()
  const loadPendingInvitations = () => {
    userAPI.getPendingInvitations({}).then((res) => {
      console.log('[loadPendingInvitations] res', res)
      setPendingInvitations(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  /* **********************************************
   *
   * Get my current position to find nearby challenges, etc.
   *
   * **********************************************/
  const [locationStatus, setLocationStatus] = useState(0)
  const [myLocation, setMyLocation] = useState()
  /*
   * Request user's permission to retrieve location
   */
  const requestLocationPermission = async () => {
    console.log('[requestLocationPermission] CALLED')
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
  const processPosition = (position) => {
    console.log('\n[detail processPosition] position', position)
    setLocationStatus(1)
    setLoading(false)

    //? getting the Longitude from the location json
    const currentLongitude = parseFloat(JSON.stringify(position.coords.longitude))
    const currentLatitude = parseFloat(JSON.stringify(position.coords.latitude))

    setMyLocation({
      latitude: currentLatitude,
      longitude: currentLongitude,
    })
  }

  /*
   * Calculate distance between two points
   */
  const calcDistance = (point1, point2) => {
    const dist = haversine(point1, point2) || 0
    if (dist < 1) return Math.floor(dist * 1000) + 'm'
    return Math.floor(dist, 1) + 'km'
  }



  const onFindMoreChallenges = () => {
    navigation.navigate('ChallengesStack', { screen: 'ChallengeSelect' })
  }

  const onContinueChallenge = (challenge_accepted) => {
    const challenge_detail = challenge_accepted.challenge_detail
    
    if (challenge_detail.type === 'discover') {
      let screenName = 'ChallengeDiscoverDetailStart'
      if (challenge_accepted.mode === 'team') screenName = 'ChallengeDiscoverDetailStartTeam'

      navigation.navigate('ChallengesStack', {
        screen: screenName,
        params: {
          key: screenName,
          challenge_accepted_data: challenge_accepted,
        }
      })
    } else {
      let screenName = 'ChallengeWalkDetailStart'
      if (challenge_accepted.mode === 'team') screenName = 'ChallengeWalkDetailStartTeam'

      navigation.navigate('ChallengesStack', {
        screen: screenName,
        params: {
          key: screenName,
          challenge_accepted_data: challenge_accepted,
        }
      })
    }
  }



  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Welcome" color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <View style={styles.mainViewContainer}>
          <View style={styles.profileDetailsViewContainer}>
            <Image
              source={require('../../assets/icons/placeholder.png')}
              style={{ height: 80, width: 80, borderRadius: 100 }}
            />
            <View style={styles.profileDetailsTextContainer}>
              <H3>{loggedUser.first_name}</H3>
              <Text style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
                {loggedUser.level}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              style={{ marginLeft: 10, height: 12, width: 310, marginTop: 14 }}
              progress={progress}
              color={'#6750A4'}
            />
            <Image
              source={require('../../assets/icons/startMedal.png')}
              style={{
                height: 48,
                width: 48,
                marginRight: 10,
                position: 'absolute',
              }}
            />
            <Image
              source={require('../../assets/icons/endMedal.png')}
              style={{
                height: 48,
                width: 48,
                position: 'absolute',
                marginLeft: 300,
              }}
            />
          </View>
          <View style={{ marginTop: 8 }}>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                style={{ marginLeft: 10, height: 12, width: 310, marginTop: 14 }}
                progress={donationProgressPercentage}
                color={'#6750A4'}
              />
              <View
                style={{
                  backgroundColor: '#E8DEF8',
                  borderRadius: 8,
                  height: 32,
                  width: 57,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  marginTop: 4,
                }}>
                <Text variant="labelLarge">${donationProgress}</Text>
              </View>
              <View
                style={{
                  backgroundColor: '#E8DEF8',
                  borderRadius: 8,
                  height: 32,
                  width: 57,
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  marginTop: 4,
                  marginLeft: 294,
                }}>
                <Text variant="labelLarge">${finalDonationAmount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.targetButtonContainer}>
            <Button
              onPress={() => {
                console.log('define goals button pressed')
                navigation.navigate('DashboardTarget')
              }}
              style={{ borderRadius: 12, borderColor: '#6750A4' }}
              contentStyle={{ paddingTop: 3, paddingBottom: 2 }}
              mode="outlined">
              Define a target!
            </Button>
          </View>


          <View style={styles.currentChallenge}>
            <H2>Current challenge</H2>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
              {currentChallenges == null || currentChallenges.length === 0 ? <Image
                source={require('../../assets/images/nochallenge.png')}
                style={{ height: 175, width: 175 }}
              /> : currentChallenges.map((challenge_accepted, i) => (<View key={`my-challenge-` + i}>
                <H3>{challenge_accepted.challenge_detail.name}</H3>
                <Text>{challenge_accepted.challenge_detail.type}</Text>
                <Text>{challenge_accepted.mode}</Text>
                {myLocation != null && challenge_accepted.challenge_detail.type === 'discover' && <Text>{calcDistance(challenge_accepted.challenge_detail.place_detail.coordinates, myLocation)}</Text>}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Button mode="contained" onPress={() => onContinueChallenge(challenge_accepted)}>
                    Continue
                  </Button>
                </View>
              </View>))}
            </View>
          </View>


          <View style={styles.currentChallenge}>
            <H2>Pending invitations</H2>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
              {pendingInvitations == null || pendingInvitations.length === 0 ? <Image
                source={require('../../assets/images/nochallenge.png')}
                style={{ height: 175, width: 175 }}
              /> : pendingInvitations.map((invitation, i) => (<View key={`my-invitations-` + i}>
                <H3>{invitation.challenge_detail.name}</H3>
                <Text>{invitation.challenge_detail.type}</Text>
                <Text>From <TextBold>{invitation.from_user.username}</TextBold></Text>
                {myLocation != null && invitation.challenge_detail.type === 'discover' && <Text>{calcDistance(invitation.challenge_detail.place_detail.coordinates, myLocation)}</Text>}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <Button mode="contained">
                    Accept
                  </Button>
                </View>
              </View>))}
            </View>
          </View>


          <View style={styles.challengeButtonContainer}>
            <Button mode="contained"
              onPress={onFindMoreChallenges}
            // style={{ backgroundColor: '#E89C51', borderRadius: 12 }}
            // contentStyle={styles.targetButtonStyle}
            >
              Discover more
            </Button>
          </View>


          <View style={styles.currentChallenge}>
            <H2>My completed challenges</H2>
            <View style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}>
              {completedChallenges == null || completedChallenges.length === 0 ? <Image
                source={require('../../assets/images/nochallenge.png')}
                style={{ height: 175, width: 175 }}
              /> : completedChallenges.map((challenge_accepted, i) => (<View key={`my-challenge-` + i}>
                <H3>{challenge_accepted.challenge_detail.name}</H3>
                <Text>{challenge_accepted.challenge_detail.type}</Text>
                <Text>{challenge_accepted.mode}</Text>
                {myLocation != null && challenge_accepted.challenge_detail.type === 'discover' && <Text>{calcDistance(challenge_accepted.challenge_detail.place_detail.coordinates, myLocation)}</Text>}
              </View>))}
            </View>
          </View>


        </View>
      </ScrollView>
    </DefaultView>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    // marginTop: 12,
    marginRight: 24,
  },
  profileDetailsViewContainer: {
    marginTop: 24,
    marginBottom: 20,
    flexDirection: 'row',
  },
  profileDetailsTextContainer: {
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressBarContainer: {
    height: 48,
  },
  targetButtonContainer: {
    marginTop: 42,
    marginBottom: 48,
  },
  targetButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  currentChallenge: {
    marginBottom: 10
  },
  challengeButtonContainer: {
    marginTop: 51,
    marginBottom: 48,
  },
})
export default DashboardHomeScreen
