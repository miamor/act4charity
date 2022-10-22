import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Appbar, Button, useTheme, IconButton, ProgressBar, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal, TextInput, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { DefaultView } from '../containers'
import { useGlobals } from '../../contexts/global'

import Loading from '../animations/loading'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import * as userAPI from '../../services/userAPI'
import { useNavigation } from '@react-navigation/core'

import ChallengeBarDiscoverTeam from './bar.team.discover'
import ChallengeBarWalkTeam from './bar.team.walk'


function ChallengeStartActionsTeam(props) {
  const [{ currentChallenge, loggedUser,
    currentLocation, currentRegion, trackLoc, trackStep,
    privateSockMsg, privateSockMsgs, socket,
    trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, membersJoinStatus, completedMembers, chatMessages, processedPrivateSockMsgs,
    started, completed, finished
  }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const { challenge_accepted_data } = props
  const challengeDetail = challenge_accepted_data.challenge_detail
  const challenge_accepted_id = challenge_accepted_data._id

  const room_id = challenge_accepted_id


  const [loading, setLoading] = useState(true)


  useEffect(() => {
    console.log('[actions.team.func] currentLocation', currentLocation, ' | completed =', completed)

    if (completed === 1) {
      onComplete()
    }
  }, [completed])


  /*
   * to display chat messages
   */
  const [messages, setMessages] = useState([])


  /*
   * My join status ?
   */
  const [joinStatus, setJoinStatus] = useState(false)



  /* ************************
   *
   * check if current user is host
   *
   * ************************/
  const [isHost, setIsHost] = useState(false)
  const hostJoin = () => {
    // console.log('[team.func] >>> membersJoinStatus', membersJoinStatus)
    if (loggedUser._id === challenge_accepted_data.user) {
      setIsHost(true)
      setJoinStatus(true)

      console.log('[team.func][hostJoin] >>> Im host. I joined')

      //? host joined for the first time
      socket.emit('cast_private', {
        room_id: room_id,
        action: 'join',
        user_id: loggedUser._id,
        username: loggedUser.username,
        data: loggedUser.username + ' joined'
      })
    }
  }

  /* ************************
   *
   * load all members and members status (accepted / declined / out)
   *
   * ************************/
  useEffect(() => {
    loadMembersStatus()
  }, [])

  const loadMembersStatus = () => {
    userAPI.getChallengeInvitations({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      // console.log('[team.func][loadMembersStatus] >>> membersJoinStatus', membersJoinStatus)

      let members_joins = { ...membersJoinStatus }
      res.data.forEach((invitation) => {
        // console.log('>> invitation', invitation)
        // members_joins[invitation.to_uid] = invitation.accept
        if (!isHost) {
          members_joins[invitation.to_uid] = invitation.accept
        }
      })

      console.log('[team.func][loadMembersStatus] (first fetch) members_joins', members_joins)
      onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)

      hostJoin()

      setLoading(false)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


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
  const [chatMessage, setChatMessage] = useState('')
  // const [trackMemberLocationStates, setTrackMemberLocationStates] = useState({})
  // const [trackMemberStepStates, setTrackMemberStepStates] = useState({})
  // const [trackMemberDistStates, setTrackMemberDistStates] = useState({})
  // const [completedMembers, setCompletedMembers] = useState([])
  // const [trackTeamTime, setTrackTeamTime] = useState(0)

  /* 
   * This function is triggered when the host started the challenge.
   * This function starts on each member's screen
   */
  const startNow = () => {
    onSetDispatch('setStarted', 'started', true)
  }

  /*
   * state to identify if everyone within the team completed the chalenge
   */
  const [teamCompleted, setTeamCompleted] = useState(0)


  /*
   * On update of trackLoc, send new loc to socket channel
   */
  useEffect(() => {
    console.log('[team.func] *** trackLoc', trackLoc)
    submitUserLocState(trackLoc)
  }, [trackLoc])

  /*
   * On update of trackStep, send new step to socket channel
   */
  useEffect(() => {
    submitUserStepState(trackStep)
  }, [trackStep])



  /* ************************
   *
   * Listen to new updates via socket channel (by checking dispatched variable privateSockMsgs)
   * 
   * -------
   * 
   * Update my screen when receiving new messages / states / ...
   *
   * ************************/
  useEffect(() => {
    // console.log('[team.func] privateSockMsgs', privateSockMsgs)

    // privateSockMsgs.forEach((res, i) => {
    //   // console.log('> res', res)
    const res = privateSockMsg
    if (true) {
      onSetDispatch('setProcessedPrivateSockMsgs', 'processedPrivateSockMsgs', processedPrivateSockMsgs + 1)

      if (res.action === 'start') {
        /*
         * host start 
         * ---
         * start tracking
         */
        _handleStart(res)
      }

      else if (res.action === 'join') {
        /*
         * someone accepted (joined)
         * ---
         * update membersJoinStatus
         */
        _handleJoin(res)
      }

      else if (res.action === 'decline') {
        /*
         * someone declined
         * ---
         * update membersJoinStatus
         */
        _handleDecline(res)
      }

      else if (res.action === 'out') {
        /*
         * someone out
         * ---
         * update membersJoinStatus
         */
        _handleOut(res)
      }

      else if (res.action === 'complete') {
        /*
         * someone complete
         * ---
         * update completeMembers
         */
        _handleComplete(res)
      }

      else if (res.action === 'kill') {
        /*
         * host kill (cancel team challenge and discard all records)
         * ---
         * 
         */
        _handleKill(res)
      }

      else if (res.action === 'end') {
        /*
         * host end the challenge (complete team challenge)
         * ---
         * end is equivalent to complete. 
         * The host can only end the challenge when at least 1 team member completes the challenge.
         * For challenges type `discover`:
         *   donation of team challenge = (donation * number of members completed the challenge) + (donation / 4 * (number of members in the team but not completed the challenge))
         * If all team members completed the challenge:
         *   donation of team challenge = donation * number of members * 1.5
         */
        _handleEnd(res)
      }

      else if (res.action === 'chat') {
        /*
         * someone send chat message
         */
        _handleChat(res)
      }

      else if (res.action === 'loc_state') {
        /*
         * receive location update
         */
        _handleLocState(res)
      }

      else if (res.action === 'step_state') {
        /*
         * receive step update
         */
        _handleStepState(res)
      }
    }
    // })
  }, [privateSockMsgs])

  /* ************************
   *
   * Handler for each message type 
   *
   * ************************/
  const _handleStart = useCallback((res) => {
    startNow()
  }, [])

  const _handleChat = useCallback((res) => {
    setMessages([...messages, res])
  }, [messages])

  const _handleJoin = useCallback((res) => {
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: 1,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    console.log('[someone joined] members_joins', members_joins)
  }, [membersJoinStatus])

  const _handleDecline = useCallback((res) => {
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: -1,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    console.log('[someone declined] members_joins', members_joins)
  }, [membersJoinStatus])

  const _handleOut = useCallback((res) => {
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: -2,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    console.log('[someone out] members_joins', members_joins)
  }, [membersJoinStatus])

  const _handleComplete = useCallback((res) => {
    onSetDispatch('setCompletedMembers', 'completedMembers', [...completedMembers, {
      user_id: res.user_id,
      username: res.username
    }])
  }, [completedMembers])

  const _handleKill = useCallback((res) => {
    onSetDispatch('setCompleted', 'completed', -1)

    // navigation.navigate('ChallengeWalkDetailInfo', { key: 'ChallengeWalkDetailInfo', challengeDetail: item })
    navigation.navigate('ChallengeStack', {
      screen: 'ChallengeDetailInfo',
      params: { key: 'ChallengeDetailInfo', challengeDetail: res.data }
    })
  }, [])

  const _handleEnd = useCallback((res) => {
    // onSetDispatch('setTeamCompleted', 'teamCompleted', 1)

    /* set completed = 3 to take screenshot within `Map` view */
    onSetDispatch('setCompleted', 'completed', 3)

    /* callback function to handle when the challenge is really completed */
    props.onFinished()
  }, [completed])

  const _handleLocState = useCallback((res) => {
    onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', {
      ...trackMemberLocationStates,
      [res.user_id]: res.data,
    })

    onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', {
      ...trackMemberDistStates,
      [res.user_id]: res.data.distanceTravelled,
    })
  }, [trackMemberLocationStates, trackMemberDistStates])

  const _handleStepState = useCallback((res) => {
    onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', {
      ...trackMemberStepStates,
      [res.user_id]: res.data.currentStepCount,
    })
  }, [trackMemberStepStates])





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
        socket.emit('cast_private', {
          room_id: room_id,
          action: 'join',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' joined'
        })

        setJoinStatus(1)
        // loadMembersStatus()

        setLoading(false)
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

        socket.emit('cast_private', {
          room_id: room_id,
          action: 'decline',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' declined'
        })

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
  const [showHostConfirmStartTeam, setShowHostConfirmStartTeam] = useState(false)
  const hideConfirmStartTeam = () => setShowHostConfirmStartTeam(false)
  const onPressStartTeam = () => {
    //? if totStt > 0 => at least one member accepted.
    const totStt = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0)
    if (totStt === 0) {
      setShowWarningCantStart(true)
    } else {
      setShowHostConfirmStartTeam(true)
    }
  }
  const onConfirmStartTeam = () => {
    setLoading(true)

    userAPI.startTeamChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
      console.log('[startTeamChallenge] res', res)

      socket.emit('cast_private', {
        room_id: room_id,
        action: 'start',
        user_id: loggedUser._id,
        username: loggedUser.username,
        data: 'Host started the challenge'
      })

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
    socket.emit('cast_private', {
      room_id: room_id,
      action: 'chat',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: chatMessage
    })
    setChatMessage('')
  }

  /* ************************
   *
   * Send user stats (loc states and steps state etc.)
   *
   * ************************/
  const submitUserLocState = (myTrackState) => {
    socket.emit('cast_private', {
      room_id: room_id,
      action: 'loc_state',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: myTrackState
    })
  }
  const submitUserStepState = (myTrackState) => {
    socket.emit('cast_private', {
      room_id: room_id,
      action: 'step_state',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: myTrackState
    })
  }


  /* ****************
   * 
   * Check if all members completed
   * 
   * ****************/
  const [showAnnounceTeamCompleted, setShowAnnounceTeamCompleted] = useState(false)
  const hideAnnounceTeamCompleted = () => setShowAnnounceTeamCompleted(false)
  useEffect(() => {
    if (membersJoinStatus != null) {
      const totMembers = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0) + 1
      if (completedMembers.length === totMembers) {
        setShowAnnounceTeamCompleted(true)
      }
    }
  }, [membersJoinStatus, completedMembers])



  /* **********************************************
   *
   * Complete ?!
   * ---
   * Individual completion !
   * When the system detects that the user completed the challenge,
   * show a button for the user to announce
   *
   * **********************************************/
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)
  const hideConfirmComplete = () => setShowConfirmComplete(false)
  const onComplete = () => {
    setLoading(true)
    setCompleted(1)
    setShowConfirmComplete(true)
  }
  const onConfirmComplete = () => {
    hideConfirmComplete()
  }


  /* **********************************************
   *
   * Complete the challenge for the whole team (end challenge)
   * 
   * ----
   * 
   * Only host can end the challenge.
   * end is equivalent to complete. 
   * The host can only end the challenge when at least 1 team member completes the challenge.
   * For challenges type `discover`:
   *   donation of team challenge = (donation * number of members completed the challenge) + (donation / 4 * (number of members in the team but not completed the challenge))
   * If all team members completed the challenge:
   *   donation of team challenge = donation * number of members * 1.5
   *
   * **********************************************/
  const [showHostConfirmEnd, setHostShowConfirmEnd] = useState(false)
  const hideHostConfirmEnd = () => setHostShowConfirmEnd(false)
  const onPressHostEndChallenge = () => {
    setHostShowConfirmEnd(true)
  }
  const onHostConfirmEnd = () => {
    if (isHost) { //? only host can perform this action
      setLoading(true)

      userAPI.completeChallenge({
        challenge_accepted_id: challenge_accepted_id,
        challenge_donation: challengeDetail.donation,
        challenge_reward: challengeDetail.reward,
        participants: challengeDetail.participants,
      }).then((res) => {
        console.log('[confirmCompleteCallback] res', res)

        socket.emit('cast_private', {
          room_id: room_id,
          action: 'end',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' ended this challenge',

          trackMemberLocationStates: trackMemberLocationStates,
          trackMemberStepStates: trackMemberStepStates,
          challenge_accepted_id: challenge_accepted_id,
        })
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }


  /* **********************************************
   *
   * A member logged out of this team challenge
   * 
   * ----
   * 
   * This user's participation or completion is not counted.
   *
   * **********************************************/
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const onPressCancelChallenge = () => {
    setShowConfirmCancel(true)
  }
  const hideConfirmCancel = () => setShowConfirmCancel(false)
  const onConfirmCancel = () => {
    setLoading(true)

    if (!isHost) {
      /*
       * When the user is not host
       * Simply out the challenge
       */
      userAPI.cancelInvitation({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('>> res', res)

        /* dispatch global states */
        onSetDispatch('setCompleted', 'completed', -1)

        /* cast to other members via socket channel */
        socket.emit('cast_private', {
          room_id: room_id,
          action: 'out',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' withdrawn from this challenge',
        })

        /* out this screen */
        navigation.navigate('ChallengeStack', { screen: 'ChallengeListMapDiscover' })

        /* done loading */
        setLoading(false)
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }


  /* **********************************************
   *
   * Host Cancel the challenge
   * 
   * ----
   * 
   * If the host cancel the challenge, nothing is counted. 
   * No donation will be made
   *
   * **********************************************/
  const [showHostConfirmCancel, setHostShowConfirmCancel] = useState(false)
  const onPressHostCancelChallenge = () => {
    setHostShowConfirmCancel(true)
  }
  const hideHostConfirmCancel = () => setHostShowConfirmCancel(false)
  const onHostConfirmCancel = () => {
    setLoading(true)

    if (isHost) {
      /*
       * When the user is host (host cancel)
       * Update in db and send states via socket
       * There will be a handler to handle receive end signals for everyone (including host)
       */
      userAPI.cancelChallenge({ challenge_accepted_id: challenge_accepted_id }).then((res) => {
        console.log('>> res', res)

        /* cast to other members via socket channel */
        socket.emit('cast_private', {
          room_id: room_id,
          action: 'kill',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: 'Host canceled this challenge',
        })

        /* done loading */
        setLoading(false)
      }).catch(error => {
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }




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
  const snapPoints = useMemo(() => [
    challengeDetail.type === 'discover' ? '13%' : '17%',
    '90%'], [])
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



  return (<>

    {props.showFull && loading && <Loading />}

    {props.showFull && (<BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
    >
      <BottomSheetScrollView contentContainerStyle={{}}>

        {challengeDetail.type === 'discover' ? <ChallengeBarDiscoverTeam challenge_accepted_data={challenge_accepted_data} />
          : <ChallengeBarWalkTeam challenge_accepted_data={challenge_accepted_data} />}


        {membersJoinStatus != null && challenge_accepted_data.participants_details.map((user, i) => {
          if (loggedUser._id !== user._id && !membersJoinStatus.hasOwnProperty(user._id)) return null
          return (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
            <Text>{user.username} ({user._id}) </Text>
            <Text>{loggedUser._id === user._id ? 1 : membersJoinStatus[user._id]}</Text>
          </View>)
        })}

        {joinStatus && (<View style={{ flexDirection: 'column' }}>
          <View style={{ flex: 0.4, backgroundColor: '#0f0' }}>
            {messages.map((res, i) => {
              if (res.data.length > 0) {
                return (<View key={`res-` + i} style={{ flexDirection: 'row' }}>
                  <TextBold>{res.username}</TextBold>
                  <Text style={{ borderWidth: 2 }}>{res.data}</Text>
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
              onChangeText={res => {
                setChatMessage(res)
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
    </BottomSheet>)}





    {showConfirmCancel && (<Portal>
      <Modal visible={showConfirmCancel} onDismiss={hideConfirmCancel} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
        <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure to cancel?</H3>

        <Paragraph>
          If you leave this challenge, your participation or completion will not be counted.
        </Paragraph>

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
        <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Well done!</H3>

        <Paragraph>
          You've completed this challenge.
        </Paragraph>
        <Paragraph>
          Now let's wait for other members.
        </Paragraph>
        <Paragraph>
          This challenge will end when the host ends the challenge.
        </Paragraph>

        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onConfirmComplete}>I got it</Button>
        </View>
      </Modal>
    </Portal>)}



    {isHost && (<>

      {showHostConfirmCancel && (<Portal>
        <Modal visible={showHostConfirmCancel} onDismiss={hideHostConfirmCancel} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure to cancel?</H3>

          <Paragraph>
            Since you're the host, this will also cancel for other members.
          </Paragraph>

          <Paragraph>
            This cannot be undone.
          </Paragraph>
          <Paragraph>
            Are you sure?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onHostConfirmCancel}>Yes, cancel</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideHostConfirmCancel}>No, continue</Button>
          </View>
        </Modal>
      </Portal>)}

      {showAnnounceTeamCompleted && (<Portal>
        <Modal visible={showAnnounceTeamCompleted} onDismiss={hideAnnounceTeamCompleted} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Everyone completed !</H3>

          <Paragraph>
            Hey, all <TextBold>{completedMembers.length}</TextBold> completed the challenge !
          </Paragraph>

          <Paragraph>
            Do you want to end the challenge now ?
          </Paragraph>
          <Paragraph>
            Total donation will be: XXX
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onHostConfirmEnd}>Complete for everyone</Button>
          </View>
        </Modal>
      </Portal>)}

      {showHostConfirmEnd && (<Portal>
        <Modal visible={showHostConfirmEnd} onDismiss={hideHostConfirmEnd} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure?</H3>

          <Paragraph>
            <TextBold>{completedMembers.length}</TextBold> completed the challenge.
          </Paragraph>

          <Paragraph>
            If you end the challenge, total donation will be: XXX
          </Paragraph>
          <Paragraph>
            Are you sure?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onHostConfirmEnd}>Yes, cancel</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideHostConfirmEnd}>No, continue</Button>
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

      {showHostConfirmStartTeam && (<Portal>
        <Modal visible={showHostConfirmStartTeam} onDismiss={hideConfirmStartTeam} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Start now?</H3>

          <Paragraph>
            Starting a challenge will prevent others accept invitation to join.
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onConfirmStartTeam}>Yes, start now</Button>
            <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmStartTeam}>Wait more</Button>
          </View>
        </Modal>
      </Portal>)}

    </>)}


    {props.showFull && (<View style={{
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
      {isHost && !started && (<Button mode="contained" onPress={onPressStartTeam} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="close" size={14} />
        Start now
      </Button>)}

      {isHost && started && (<Button mode="contained" onPress={onPressHostCancelChallenge} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="close" size={14} />
        Cancel Challenge
      </Button>)}

      {!isHost && (<Button mode="contained" onPress={onPressCancelChallenge} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="close" size={14} />
        Out Challenge
      </Button>)}

    </View>)}


  </>)
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default ChallengeStartActionsTeam