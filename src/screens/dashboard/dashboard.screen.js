import React, { PropTypes, Component, useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Image, ScrollView, ToastAndroid, PermissionsAndroid, Dimensions, TouchableOpacity } from 'react-native'
import { ProgressBar, Button, Appbar, useTheme, Badge } from 'react-native-paper'
import { H2, H3, Text, TextBold } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { useGlobals } from '../../contexts/global'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import haversine from 'haversine'


const levels_ranges = {
  0:
}


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */

function DashboardHomeScreen({ navigation }) {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(true)

  const [targetModal, setTargetModalVisibility] = useState(false)
  const [progress, setProgress] = useState(0.3)
  const [donationProgress, setDonationProgress] = useState()


  const [currentChallenges, setCurrentChallenges] = useState()
  const [pendingInvitations, setPendingInvitations] = useState()


  useEffect(() => {
    if (loggedUser.target_donation != null) {
      setDonationProgress(Math.min(loggedUser.current_donation / loggedUser.target_donation, 100))
    } else {
      setDonationProgress(100)
    }
  }, [loggedUser])

  useEffect(() => {
    loadCurrentChallenge()
    loadPendingInvitations()
  }, [])

  useEffect(() => {
    if (currentChallenges != null && pendingInvitations != null) {
      // console.log('Loaded')
      setLoading(false)
    }
  }, [currentChallenges, pendingInvitations])


  
  /*
   * Calculate distance between two points
   */
  const calcDistance = (point1, point2) => {
    const dist = haversine(point1, point2) || 0
    if (dist < 1) return Math.floor(dist * 1000) + 'm'
    return Math.floor(dist, 1) + 'km'
  }


  /* **********************************************
   *
   * Load my current challenge
   *
   * **********************************************/
  const loadCurrentChallenge = () => {
    userAPI.getCurrentChallenge({ num_per_page: 100 }).then((res) => {
      // console.log('[loadCurrentChallenge] res', res.data.length)
      setCurrentChallenges(res.data)
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
  const loadPendingInvitations = () => {
    userAPI.getPendingInvitations({ num_per_page: 100 }).then((res) => {
      // console.log('[loadPendingInvitations] res', res.data.length)
      setPendingInvitations(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  const onFindMoreChallenges = () => {
    navigation.navigate('ChallengeStack', { screen: 'ChallengeSelect' })
  }

  const onContinueChallenge = (challenge_accepted) => {
    console.log('[Dashboard] onContinueChallenge CALLED ~ ')

    const challenge_detail = challenge_accepted.challenge_detail

    navigation.navigate('_ChallengeDetailStart', {
      key: '_ChallengeDetailStart',
      challenge_accepted_data: challenge_accepted,
    })

  }

  
  const goToProfile = () => {
    navigation.navigate('ProfileStack')
  }


  const { width } = Dimensions.get('window')


  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Welcome" color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      <ScrollView style={{ backgroundColor: 'transparent', paddingHorizontal: 20 }}>

        <TouchableOpacity onPress={goToProfile} style={{ flexDirection: 'row', paddingVertical: 20 }}>
          <Image
            source={{ uri: loggedUser.avatar }}
            style={{ height: 80, width: 80, borderRadius: 100 }}
          />
          <View style={styles.profileDetailsTextContainer}>
            <H3>{loggedUser.first_name}</H3>
            <Text style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
              {loggedUser.level}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={{ width: width - 40, flexDirection: 'row' }}>
          <Image
            source={require('../../../assets/icons/medal-bronze.png')}
            style={{
              height: 48,
              width: 48,
              marginLeft: -5,
              zIndex: 1,
            }}
          />
          <View style={{ justifyContent: 'center', marginTop: -4, marginLeft: -10 }}>
            <ProgressBar
              style={{ height: 10, width: width - 40 - 33 * 2 }}
              progress={progress}
              color={colors.primary}
            />
          </View>
          <Image
            source={require('../../../assets/icons/medal-silver.png')}
            style={{
              height: 48,
              width: 48,
              marginLeft: -10,
            }}
          />
        </View>

        <View style={{ width: width - 40, flexDirection: 'row', marginTop: 10 }}>
          <View style={{
            backgroundColor: '#E8DEF8',
            borderRadius: 8,
            height: 32,
            width: 57,
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'absolute',
            marginTop: 4,
            marginLeft: 2,
            zIndex: 1,
          }}>
            <Text variant="labelLarge">${loggedUser.current_donation}</Text>
          </View>
          <View style={{ justifyContent: 'center', marginTop: 3, marginLeft: -10 }}>
            <ProgressBar
              style={{ height: 10, width: width - 40 - 54 * 2 }}
              progress={donationProgress}
              color={'#6750A4'}
            />
          </View>
          <View style={{
            backgroundColor: '#E8DEF8',
            borderRadius: 8,
            height: 32,
            width: 57,
            alignItems: 'center',
            justifyContent: 'center',
            // position: 'absolute',
            marginTop: 4,
            // marginLeft: 294,
          }}>
            <Text variant="labelLarge">${loggedUser.target_donation}</Text>
          </View>
        </View>

        <View style={{ marginTop: 18, marginBottom: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Button mode="outlined" style={{ borderRadius: 12, borderColor: '#6750A4', flex: 1 }}
            onPress={() => navigation.navigate('_Target')}
          // contentStyle={{ paddingTop: 3, paddingBottom: 2 }}
          >
            Define a target!
          </Button>
        </View>


        <View style={{ marginTop: 20 }}>
          <H2>Unfinished challenge {loading}</H2>
          <View style={[{
            flexDirection: 'column',
            justifyContent: 'center',
            // marginTop: 10,
          },
          (currentChallenges == null || currentChallenges.length === 0) && {
            alignItems: 'center'
          }
          ]}>
            {currentChallenges == null || currentChallenges.length === 0 ? <Image
              source={require('../../../assets/images/nochallenge.png')}
              style={{ height: 175, width: 175 }}
            /> : (<View style={{}}>
              {currentChallenges.map((item, i) => (<View key={`my-challenge-` + i} style={{ flexDirection: 'row', marginVertical: 10, marginRight: 20 }}>

                <Image style={{ height: 46, width: 46, marginTop: 2 }}
                  source={item.challenge_detail.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')} />

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <TextBold style={{ color: colors.primary, lineHeight: 25 }}>{item.challenge_detail.name}</TextBold>
                  {/* <Text>{item.challenge_detail.type}</Text> */}

                  <View style={{}}>
                    {currentLocation != null && item.challenge_detail.type === 'discover' && <Text>{calcDistance(item.challenge_detail.place_detail.coordinates, currentLocation)}</Text>}
                    <Badge style={{ paddingHorizontal: 10, position: 'absolute', right: 0, marginTop: 6, lineHeight: 12 }}>{item.mode}</Badge>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end' }}>
                    <Button mode="contained" onPress={() => onContinueChallenge(item)}>
                      Continue
                    </Button>
                  </View>

                </View>

              </View>))}
            </View>)}
          </View>
        </View>


        <View style={{ marginTop: 20 }}>
          <H2>Pending invitations</H2>
          <View style={[{
            flexDirection: 'column',
            justifyContent: 'center',
            // marginTop: 10,
          },
          (pendingInvitations == null || pendingInvitations.length === 0) && {
            alignItems: 'center'
          }
          ]}>
            {pendingInvitations == null || pendingInvitations.length === 0 ? <Image
              source={require('../../../assets/images/nochallenge.png')}
              style={{ height: 175, width: 175 }}
            /> : (<View style={{}}>
              {pendingInvitations.map((item, i) => (<View key={`my-challenge-` + i} style={{ flexDirection: 'row', marginVertical: 10, marginRight: 20 }}>

                <Image style={{ height: 46, width: 46, marginTop: 2 }}
                  source={item.challenge_detail.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')} />

                <View style={{ flex: 1, marginLeft: 10 }}>
                  <TextBold style={{ color: colors.primary, lineHeight: 25 }}>{item.challenge_detail.name}</TextBold>

                  <View style={{}}>
                    <Text>
                      From <TextBold>{item.from_user.username}</TextBold>
                      |
                      {currentLocation != null && item.challenge_detail.type === 'discover' && <Text>{calcDistance(item.challenge_detail.place_detail.coordinates, currentLocation)}</Text>}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'flex-end' }}>
                    <Button mode="contained">
                      Accept
                    </Button>
                  </View>

                </View>

              </View>))}
            </View>)}


            {/* : pendingInvitations.map((invitation, i) => (<View key={`my-invitations-` + i}>
              <H3>{invitation.challenge_detail.name}</H3>
              <Text>{invitation.challenge_detail.type}</Text>
              <Text>From <TextBold>{invitation.from_user.username}</TextBold></Text>
              {currentLocation != null && invitation.challenge_detail.type === 'discover' && <Text>{calcDistance(invitation.challenge_detail.place_detail.coordinates, currentLocation)}</Text>}
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Button mode="contained">
                  Accept
                </Button>
              </View>
            </View>))} */}
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
  targetButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  currentChallenge: {
    marginTop: 20
  },
  challengeButtonContainer: {
    marginTop: 51,
    marginBottom: 48,
  },
})
export default DashboardHomeScreen