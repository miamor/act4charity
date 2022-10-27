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

import Storer from '../../utils/storer'
import ChallengeBarTeam from './bar.team'
import axios from 'axios'
import TakePicture from './take-picture'
import { REACT_APP_API_URL } from '../../services/APIServices'


function ChallengeStartActionsTeam(props) {
  const [{ currentChallenge, loggedUser,
    currentLocation, currentRegion, trackLoc, trackStep,
    socket, privateSockMsg, privateSockMsgs, trackMemberStartStates, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, membersJoinStatus, completedMembers, chatMessages, processedPrivateSockMsgs,
    started, completed, joined
  }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const [loading, setLoading] = useState(true)


  // useEffect(() => {
  //   console.log('['+loggedUser.username+'] [actions.team] currentChallenge.participants >>>', currentChallenge.participants)
  // }, [])


  const [token, setToken] = useState()
  useEffect(() => {
    (async () => {
      if (token == null) {
        const _token = await Storer.get('token')
        setToken(_token)
      }
    })()
  }, [token])


  useEffect(() => {
    //console.log('['+loggedUser.username+'] [actions.team.func] currentLocation', currentLocation, ' | completed =', completed)

    if (completed === 1) {
      onComplete()
    }
  }, [completed])


  /*
   * to display chat messages
   */
  const [messages, setMessages] = useState([])
  useEffect(() => {
    /*
     * Host joined first so there will be no messages before.
     * Load messages is only for members when they join.
     */
    if (joined === currentChallenge._id) {
      listChat()
    }
  }, [joined])

  const [sentFirstLoc, setSentFirstLoc] = useState(false)
  useEffect(() => {
    if (joined === currentChallenge._id) {
      /* send position to socket channel */
      if (currentLocation != null && sentFirstLoc === false) {
        submitUserStartState(currentLocation)
        setSentFirstLoc(true)
      }
    }
  }, [joined, currentLocation])


  /* ************************
   *
   * check if current user is host
   *
   * ************************/
  const [isHost, setIsHost] = useState(false)
  const hostJoin = async () => {
    console.log('[' + loggedUser.username + '] [actions.team] hostJoin CALLED')
    // //console.log('['+loggedUser.username+'] [team.func] >>> membersJoinStatus', membersJoinStatus)

    if (joined !== currentChallenge._id) {
      /* dispatch and store so that not join again */
      onSetDispatch('setJoined', 'joined', currentChallenge._id)
      await Storer.set('joined', currentChallenge._id)

      console.log('[' + loggedUser.username + '] [actions.team][hostJoin] >>> Im host. I joined')

      // loadMembersStatus()

      //? host joined for the first time
      const msg = {
        room_id: currentChallenge._id,
        action: 'join',
        user_id: loggedUser._id,
        username: loggedUser.username,
        data: loggedUser.username + ' joined'
      }
      socket.emit('cast_private', msg)
      // _handleJoin(msg) //? no need
    }
  }

  /* ************************
   *
   * load all members and members status (accepted / declined / out)
   *
   * ************************/
  useEffect(() => {
    if (loggedUser._id === currentChallenge.user) {
      setIsHost(true)
    }
  }, [])
  const [loadedMembersStatus, setLoadedMembersStatus] = useState(false)
  useEffect(() => {
    if (currentChallenge != null && loadedMembersStatus === false) {
      loadMembersStatus()
      setLoadedMembersStatus(true)
    }
  }, [currentChallenge, started, joined])

  // useEffect(() => {
  //   console.log('['+loggedUser.username+'] [actions.team] ~~~ membersJoinStatus', membersJoinStatus)
  //   console.log('['+loggedUser.username+'] [actions.team] currentChallenge.participants_details', currentChallenge.participants_details)
  // }, [membersJoinStatus])

  const loadMembersStatus = () => {
    console.log('[' + loggedUser.username + '] [actions.team][loadMembersStatus] CALLED ~~~')

    userAPI.getChallengeInvitations({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      console.log('[' + loggedUser.username + '] [actions.team][loadMembersStatus] (getChallengeInvitations) >>> membersJoinStatus', membersJoinStatus)

      let members_joins = { ...membersJoinStatus }
      res.data.forEach((invitation) => {
        // //console.log('['+loggedUser.username+'] >> invitation', invitation)
        // members_joins[invitation.to_uid] = invitation.accept
        if (invitation.to_uid !== currentChallenge.user) { //? not host
          members_joins[invitation.to_uid] = invitation.accept
        }
      })
      members_joins[currentChallenge.user] = 1

      // console.log('['+loggedUser.username+'] [actions.team][loadMembersStatus] (first fetch) members_joins', members_joins)
      onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)

      // console.log('['+loggedUser.username+'] [actions.team][loadMembersStatus] currentChallenge.participants_details', currentChallenge.participants_details)

      if (loggedUser._id === currentChallenge.user && joined !== currentChallenge._id) {
        hostJoin()
      }

      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
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
  const startNow = async () => {
    console.log('[' + loggedUser.username + '] [actions.team][startNow] CALLED')

    await Storer.set('started', true)
    onSetDispatch('setStarted', 'started', true)

    await Storer.set('completed', 0)
    onSetDispatch('setCompleted', 'completed', 0)

    const dt = (currentChallenge.time_started != null) ? new Date(currentChallenge.time_started) : new Date()
    // console.log('['+loggedUser.username+'] [mapview] startTime == ', dt)
    Storer.set('startTime', dt)
    onSetDispatch('setStartTime', 'startTime', dt)
  }

  useEffect(() => {
    if (currentChallenge.time_started != null && currentChallenge.time_started.length > 0 && !started) {
      startNow()
    }
  }, [])

  /*
   * state to identify if everyone within the team completed the chalenge
   */
  const [teamCompleted, setTeamCompleted] = useState(0)


  //! update by change send too much data. 
  // /*
  //  * On update of trackLoc, send new loc to socket channel
  //  */
  // useEffect(() => {
  //   if (started && joined) {
  //     //console.log('['+loggedUser.username+'] [team.func] *** trackLoc', trackLoc)
  //     submitUserLocState(trackLoc)
  //   }
  // }, [trackLoc])

  // /*
  //  * On update of trackStep, send new step to socket channel
  //  */
  // useEffect(() => {
  //   if (started && joined) {
  //     submitUserStepState(trackStep)
  //   }
  // }, [trackStep])
  //! send by interval (every 5 sec) instead
  // const [isIntSet, setIsIntSet] = useState(false)
  // useEffect(() => {
  //   if (isIntSet === false) {
  //     setIsIntSet(true)
  //     const interval = setInterval(() => {
  //       if (started && joined === currentChallenge._id) {
  //         submitUserLocState(trackLoc)
  //         submitUserStepState(trackStep)
  //       }
  //     }, 5000) //? update every 5 sec
  //   }

  //   /* cleanup the interval on complete */
  //   return () => clearInterval(interval)
  // }, [started, joined])



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
    console.log('[' + loggedUser.username + '] [team.func] >>>>>>>>>> privateSockMsg ', privateSockMsg)

    // privateSockMsgs.forEach((res, i) => {
    //   // //console.log('['+loggedUser.username+'] > res', res)
    if (privateSockMsg != null && privateSockMsg.user_id !== loggedUser._id) {
      const res = privateSockMsg
      // onSetDispatch('setPrivateSockMsg', 'privateSockMsg', null)
      // onSetDispatch('setProcessedPrivateSockMsgs', 'processedPrivateSockMsgs', processedPrivateSockMsgs + 1)

      /*
       * //! for signals other than chat, add to messages just for debug
       * for action `chat`, `_handleChat` already append data to messages so no need.
       */
      if (res.action !== 'chat') {
        _handleChat(res)
      }


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

      else if (res.action === 'start_state') {
        /*
         * receive first position of a member
         */
        _handleStartState(res)
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
  }, [privateSockMsg])

  /* ************************
   *
   * Handler for each message type 
   *
   * ************************/
  const _handleStart = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleStart] CALLED')
    startNow()
  }//, [])

  const _handleChat = (res) => {
    // setLoading(false)
    setMessages([...messages, res])
  }//, [messages])

  const _handleJoin = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleJoin] CALLED')
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: 1,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    //console.log('['+loggedUser.username+'] [someone joined] members_joins', members_joins)
  }//, [membersJoinStatus])

  const _handleDecline = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleDecline] CALLED')
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: -1,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    //console.log('['+loggedUser.username+'] [someone declined] members_joins', members_joins)
  }//, [membersJoinStatus])

  const _handleOut = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleOut] CALLED')
    let members_joins = {
      ...membersJoinStatus,
      [res.user_id]: -2,
    }
    onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
    //console.log('['+loggedUser.username+'] [someone out] members_joins', members_joins)
  }//, [membersJoinStatus])

  const _handleComplete = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleComplete] CALLED')
    onSetDispatch('setCompletedMembers', 'completedMembers', [...completedMembers, {
      user_id: res.user_id,
      username: res.username
    }])
  }//, [completedMembers])

  const _handleKill = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleKill] CALLED')
    onSetDispatch('setCompleted', 'completed', -1)
  }//, [])

  const _handleEnd = async (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleEnd] CALLED')
    // onSetDispatch('setTeamCompleted', 'teamCompleted', 1)

    /* to display in the completed screen */
    onSetDispatch('setDonation', 'donation', [res.donation_amount, res.reward_amount])

    /* update `current_donation` & `current_reward` */
    const newUserData = {
      ...loggedUser,
      current_donation: loggedUser.current_donation + res.donation_amount,
      current_reward: loggedUser.current_reward + res.reward_amount
    }
    await Storer.set('loggedUser', newUserData)
    onSetDispatch('setLoggedUser', 'loggedUser', newUserData)

    /* set completed = 3 to take screenshot within `Map` view */
    onSetDispatch('setCompleted', 'completed', 3)

  }//, [completed])

  const _handleStartState = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleStartState] CALLED')
    onSetDispatch('setTrackMemberStartStates', 'trackMemberStartStates', {
      ...trackMemberStartStates,
      [res.user_id]: res.data,
    })
  }//, [trackMemberStartStates])

  const _handleLocState = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleLocState] CALLED')
    onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', {
      ...trackMemberLocationStates,
      [res.user_id]: res.data,
    })

    onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', {
      ...trackMemberDistStates,
      [res.user_id]: res.data.distanceTravelled,
    })
  }//, [trackMemberLocationStates, trackMemberDistStates])

  const _handleStepState = (res) => {
    console.log('[' + loggedUser.username + '] [actions.team][_handleStepState] CALLED')
    onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', {
      ...trackMemberStepStates,
      [res.user_id]: res.data.currentStepCount,
    })
  }//, [trackMemberStepStates])



  /* ************************
   *
   * List chat messages
   *
   * ************************/
  const listChat = () => {
    console.log('[' + loggedUser.username + '] [actions.team][listChat] CALLED')
    userAPI.listChat({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      // console.log('['+loggedUser.username+'] [actions.team][listChat] res', res)

      setMessages(res.data)

      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }



  /* ************************
   *
   * User must click `Join` to accept the invitation and join the challenge
   *
   * ************************/
  const onJoin = () => {
    setLoading(true)

    //? update db. only when current user is not host
    // if (loggedUser._id !== currentChallenge.user && currentChallenge.participants.includes(loggedUser._id) && membersJoinStatus[loggedUser._id] === 0) {
    if (loggedUser._id !== currentChallenge.user && currentChallenge.participants.includes(loggedUser._id) && (!membersJoinStatus.hasOwnProperty(loggedUser._id) || membersJoinStatus[loggedUser._id] === 0)) {

      /*
       * Update invitation accept status db 
       */
      userAPI.acceptInvitation({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        // console.log('['+loggedUser.username+'] [acceptInvitation] res', res)

        console.log('[' + loggedUser.username + '] [actions.team][onJoin] joined !!')

        if (res) {
          /* dispatch and store so that not join again */
          onSetDispatch('setJoined', 'joined', currentChallenge._id)
          Storer.set('joined', currentChallenge._id)

          /*
           * join the room 
           */
          const msg = {
            room_id: currentChallenge._id,
            action: 'join',
            user_id: loggedUser._id,
            username: loggedUser.username,
            data: loggedUser.username + ' joined'
          }
          socket.emit('cast_private', msg)
          _handleJoin(msg)

          listChat()

          // loadMembersStatus() //! use socket to update

          /* done loading */
          setLoading(false)
        } else {
          setLoading(false)
        }
      }).catch(error => {
        setLoading(false)
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })

    } else { //? or else, just join the chat ? well, no need to rejoin
      // socket.emit('join', { room_id: currentChallenge._id, user_id: loggedUser._id, username: loggedUser.username, data: loggedUser.username + ' joined' })

      onSetDispatch('setJoined', 'joined', currentChallenge._id)
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
    // console.log('['+loggedUser.username+'] [actions.team] loggedUser._id !== currentChallenge.user', loggedUser._id !== currentChallenge.user)
    // console.log('['+loggedUser.username+'] [actions.team] currentChallenge.participants.includes(loggedUser._id)', currentChallenge.participants.includes(loggedUser._id))
    // console.log('['+loggedUser.username+'] [actions.team] (!membersJoinStatus.hasOwnProperty(loggedUser._id) || membersJoinStatus[loggedUser._id] === 0)', (!membersJoinStatus.hasOwnProperty(loggedUser._id) || membersJoinStatus[loggedUser._id] === 0))

    if (loggedUser._id !== currentChallenge.user && currentChallenge.participants.includes(loggedUser._id) && (!membersJoinStatus.hasOwnProperty(loggedUser._id) || membersJoinStatus[loggedUser._id] === 0)) {

      /*
       * Update invitation accept status db 
       */
      // console.log('['+loggedUser.username+'] [actions.team] making request declineInvitation ', { challenge_accepted_id: currentChallenge._id })
      userAPI.declineInvitation({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        // console.log('['+loggedUser.username+'] [declineInvitation] res', res)

        console.log('[' + loggedUser.username + '] [actions.team][onDecline] declined')

        const msg = {
          room_id: currentChallenge._id,
          action: 'decline',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' declined'
        }
        socket.emit('cast_private', msg)
        // _handleDecline(res) //? no need

        onSetDispatch('setCompleted', 'completed', -1)

        /* done loading */
        setLoading(false)

        // navigation.goBack()
      }).catch(error => {
        setLoading(false)
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
    // console.log('['+loggedUser.username+'] [actions.team][onPressStartTeam] membersJoinStatus', membersJoinStatus)

    const totStt = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0)
    if (totStt <= 1) { //! change to 1
      setShowWarningCantStart(true)
    } else {
      setShowHostConfirmStartTeam(true)
    }
  }
  const onConfirmStartTeam = () => {
    setLoading(true)
    hideConfirmStartTeam()

    userAPI.startTeamChallenge({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      //console.log('['+loggedUser.username+'] [startTeamChallenge] res', res)

      const msg = {
        room_id: currentChallenge._id,
        action: 'start',
        user_id: loggedUser._id,
        username: loggedUser.username,
        data: 'Host started the challenge'
      }
      socket.emit('cast_private', msg)
      _handleStart(msg)

      /* done loading */
      setLoading(false)
    }).catch(error => {
      setLoading(false)
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
    if (chatMessage && chatMessage.length > 0) {
      // setLoading(true)
      //console.log('['+loggedUser.username+'] [submitChatMessage] CALLED', chatMessage)

      const msg = {
        room_id: currentChallenge._id,
        action: 'chat',
        user_id: loggedUser._id,
        username: loggedUser.username,
        data: chatMessage
      }
      setChatMessage('')
      socket.emit('cast_private', msg)
      _handleChat(msg)

      /* add to db */
      userAPI.sendChat({
        challenge_id: currentChallenge.challenge_detail._id,
        challenge_accepted_id: currentChallenge._id,
        content: chatMessage,
      }).then((res) => {
        // console.log('['+loggedUser.username+'] res')
      }).catch(error => {
        console.error(error)
        // ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }

  /* ************************
   *
   * Send user stats (loc states and steps state etc.)
   *
   * ************************/
  const submitUserStartState = (myTrackState) => {
    const msg = {
      room_id: currentChallenge._id,
      action: 'start_state',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: myTrackState
    }
    socket.emit('cast_private', msg)
    _handleStartState(msg)
  }
  const submitUserLocState = (myTrackState) => {
    const msg = {
      room_id: currentChallenge._id,
      action: 'loc_state',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: myTrackState
    }
    socket.emit('cast_private', msg)
    _handleLocState(msg)
  }
  const submitUserStepState = (myTrackState) => {
    const msg = {
      room_id: currentChallenge._id,
      action: 'step_state',
      user_id: loggedUser._id,
      username: loggedUser.username,
      data: myTrackState
    }
    socket.emit('cast_private', msg)
    _handleStepState(msg)
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
      if (totMembers > 0 && completedMembers.length === totMembers) {
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
   * ---
   * For walk challenge, when this is triggered, it means the challenge is completed.
   * As for walk challenge, the distance walked is computed by summing everyone's distance walked.
   *
   * **********************************************/
  const [showConfirmComplete, setShowConfirmComplete] = useState(false)
  const hideConfirmComplete = () => {
    setShowConfirmComplete(false)
    onSetDispatch('setCompleted', 'completed', 1.5)
  }
  const onComplete = () => {
    // setLoading(true)
    // setCompleted(1)
    onSetDispatch('setCompleted', 'completed', 1)
    setShowConfirmComplete(true)
  }
  const onConfirmComplete = () => {
    hideConfirmComplete()
  }
  const onHostPressEnd = () => {
    hideConfirmComplete()
    // setLoading(false)
    onPressHostEndChallenge()
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
   *   donation of team challenge = (donation * number of members completed the challenge) + (donation / 5 * (number of members in the team but not completed the challenge))
   * If all team members completed the challenge:
   *   donation of team challenge = donation * number of members * 1.5
   * 
   * Same for reward
   *
   * **********************************************/
  const [showHostConfirmEnd, setHostShowConfirmEnd] = useState(false)
  const hideHostConfirmEnd = () => setHostShowConfirmEnd(false)
  const [donationAmount, setDonationAmount] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)
  const onPressHostEndChallenge = () => {
    setHostShowConfirmEnd(true)

    /*
     * How many members completed ?
     */
    let donation_amount = 0
    let reward_amount = 0
    const totMembers = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0) + 1
    if (totMembers === 1) { //? like individual mode
      /* 
       * only one member left in the team and this person completed
       */
      donation_amount = currentChallenge.challenge_detail.donation
      reward_amount = currentChallenge.challenge_detail.reward
    }
    else if (totMembers > 1 && (completedMembers.length === totMembers || currentChallenge.challenge_detail.type === 'walk')) {
      /* 
       * all members completed.
       * donations = donation * number of members * 1.5
       */
      donation_amount = currentChallenge.challenge_detail.donation * totMembers * 1.5
      reward_amount = currentChallenge.challenge_detail.reward * totMembers * 1.5
    }
    else if (completedMembers.length > 0) {
      /*
       * else,
       * donations = donation * number of members completed the challenge 
       *           + donation / 5 * nnumber of members in the team but not completed
       */
      donation_amount = currentChallenge.challenge_detail.donation * completedMembers.length + (currentChallenge.challenge_detail.donation / 5) * (totMembers - completedMembers.length)
      reward_amount = currentChallenge.challenge_detail.reward * completedMembers.length + (currentChallenge.challenge_detail.reward / 5) * (totMembers - completedMembers.length)
    }

    setDonationAmount(donation_amount)
    setRewardAmount(reward_amount)
  }
  const onHostConfirmEnd = () => {
    if (isHost) { //? only host can perform this action
      setLoading(true)
      hideHostConfirmEnd()

      /*
       * Complete challenge. State reward & donations made
       */
      userAPI.completeChallenge({
        challenge_accepted_id: currentChallenge._id,
        challenge_donation: donationAmount,
        challenge_reward: rewardAmount,
        participants: currentChallenge.participants,
      }).then((res) => {
        //console.log('['+loggedUser.username+'] [confirmCompleteCallback] res', res)

        const msg = {
          room_id: currentChallenge._id,
          action: 'end',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' ended this challenge',

          trackMemberStartStates: trackMemberStartStates,
          trackMemberLocationStates: trackMemberLocationStates,
          trackMemberStepStates: trackMemberStepStates,
          challenge_accepted_id: currentChallenge._id,

          donation_amount: donationAmount,
          reward_amount: rewardAmount,
        }
        socket.emit('cast_private', msg)
        _handleEnd(msg)
      }).catch(error => {
        setLoading(false)
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
    hideConfirmCancel()

    if (!isHost) {
      /*
       * When the user is not host
       * Simply out the challenge
       */
      userAPI.cancelInvitation({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        //console.log('['+loggedUser.username+'] >> res', res)

        /* dispatch global states */
        onSetDispatch('setCompleted', 'completed', -1)

        /* cast to other members via socket channel */
        const msg = {
          room_id: currentChallenge._id,
          action: 'out',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: loggedUser.username + ' withdrawn from this challenge',
        }
        socket.emit('cast_private', msg)
        // _handleOut(msg) //? no need

        // /* out this screen */
        // navigation.navigate('ChallengeStack', { screen: 'ChallengeListMapDiscover' })

        /* done loading */
        setLoading(false)
      }).catch(error => {
        setLoading(false)
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
    hideHostConfirmCancel()

    if (isHost) {
      /*
       * When the user is host (host cancel)
       * Update in db and send states via socket
       * There will be a handler to handle receive end signals for everyone (including host)
       */
      userAPI.cancelChallenge({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        // console.log('['+loggedUser.username+'] [actions.team][onHostConfirmCancel] (cancelChallenge) >> res', res)

        /* cast to other members via socket channel */
        const msg = {
          room_id: currentChallenge._id,
          action: 'kill',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: 'Host canceled this challenge',
        }
        socket.emit('cast_private', msg)
        _handleKill(msg)

        /* done loading */
        setLoading(false)
      }).catch(error => {
        setLoading(false)
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }




  /* **********************************************
   *
   * Take picture and send via socket channel
   *
   * **********************************************/
  const [showAskImgSource, setShowAskImgSource] = useState(true)
  const hideAskImgSource = useCallback(() => setShowAskImgSource(false))

  const [showShareStoryModal, setShowShareStoryModal] = useState(false)
  const callbackSubmitShareStory = (postData) => {
    // setLoading(true)
    // const accessToken = await Storer.get('token')
    // console.log('['+loggedUser.username+'] postData', JSON.stringify(postData))
    // console.log('['+loggedUser.username+'] accessToken', accessToken)

    if (token != null) {
      setLoading(true)

      postData.append('challenge_accepted_id', currentChallenge._id)
      postData.append('challenge_id', currentChallenge.challenge_detail._id)
      postData.append('public', false)

      // //console.log('['+loggedUser.username+'] >>> accessToken =', accessToken)
      // //console.log('['+loggedUser.username+'] >>> ', REACT_APP_API_URL + '/user/challenges/share_story')
      // //console.log('['+loggedUser.username+'] >>> postData =', JSON.stringify(postData))

      axios({
        method: 'POST',
        url: REACT_APP_API_URL + '/user/challenges/share_story',
        data: postData,
        headers: {
          'Authorization': token,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        const res = response.data
        // console.log('['+loggedUser.username+'] [actions.team][shareStory] res =', res)

        setShowShareStoryModal(false)

        /* cast to other members via socket channel */
        const msg = {
          room_id: currentChallenge._id,
          action: 'chat',
          user_id: loggedUser._id,
          username: loggedUser.username,
          data: res.data.content,
          picture: res.data.picture
        }
        socket.emit('cast_private', msg)
        _handleChat(msg)

        setLoading(false)
      }).catch(error => {
        setLoading(false)
        console.error(error)
        ToastAndroid.show('Oops!', ToastAndroid.SHORT)
      })
    }
  }

  const onOpenShareStory = useCallback((postData) => {
    setShowAskImgSource(true)
    setShowShareStoryModal(true)
  }, [])

  const onCloseShareStory = useCallback((postData) => {
    setShowShareStoryModal(false)
  }, [])




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
    // currentChallenge.challenge_detail.type === 'discover' ? '13%' : '17%',
    // currentChallenge.challenge_detail.type === 'walk' ? '22%' : '17%',
    currentChallenge.challenge_detail.type === 'walk' ? 170 : 140,
    '90%'
  ], [])
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
  const imageWidth = dimensions.width - 180


  /* **********************************************
   *
   * Tab view
   *
   * **********************************************/
  const [tabIndex, setTabIndex] = useState(0)
  const [onFocus, setOnFocus] = useState(false)



  return (<>

    {props.showFull && loading && <Loading />}

    {props.showFull && (<BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
    >

      <View style={{
        // flex: 0.18,
        height: currentChallenge.challenge_detail.type === 'walk' ? 130 : 100,
        // backgroundColor: '#00f',
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, flexDirection: 'column', marginBottom: 10
      }}>
        <ChallengeBarTeam />
      </View>



      <View style={{ flexDirection: 'row', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={() => setTabIndex(0)}
          style={{
            // backgroundColor: '#00f',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderBottomColor: tabIndex === 0 ? colors.primary : 'transparent',
          }}>
          <Text style={[tabIndex === 0 && { color: colors.primary, fontWeight: 'bold' }]}>
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTabIndex(1)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderBottomColor: tabIndex === 1 ? colors.primary : 'transparent',
          }}>
          <Text style={[tabIndex === 1 && { color: colors.primary, fontWeight: 'bold' }]}>
            Members
          </Text>
        </TouchableOpacity>
      </View>


      <View style={{ flex: 1 }}>
        {tabIndex === 0 ? (<>
          {joined === currentChallenge._id ? (<View style={{ flexDirection: 'column', flex: 1, paddingTop: 10 }}>
            <View style={{ flex: 1 }}>
              <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, }}>
                {messages.map((res, i) => {
                  if ((res.data != null && res.data.length > 0) || (res.picture != null && res.picture.length > 0) || (res.content != null && res.content.length > 0)) {
                    return (<View key={`res-` + i} style={{ flexDirection: 'row', marginVertical: 6 }}>
                      <TextBold style={{ marginRight: 10, lineHeight: 24 }}>
                        {res.data != null ? res.username : res.user_detail.username}
                      </TextBold>
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ lineHeight: 24 }}>
                          {res.data != null ? res.data : res.content}
                        </Text>
                        {res.picture != null && <Image source={{ uri: res.picture }} style={{ marginTop: 5, height: imageHeight, width: imageWidth }} />}
                      </View>
                    </View>)
                  }
                })}
              </BottomSheetScrollView>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 5, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: '#eee' }}>
              <IconButton style={{ alignSelf: 'center' }} icon="camera" size={40} onPress={onOpenShareStory} />
              <TextInput
                style={{ flex: 1 }} //, height: 30, borderWidth: 2 }}
                autoCorrect={false}
                value={chatMessage}
                onSubmitEditing={() => submitChatMessage()}
                onChangeText={res => setChatMessage(res)}
              // onFocus={() => setOnFocus(true)}
              />
              <View style={{ alignSelf: 'center', paddingLeft: 10 }}>
                <Button mode="contained" onPress={submitChatMessage}>
                  Send
                </Button>
              </View>
            </View>
          </View>) : (<Text style={{ paddingHorizontal: 30, paddingTop: 10 }}>You need to join to see the messages</Text>)}
        </>)
          : (<></>)}


        {tabIndex === 1 ? (<View style={{ paddingHorizontal: 30, paddingTop: 10 }}>
          {membersJoinStatus != null && currentChallenge.participants_details != null && currentChallenge.participants_details.map((user, i) => {
            if (loggedUser._id !== user._id && !membersJoinStatus.hasOwnProperty(user._id)) return null
            return (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
              <Text>{user.username}</Text>
              <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
                {/* {loggedUser._id === user._id ? 1 : membersJoinStatus[user._id]} */}
                {user._id === currentChallenge.user ? 'Host'
                  : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === 1 ? 'Joined'
                    : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === -1 ? 'Declined'
                      : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === 0 ? 'Pending'
                        : ''}
              </Text>
            </View>)
          })}
        </View>)
          : (<></>)}


      </View>

    </BottomSheet>)}



    {joined === currentChallenge._id && showShareStoryModal && (<View style={{ zIndex: 12, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <TakePicture showAskImgSource={showAskImgSource} hideAskImgSource={hideAskImgSource} onCloseShareStory={onCloseShareStory} callbackSubmitShareStory={callbackSubmitShareStory} />
    </View>)}




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


    {!isHost && showConfirmComplete && (<Portal>
      <Modal visible={showConfirmComplete} onDismiss={hideConfirmComplete} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
        <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Well done!</H3>

        {currentChallenge.challenge_detail.type === 'discover' ? (<>
          <Paragraph>
            You've completed this challenge!
          </Paragraph>
          <Paragraph>
            Now let's wait for other members.
          </Paragraph>
        </>)
          : (<>
            <Paragraph>
              Seems like your team completed the challenge!
            </Paragraph>
          </>)}

        <Paragraph>
          This challenge will end when the host ends the challenge.
        </Paragraph>

        <View style={{ marginTop: 30, marginHorizontal: 20 }}>
          <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmComplete}>I got it</Button>
        </View>
      </Modal>
    </Portal>)}


    {isHost && showConfirmComplete && (<Portal>
      <Modal visible={showConfirmComplete} onDismiss={hideConfirmComplete} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
        <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Well done!</H3>

        {currentChallenge.challenge_detail.type === 'discover' ? (<>
          <Paragraph>
            You've completed this challenge!
          </Paragraph>
          <Paragraph>
            Now let's wait for other members.
          </Paragraph>
        </>)
          : (<>
            <Paragraph>
              Seems like your team completed the challenge!
            </Paragraph>
          </>)}

        <Paragraph>
          You're the host. Do you want to end the challenge now?
        </Paragraph>

        <View style={{ marginTop: 30, marginHorizontal: 5, flexDirection: 'row' }}>
          <Button mode="text" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={hideConfirmComplete}>No, wait more</Button>
          <Button mode="contained" labelStyle={{ paddingHorizontal: 5, paddingBottom: 1, lineHeight: 20 }} onPress={onHostPressEnd}>Ok, end now</Button>
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

          {currentChallenge.challenge_detail.type === 'discover' && (<Paragraph>
            Hey, all <TextBold>{completedMembers.length}</TextBold> members completed the challenge !
          </Paragraph>)}

          <Paragraph>
            Do you want to end the challenge now ?
          </Paragraph>
          <Paragraph>
            Total donation will be: <TextBold>{donationAmount > 0 ? donationAmount : 'XXX'}</TextBold>
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onHostConfirmEnd}>Complete for everyone</Button>
          </View>
        </Modal>
      </Portal>)}

      {showHostConfirmEnd && (<Portal>
        <Modal visible={showHostConfirmEnd} onDismiss={hideHostConfirmEnd} contentContainerStyle={{ zIndex: 1000, backgroundColor: '#fff', padding: 20, marginHorizontal: 20 }}>
          <H3 style={{ marginBottom: 18, paddingBottom: 12, borderBottomColor: '#f0f0f0', borderBottomWidth: 1 }}>Are you sure?</H3>

          {currentChallenge.challenge_detail.type === 'discover' && (<Paragraph>
            <TextBold>{completedMembers.length}</TextBold> members completed the challenge.
          </Paragraph>)}

          <Paragraph>
            If you end the challenge, total donation will be: <TextBold>{donationAmount > 0 ? donationAmount : 'XXX'}</TextBold>
          </Paragraph>
          <Paragraph>
            Are you sure?
          </Paragraph>

          <View style={{ marginTop: 30, marginHorizontal: 20 }}>
            <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onHostConfirmEnd}>Yes, end the challenge</Button>
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


    {!loading && props.showFull && (<View style={{
      position: 'absolute', zIndex: 2,
      // bottom: currentSnapPoint === 0 ? dimensions.height * 0.15 - 55 : currentSnapPoint === 1 ? dimensions.height * 0.5 - 55 : dimensions.height * 0.9 - 55,
      // bottom: currentSnapPoint === 0 ? (dimensions.height - 65) * 0.15 - 10 : currentSnapPoint === 1 ? (dimensions.height - 65) * 0.9 - 10 : 0,
      top: 20,
      left: 15,
      right: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {isHost && !started && (<Button mode="contained" onPress={onPressStartTeam} style={{ marginHorizontal: 5 }} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="clock" size={14} />
        Start now
      </Button>)}

      {isHost && (<Button mode="contained" onPress={onPressHostCancelChallenge} style={{ marginHorizontal: 5 }} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="close" size={14} />
        Cancel Challenge
      </Button>)}

      {isHost && started && ((currentChallenge.challenge_detail.type === 'discover' && completedMembers.length > 0) || (currentChallenge.challenge_detail.type === 'walk' && (completed === 1 || completed === 1.5))) && (<Button mode="contained" onPress={onPressHostEndChallenge} style={{ marginHorizontal: 5 }} labelStyle={{ paddingBottom: 1 }}>
        {/* {isHost && started && (<Button mode="contained" onPress={onPressHostEndChallenge} style={{ marginHorizontal: 5 }} labelStyle={{ paddingBottom: 1 }}> */}
        {/* <MaterialCommunityIcons name="close" size={14} /> */}
        End Challenge
      </Button>)}

      {!isHost && joined === currentChallenge._id && (<Button mode="contained" onPress={onPressCancelChallenge} style={{ marginHorizontal: 5 }} labelStyle={{ paddingBottom: 1 }}>
        <MaterialCommunityIcons name="close" size={14} />
        Out Challenge
      </Button>)}


      {!isHost && joined !== currentChallenge._id && (<View style={{ backgroundColor: '#fff', borderColor: '#aaa', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10 }}>
        <Paragraph>
          Accepting the invitation will share your location to your teammates.
        </Paragraph>

        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', justifyContent: 'center' }}>
          <Button mode="contained" onPress={onJoin}>
            Accept
          </Button>
          <Button mode="outlined" style={{ backgroundColor: '#fafafa', marginLeft: 10 }} onPress={onDecline}>
            Decline
          </Button>
        </View>
      </View>)}


    </View>)}

  </>)
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})

export default ChallengeStartActionsTeam