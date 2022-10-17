import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import { Appbar, Button, useTheme, Paragraph, Dialog, Portal, Modal } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../../components/paper/typos'
import { DefaultView } from '../../components/containers'
import SpaceSky from '../../components/decorations/space-sky'
import CustomInput from '../../components/paper/custom-input'
import { useGlobals } from '../../contexts/global'
import Loading from '../../components/animations/loading'

import * as userAPI from '../../services/userAPI'
import CreateTeamModal from '../../components/create.team.modal'


/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeWalkDetailInfoScreen({ route, navigation }) {
  const [{ loggedUser, currentChallenge }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const { challengeDetail } = route.params

  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // console.log('challengeDetail', challengeDetail)
    // console.log('route.params', route.params)
    setLoading(false)
  }, [])


  /*
   * Start the challenge. Go to the map direction screen.
   * Make sure to check if there's any other challenge running.
   */
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const hideConfirmDialog = () => setShowConfirmDialog(false)
  const onPressStartChallenge = () => {
    if (currentChallenge != null) {
      if (currentChallenge.challenge_detail._id !== challengeDetail._id) { //? the user is in another challenge
        setShowConfirmDialog(true)
      } else { //? is in this challenge
        navigation.navigate('ChallengeWalkDetailStart', {
          key: 'ChallengeWalkDetailStart',
          challenge_accepted_data: currentChallenge,
        })
      }
    } else {
      onConfirmStart()
    }
  }

  /*
   * After confirming to Start the challenge, ask the user whther they want to join as individual or as a team
   */
  const [showJoinModeDialog, setShowJoinModeDialog] = useState(false)
  const hideJoinModeDialog = () => setShowJoinModeDialog(false)
  const onConfirmStart = () => {
    setShowJoinModeDialog(true)
  }
  const onJoinModeSelect = (mode) => {
    setShowJoinModeDialog(false)
    if (mode == 'individual') {
      startChallengeNow(mode, [loggedUser._id])
    } else {
      setShowCreateTeamModal(true)
    }
  }

  /*
   * Create team
   */
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)
  const hideCreateTeamModal = useCallback(() => setShowCreateTeamModal(false))
  const startChallengeTeam = useCallback((participants_id, participants_username) => {
    setShowCreateTeamModal(false)
    console.log('>>> [startChallengeTeam]', participants_id, participants_username)
    startChallengeNow('team', [...participants_id, loggedUser._id])
  })


  /*
   * Start challenge as individual
   */
  const startChallengeNow = (mode, participants_id) => {
    setLoading(true)

    /*
     * Update in db
     */
    const params = {
      challenge_id: challengeDetail._id,
      mode: mode,
      participants: participants_id
    }
    userAPI.startChallenge(params).then((res) => {
      console.log('>> res', res)
      setLoading(false)

      let screen = 'ChallengeWalkDetailStart'
      if (mode == 'team') screen = 'ChallengeWalkDetailStartTeam'

      navigation.navigate(screen, {
        key: screen,
        // challengeDetail: challengeDetail,
        // mode: mode,
        // challenge_accepted_id: res.data._id,
        challenge_accepted_data: res.data,
        // participants_id: participants_id,
        // participants_username: participants_username,
      })

    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  const dimensions = Dimensions.get('window')


  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={challengeDetail.title} color={colors.primary} />
      </Appbar.Header>

      {loading && <Loading />}

      {showCreateTeamModal && <CreateTeamModal onClose={hideCreateTeamModal} onSubmit={startChallengeTeam} />}

      {showConfirmDialog && (<Portal>
        <Modal visible={showJoinModeDialog} onDismiss={hideJoinModeDialog} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Another challenge running</H3>

          <Paragraph>
            You are in another challenge: <TextBold>{currentChallenge.challenge_detail.name}</TextBold>
          </Paragraph>
          <Paragraph>
            Starting this challenge will kill the other challenge you are doing. Are you sure ?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmDialog}>No, continue old challenge</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onConfirmStart}>Yes, start this challenge</Button>
          </View>
        </Modal>
      </Portal>)}


      {showJoinModeDialog && (<Portal>
        <Modal visible={showJoinModeDialog} onDismiss={hideJoinModeDialog} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Join as a team?</H3>

          <Paragraph>
            Doing a challenge with a team can help boost donation!
          </Paragraph>
          <Paragraph>
            How do you like to do this challenge?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={() => onJoinModeSelect('individual')}>Do as individual</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={() => onJoinModeSelect('team')}>Do as a team</Button>
          </View>
        </Modal>
      </Portal>)}


      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <View style={{ flex: 0.6, backgroundColor: '#f0f', justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: challengeDetail.charity_detail.image }} style={{ width: dimensions.width - 20, height: 290 }} />
        </View>

        <View style={{ flex: 0.6, paddingHorizontal: 10, marginTop: 20, alignItems: 'center' }}>
          <View style={{ flex: 0.35, justifyContent: 'center', marginTop: 5, marginBottom: 5 }}>
            <Text style={{ textAlign: 'center', flex: 1, paddingHorizontal: 15 }}>Your challenge is to walk <TextBold>{challengeDetail.distance}</TextBold> km to donate <TextBold>${challengeDetail.donation}</TextBold></Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={{ textAlign: 'center', flex: 1 }}>Donations from this challenge will go to <TextBold>{challengeDetail.charity_detail.name}</TextBold> who <TextBold>{challengeDetail.charity_detail.description}</TextBold></Text>
          </View>
          <View style={{ flex: 0.18, justifyContent: 'center' }}>
            <Text>Are you ready ?</Text>
          </View>
        </View>

        <View style={{ flex: 0.1, marginTop: 30, marginBottom: 20, flexDirection: 'row' }}>
          <Button onPress={() => navigation.goBack()} style={{ flex: 1, borderRadius: 30 }} contentStyle={{ height: 50 }}>
            Back
          </Button>
          <Button mode="contained" onPress={onPressStartChallenge} style={{ flex: 1, borderRadius: 30 }} contentStyle={{ height: 50 }}>
            {(currentChallenge != null && currentChallenge.challenge_detail._id === challengeDetail._id) ? 'Continue' : 'Start'}
          </Button>
        </View>

      </View>

    </DefaultView>
  )
}

const styles = StyleSheet.create({
  startChallengeBtn: {
    position: 'absolute',
    top: 3, right: 10,
    // backgroundColor: '#000'
  }
})

export default ChallengeWalkDetailInfoScreen
