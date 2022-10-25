import React, { PropTypes, Component, useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Image, ScrollView, ToastAndroid, PermissionsAndroid, Dimensions, TouchableOpacity } from 'react-native'
import { ProgressBar, Button, Appbar, useTheme, Badge, Portal, Modal, Paragraph, MD2Colors, MD3Colors } from 'react-native-paper'
import { H2, H3, Text, TextBold } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import { levels_ranges, useGlobals } from '../../contexts/global'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import haversine from 'haversine'
import Storer from '../../utils/storer'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */

function DashboardHomeScreen({ navigation }) {
  const [{ loggedUser, currentChallenge, currentLocation, trackStep, trackLoc }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const [loading, setLoading] = useState(true)

  const [donationProgress, setDonationProgress] = useState()

  const [levelProgress, setLevelProgress] = useState(0.3)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [nextLevel, setNextLevel] = useState(1)

  const [currentChallenges, setCurrentChallenges] = useState()
  const [pendingInvitations, setPendingInvitations] = useState()


  /*
   * Compute donation progress
   */
  useEffect(() => {
    if (loggedUser.target_donation != null) {
      setDonationProgress(Math.min(loggedUser.current_donation / loggedUser.target_donation, 100))
    } else {
      setDonationProgress(100)
    }
  }, [loggedUser])


  /*
   * Compute current level, next level and level progress
   */
  useEffect(() => {
    let i = -1
    const reachMaxLevel = levels_ranges.every(level => {
      i += 1
      if (loggedUser.current_reward < level.start) {
        setNextLevel(i)
        setCurrentLevel(i - 1)

        setLevelProgress((loggedUser.current_reward - levels_ranges[i-1].start) / (levels_ranges[i].start - levels_ranges[i-1].start))

        return false
      }
      return true
    })

    if (reachMaxLevel) {
      setNextLevel(i)
      setCurrentLevel(i)
    }
  }, [loggedUser])


  /* 
   * Load unfinished challenges and pending invitations
   */
  useEffect(() => {
    setLoading(true)
    loadCurrentChallenges()
    loadPendingInvitations()
  }, [currentChallenge])

  useEffect(() => {
    if (currentChallenges != null && pendingInvitations != null) {
      // //console.log('Loaded')
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
  const loadCurrentChallenges = () => {
    userAPI.getCurrentChallenge({ num_per_page: 100 }).then((res) => {
      // //console.log('[loadCurrentChallenges] res', res.data.length)
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
      // //console.log('[loadPendingInvitations] res', res.data.length)
      setPendingInvitations(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  const onFindMoreChallenges = () => {
    navigation.navigate('ChallengeStack', { screen: 'ChallengeSelect' })
  }

  // const onContinueChallenge = (challenge_accepted) => {
  //   //console.log('[Dashboard] onContinueChallenge CALLED ~ ')

  //   const challenge_detail = challenge_accepted.challenge_detail

  //   navigation.navigate('_ChallengeDetailStart', {
  //     key: '_ChallengeDetailStart',
  //     challenge_accepted_data: challenge_accepted,
  //   })
  // }
  /*
   * Start the challenge. Go to the map direction screen.
   * Make sure to check if there's any other challenge running.
   */
  const [selectedChallenge, setSelectedChallenge] = useState()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const hideConfirmDialog = () => {
    setShowConfirmDialog(false)
    setLoading(false)
  }
  // const [movingScreen, setMovingScreen] = useState(false)
  const onPressChallenge = (challenge_accepted) => {
    setLoading(true)

    // setTimeout(() => {
    setSelectedChallenge(challenge_accepted)

    if (currentChallenge != null) {
      if (currentChallenge.challenge_detail._id !== challenge_accepted.challenge_detail._id) { //? the user is in another challenge
        setShowConfirmDialog(true)
      } else { //? is in this challenge
        goToChallengeNow(currentChallenge)
      }
    } else {
      setShowConfirmDialog(false)
      goToChallengeNow(challenge_accepted)
    }
    // }, 1000)
  }
  const goToChallengeNow = (challenge_accepted) => {
    setShowConfirmDialog(false)

    console.log('[dashboard][goToChallengeNow] challenge_accepted', challenge_accepted)

    navigation.navigate('_ChallengeDetailStart', {
      key: '_ChallengeDetailStart',
      challenge_accepted_data: challenge_accepted,
    })

    //! has to reset started to false. this will be set to true depends on join mode
    onSetDispatch('setStarted', 'started', false)
    onSetDispatch('setCompleted', 'completed', 0)

    // Storer.set('currentChallenge', challenge_accepted)
    // onSetDispatch('setCurrentChallenge', 'currentChallenge', challenge_accepted)
    // onSetDispatch('setShowBottomBar', 'showBottomBar', false)
    setLoading(false)
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

      {showConfirmDialog && (<Portal>
        <Modal visible={showConfirmDialog} onDismiss={hideConfirmDialog} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Another challenge running</H3>

          <Paragraph>
            You are in another challenge: <TextBold>{currentChallenge.challenge_detail.name}</TextBold>
          </Paragraph>
          <Paragraph>
            Starting this challenge will kill the other challenge you are doing. Are you sure ?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmDialog}>No, continue old challenge</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={() => goToChallengeNow(selectedChallenge)}>Yes, start this challenge</Button>
          </View>
        </Modal>
      </Portal>)}


      <ScrollView style={{ backgroundColor: 'transparent', paddingHorizontal: 20 }}>

        <TouchableOpacity onPress={goToProfile} style={{ flexDirection: 'row', paddingVertical: 20 }}>
          <Image
            source={{ uri: loggedUser.avatar }}
            style={{ height: 80, width: 80, borderRadius: 100 }}
          />
          <View style={styles.profileDetailsTextContainer}>
            <H3>{loggedUser.firstname}</H3>
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <Image source={levels_ranges[currentLevel].image} style={{ height: 20, width: 20, marginLeft: -5 }} />
              <Text style={{ alignSelf: 'flex-start', marginBottom: 5, color: '#777', fontSize: 14, lineHeight: 18 }}>
                {levels_ranges[currentLevel].title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ width: width - 40, flexDirection: 'row' }}>
          <Image
            source={levels_ranges[currentLevel].image}
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
              progress={levelProgress}
              color={colors.primary}
            />
          </View>
          <Image
            source={levels_ranges[nextLevel].image}
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
            height: 34,
            paddingBottom: 4,
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
            height: 34,
            paddingBottom: 4,
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


        <View style={{ marginTop: 30 }}>
          <H3>Unfinished challenge</H3>
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

              {currentChallenges.map((item, i) => (<TouchableOpacity key={`my-challenge-` + i}
                onPress={() => onPressChallenge(item)}
                style={{
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>

                <Image style={{ height: 46, width: 46, marginTop: 15, marginLeft: 0, marginRight: -23, zIndex: 3, }}
                  source={item.challenge_detail.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')} />

                <View style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingLeft: 30,
                  paddingRight: 10,
                  borderWidth: 1,
                  borderColor: '#f4f4f4',
                  backgroundColor: '#fff',
                  borderRadius: 6,
                }}>
                  <TextBold style={{ color: colors.primary, fontSize: 15.5, lineHeight: 22 }}>{item.challenge_detail.name}</TextBold>
                  {/* <Text>{item.challenge_detail.type}</Text> */}

                  <View style={{ marginTop: 5 }}>
                    {currentLocation != null && item.challenge_detail.type === 'discover' && <Text style={styles.subtitle}>{calcDistance(item.challenge_detail.place_detail.coordinates, currentLocation)}</Text>}
                    {item.challenge_detail.type === 'walk' && <Text style={styles.subtitle}>{item.challenge_detail.distance}km</Text>}

                    <Badge style={{
                      paddingHorizontal: 10, position: 'absolute', right: 0, marginTop: 6, lineHeight: 12,
                      backgroundColor: item.mode === 'individual' ? MD3Colors.primary40 : MD3Colors.primary25
                    }}>{item.mode}</Badge>
                  </View>
                </View>

              </TouchableOpacity>))}

            </View>)}
          </View>
        </View>


        <View style={{ marginTop: 35 }}>
          <H3>Pending invitations</H3>
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

              {pendingInvitations.map((item, i) => (<TouchableOpacity key={`my-challenge-` + i}
                onPress={() => onPressChallenge(item)}
                style={{
                  flexDirection: 'row',
                  marginVertical: 5,
                }}>

                <Image style={{ height: 46, width: 46, marginTop: 15, marginLeft: 0, marginRight: -23, zIndex: 3, }}
                  source={item.challenge_detail.type == 'walk' ? require('../../../assets/icons/walking.png') : require('../../../assets/icons/discover.png')} />

                <View style={{
                  flex: 1,
                  paddingVertical: 15,
                  paddingLeft: 30,
                  paddingRight: 10,
                  borderWidth: 1,
                  borderColor: '#f4f4f4',
                  backgroundColor: '#fff',
                  borderRadius: 6,
                }}>
                  <TextBold style={{ color: colors.primary, fontSize: 15.5, lineHeight: 22 }}>{item.challenge_detail.name}</TextBold>

                  <View style={{ marginTop: 5 }}>
                    <Text style={styles.subtitle}>From <TextBold style={styles.subtitle}>{item.from_user.username}</TextBold></Text>

                    {currentLocation != null && item.challenge_detail.type === 'discover' && <Text style={styles.subtitle}>{calcDistance(item.challenge_detail.place_detail.coordinates, currentLocation)}</Text>}
                    {item.challenge_detail.type === 'walk' && <Text style={styles.subtitle}>{item.challenge_detail.distance}km</Text>}

                  </View>
                </View>

              </TouchableOpacity>))}

            </View>)}

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
    </DefaultView >
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
    marginTop: 15,
    marginBottom: 8,
    flexDirection: 'column',
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
    marginTop: 30,
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    lineHeight: 18,
  }
})
export default DashboardHomeScreen
