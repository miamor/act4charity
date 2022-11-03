import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { StyleSheet, ToastAndroid, PermissionsAndroid, View, Animated, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native'
import { Appbar, Button, useTheme, IconButton, ProgressBar, MD3Colors, Avatar, Paragraph, Dialog, Portal, Modal, TextInput, Badge } from 'react-native-paper'
import { TextBold, Text, H2, H3 } from '../paper/typos'
import { DefaultView } from '../containers'
import { useGlobals } from '../../contexts/global'
import { useInterval } from '../../hooks/use-interval'

import Loading from '../animations/loading'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'

import * as userAPI from '../../services/userAPI'
import { useNavigation } from '@react-navigation/core'

import Storer from '../../utils/storer'
import ChallengeBarTeam from './bar.team'
import axios from 'axios'
import TakePicture from './take-picture'
import { REACT_APP_API_URL } from '../../services/APIServices'
import { members_colors } from '../../utils/vars'


function ChallengeStartActionsTeam(props) {
  const [{ currentChallenge, loggedUser,
    currentLocation, currentRegion, trackLoc, trackStep,
    socket, privateSockMsg, privateSockMsgs, trackMemberStartStates, trackMemberLocationStates, trackMemberDistStates, trackMemberStepStates, membersJoinStatus, completedMembers, chatMessages, processedPrivateSockMsgs,
    started, startTime, completed, joined
  }, dispatch] = useGlobals()
  const { colors } = useTheme()
  const navigation = useNavigation()

  const onSetDispatch = (type, key, value) => dispatch({ type: type, [key]: value })


  const [loading, setLoading] = useState(true)


  /*
   * Load token to use for uploadng pic
   */
  const [token, setToken] = useState()
  useEffect(() => {
    (async () => {
      if (token == null) {
        const _token = await Storer.get('token')
        setToken(_token)
      }
    })()
  }, [token])


  /*
   * Watch completed to callback
   */
  useEffect(() => {
    // console.log('[' + loggedUser.username + '] [actions.team] currentLocation', currentLocation, ' | completed =', completed)

    if (completed === 1) {
      onComplete()
    }
  }, [completed])




  /* ************************
   *
   * check if current user is host
   *
   * ************************/
  const [isHost, setIsHost] = useState(false)


  /* ************************
   *
   * load all members and members status (accepted / declined / out)
   *
   * ************************/
  const [loadedMembersStatus, setLoadedMembersStatus] = useState(false)
  useEffect(() => {
    if (loggedUser._id === currentChallenge.user) {
      setIsHost(true)
    }

    if (props.showFull) {
      if (currentChallenge != null && loadedMembersStatus === false) {
        loadMembersStatus()
        setLoadedMembersStatus(true)
      }
    }

  }, [])

  // useEffect(() => {
  //   if (props.showFull) {
  //     if (currentChallenge != null && loadedMembersStatus === false) {
  //       loadMembersStatus()
  //       setLoadedMembersStatus(true)
  //     }
  //   }
  // }, [currentChallenge, started, joined])

  const loadMembersStatus = () => {
    // console.log('[' + loggedUser.username + '] [actions.team][loadMembersStatus] CALLED ~~~')

    userAPI.getChallengeInvitations({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      // console.log('[' + loggedUser.username + '] [actions.team][loadMembersStatus] (getChallengeInvitations) >>> membersJoinStatus', membersJoinStatus)

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
  const [sentFirstLoc, setSentFirstLoc] = useState(false)

  /* ************************
   * 
   * Host joined
   *
   * ************************/
  const hostJoin = async () => {
    // console.log('[' + loggedUser.username + '] [actions.team] hostJoin CALLED')
    // //console.log('['+loggedUser.username+'] [team.func] >>> membersJoinStatus', membersJoinStatus)

    if (joined !== currentChallenge._id) {
      /* dispatch and store so that not join again */
      onSetDispatch('setJoined', 'joined', currentChallenge._id)
      await Storer.set('joined', currentChallenge._id)

      // console.log('[' + loggedUser.username + '] [actions.team][hostJoin] >>> Im host. I joined')

      //? host joined for the first time
      const msg = {
        tbl: 'actions',
        room_id: currentChallenge._id,
        action: 'join',
        username: loggedUser.username,
        user_id: loggedUser._id,
        data: loggedUser.username + ' joined'
      }
      // _handleJoin(msg) //? no need
      sendSockMsg(msg)

      /*
       * On join, send first position
       */
      submitUserState(currentLocation, 'start')
      setSentFirstLoc(true)
    }
  }


  /* ************************
   * 
   * Check to start
   * 
   * ---
   * 
   * If record in db does not have `time_started` => challenge not started by host yet. Wait till the host clicks Start the challenge
   * If record in db has `time_started` => challenge started. Start the challenge use the `time_started` field (so that the timer keeps counting instead of resetting)
   *
   * ************************/
  const startNow = async () => {
    // console.log('[' + loggedUser.username + '] [actions.team][startNow] CALLED')

    await Storer.set('started', true)
    onSetDispatch('setStarted', 'started', true)

    await Storer.set('completed', 0)
    onSetDispatch('setCompleted', 'completed', 0)

    const dt = (currentChallenge.time_started != null) ? new Date(currentChallenge.time_started) : new Date()
    // console.log('['+loggedUser.username+'] [mapview] startTime == ', dt)
    Storer.set('startTime', dt)
    onSetDispatch('setStartTime', 'startTime', dt)

    if (currentChallenge.time_started == null) {
      onSetDispatch('setCurrentChallenge', 'currentChallenge', {
        ...currentChallenge,
        time_started: JSON.stringify(new Date())
      })
    }
  }

  useEffect(() => {
    //? start by the `time_started` field
    // console.log('[' + loggedUser.username + '] [actions.team] ************************* currentChallenge.time_started', currentChallenge.time_started)
    if (currentChallenge.time_started != null && currentChallenge.time_started.length > 0 && (!started || startTime == null) && joined === currentChallenge._id) {
      startNow()
    }
    //? else, wait for the host to start
  }, [])






  /* ************************
   *
   * Load, send (fake) sock msg
   * 
   * ---
   * 
   * If `lastChatMsgTime` is set, load from lastChatMsgTime only
   * Else, load all
   *
   * ************************/
  const [lastChatMsgTime, setLastChatMsgTime] = useState()
  const [lastActionMsgTime, setLastActionMsgTime] = useState()
  const [messages, setMessages] = useState([])
  const [pauseInterval, setPauseInterval] = useState(false)

  /*
   * Load first
   */
  useEffect(() => {
    if (joined === currentChallenge._id) {
      /*
       * for `actions`, load even in minimized mode
       */
      listSockActionsMsg()

      /*
       * for chat & states, load in full mode only
       */
      if (props.showFull) {
        listSockChatMsg()
        listSockStatesMsg()
      }
    }
  }, [joined, currentChallenge])

  /*
   * Update `chat` msg every X seconds
   */
  useInterval(() => {
    // console.log('[' + loggedUser.username + '] [actions.team]  | completed', completed, '  |  completedMembers', completedMembers)
    if (!pauseInterval && props.showFull && joined === currentChallenge._id) {
      listSockChatMsg()
    }
  }, 6000)

  /*
   * Load from `actions` tbl every X seconds
   */
  useInterval(() => {
    if (!pauseInterval && props.showFull) {
      listSockActionsMsg()
    }
  }, 8000)

  /*
   * Load from `states` tbl every X seconds
   */
  //! load when update my track instead
  // useInterval(() => {
  //   if (!pauseInterval && props.showFull) {
  //     listSockStatesMsg()
  //   }
  // }, 10000)
  /* 
   * Update my track data
   * ----
   * Only if I joined this challenge
   */
  //! update by change send too much data. 
  // /*
  //  * On update of trackLoc, send new loc to socket channel
  //  */
  // useEffect(() => {
  //   if (started && joined) {
  //     console.log('['+loggedUser.username+'] [team.func] *** trackLoc', trackLoc)
  //     submitUserState(trackLoc, 'loc')
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
  //! send by interval (every X sec) instead
  useInterval(() => {
    if (!pauseInterval && props.showFull && started && startTime != null && joined === currentChallenge._id && completed === 0) {
      // console.log('[' + loggedUser.username + '] [actions.team]  Should send `update_track_state` here')
      listSockStatesMsg()
    }
  }, 10000)

  useEffect(() => {
    submitUserState(trackLoc, 'loc')
  }, [trackLoc])
  useEffect(() => {
    submitUserState(trackStep, 'step')
  }, [trackStep])


  /* 
   * List socket msg of action `chat` only
   */
  const listSockChatMsg = () => {
    // console.log('[' + loggedUser.username + '] [actions.team][listSockMsg] CALLED.   lastChatMsgTime =', lastChatMsgTime)

    userAPI.listSockMsg({ tbl: 'chat', challenge_accepted_id: currentChallenge._id, time: lastChatMsgTime }).then((res) => {
      // console.log('[' + loggedUser.username + '] [actions.team][listSockChatMsg]   lastChatMsgTime =', lastChatMsgTime, ' | res.data', res.data.length)

      if (res.data.length > 0) {
        if (lastChatMsgTime == null) {
          /*
           * if first time load, simply render everything
           */
          setMessages(res.data)
        }
        else if (lastMsgSentTime == null) {
          /*
           * if `lastMsgSentTime` is not set, meaning no message was sent between last load and this load,
           * can safely append everything to the `messages` state
           */
          setMessages((currentMessages) => ([...res.data, ...currentMessages]))
        }
        else {
          /*
           * if `lastMsgSentTime` is set and > than the `time` of the ealiest msg in this batch, we need to loop over whole array and ignore the message sent by this user 
           */
          // const earliestMsg = res.data[res.data.length - 1]
          // const latestMsg = res.data[0]
          // console.log('[' + loggedUser.username + '] [actions.team][listSockMsg]  lastMsgSentTime =', lastMsgSentTime, ' | earliestMsg.time =', earliestMsg.time, ' | latestMsg.time =', latestMsg.time, '  |  lastMsgSentTime.getTime() =', lastMsgSentTime.getTime(), ' | earliestMsg.time.getTime() =', new Date(earliestMsg.time).getTime(), ' | latestMsg.time.getTime() =', new Date(latestMsg.time).getTime())

          console.log('lastChatMsgTime', lastChatMsgTime.getTime())

          // if (lastMsgSentTime.getTime() >= new Date(earliestMsg.time).getTime()) {
          // if (lastMsgSentTime.getTime() >= lastChatMsgTime.getTime()) {
            console.log('['+loggedUser.username+'] [actions.team] I sent something in between')
            res.data.reverse().forEach((item) => {
              if (item.user_id !== loggedUser._id) {
                console.log('['+loggedUser.username+'] [actions.team] item.user_id =', item.user_id, ' | loggedUser._id =', loggedUser._id)
                _handleChat(item)
              }
            })
          // }
          // else {
          //   setMessages((currentMessages) => ([...res.data, ...currentMessages]))
          // }
        }
        setLastChatMsgTime(new Date(res.data[0].time))
        setLastMsgSentTime(null)
      }

      // setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  /* 
   * List socket msg of actions
   */
  const listSockActionsMsg = () => {
    // console.log('[' + loggedUser.username + '] [actions.team][listSockMsg] CALLED.   lastChatMsgTime =', lastChatMsgTime)

    userAPI.listSockMsg({ tbl: 'actions', challenge_accepted_id: currentChallenge._id, time: lastActionMsgTime }).then((res) => {
      // console.log('[' + loggedUser.username + '] [actions.team][listSockActionsMsg]   lastActionMsgTime =', lastActionMsgTime, ' | res.data', res.data.length)

      if (res.data.length > 0) {
        res.data.forEach((item) => { //? backend returns in ascending order, no need to reverse like chat
          /*
           * When a user called an action,  the handler is triggered for him at the time sending action.
           * No need to handle here anymore
           */
          if (item.user_id !== loggedUser._id) {
            msgHandlers(item)
          }
        })
        setLastActionMsgTime(res.data[res.data.length - 1].time) //? last time is time of last msg
      }
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  /* 
   * List socket msg of action `update_track_state`
   */
  const listSockStatesMsg = () => {
    // console.log('[' + loggedUser.username + '] [actions.team][listSockMsg] CALLED.   lastChatMsgTime =', lastChatMsgTime)

    userAPI.listSockMsg({ tbl: 'states', challenge_accepted_id: currentChallenge._id }).then((res) => {
      // console.log('[' + loggedUser.username + '] [actions.team][listSockStatesMsg] CALLED  | res.data', res.data.length)

      if (res.data.length > 0) {
        // res.data.forEach((item) => {
        //   // if (item.user_id !== loggedUser._id) { //! need to update even with me
        //     // msgHandlers(item)
        //     stateHandlers(item)
        //   // }
        // })
        stateHandlers(res.data)
      }
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  /* 
   * Send socket msg
   */
  const [lastMsgSentTime, setLastMsgSentTime] = useState()
  const sendSockMsg = async (msg) => {
    // setLoading(true)
    msg.time = new Date(Date.now())
    userAPI.sendSockMsg(msg)
    // listSockChatMsg()

    if (msg.action === 'chat') {
      setLastMsgSentTime(msg.time)
    }

  }



  /* ************************
   *
   * Msg handlers
   *
   * ************************/
  const msgHandlers = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team] >>>>>>>>>> res ', res)

    // /*
    //  * //! for signals other than chat, add to messages just for debug
    //  * for action `chat`, `_handleChat` already append data to messages so no need.
    //  */
    // if (res.action !== 'chat') {
    //   _handleChat(res)
    // }


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

    // else if (res.action === 'chat') { //? chat is quite separate
    //   /*
    //    * someone send chat message
    //    */
    //   _handleChat(res)
    // }

    //! don't handle by each item. too lag
    // if (res.action === 'update_track_state') {
    //   if (res.state_type === 'start') {
    //     /*
    //      * receive first position of a member
    //      */
    //     _handleStartState(res)
    //   }
    //   else if (res.state_type === 'loc') {
    //     /*
    //      * receive location update
    //      */
    //     _handleLocState(res)
    //   }

    //   else if (res.state_type === 'step') {
    //     /*
    //      * receive step update
    //      */
    //     _handleStepState(res)
    //   }
    // }
  }


  /* ************************
   *
   * Handler for each message type 
   *
   * ************************/
  const _handleStart = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleStart] CALLED')
    if (!started || startTime == null) {
      startNow()
    }
  }//, [])

  const _handleChat = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleChat] CALLED  | messages =', messages.length)
    // setLoading(false)
    // setMessages([...messages, res])
    setMessages((currentMessages) => ([res, ...currentMessages]));
  }//, [messages])

  const _handleJoin = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleJoin] CALLED  | membersJoinStatus =', membersJoinStatus)
    if (!membersJoinStatus.hasOwnProperty(res.user_id) || membersJoinStatus[res.user_id] !== 1) {
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: 1,
      }
      onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
      console.log('[' + loggedUser.username + '] [someone joined] members_joins', members_joins)
    }
  }//, [membersJoinStatus])

  const _handleDecline = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleDecline] CALLED')
    if (!membersJoinStatus.hasOwnProperty(res.user_id) || membersJoinStatus[res.user_id] !== -1) {
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: -1,
      }
      onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
      console.log('[' + loggedUser.username + '] [someone declined] members_joins', members_joins)
    }
  }//, [membersJoinStatus])

  const _handleOut = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleOut] CALLED')
    if (!membersJoinStatus.hasOwnProperty(res.user_id) || membersJoinStatus[res.user_id] !== -2) {
      let members_joins = {
        ...membersJoinStatus,
        [res.user_id]: -2,
      }
      onSetDispatch('setMembersJoinStatus', 'membersJoinStatus', members_joins)
      console.log('[' + loggedUser.username + '] [someone out] members_joins', members_joins)
    }
  }//, [membersJoinStatus])

  const _handleComplete = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleComplete] CALLED  | ******************** completedMembers =', completedMembers)
    if (!completedMembers.includes(res.user_id)) {
      onSetDispatch('setCompletedMembers', 'completedMembers', [...completedMembers, res.user_id])
    }
  }//, [completedMembers])

  const _handleKill = (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleKill] CALLED')
    if (completed !== -1) {
      onSetDispatch('setCompleted', 'completed', -1)
    }
  }//, [])

  const _handleEnd = async (res) => {
    // console.log('[' + loggedUser.username + '] [actions.team][_handleEnd] CALLED')
    // onSetDispatch('setTeamCompleted', 'teamCompleted', 1)

    if (completed < 3) {
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
    }
  }//, [completed])



  const stateHandlers = async (data) => {
    let _trackMemberStartStates = { ...trackMemberStartStates }
    let _trackMemberLocationStates = { ...trackMemberLocationStates }
    let _trackMemberStepStates = { ...trackMemberStepStates }
    let _trackMemberDistStates = { ...trackMemberDistStates }

    let _distStates_changed = false
    let _stepStates_changed = false

    console.log('[stateHandlers] CALLED')

    await data.forEach(res => {
      if (res.state_type === 'start') {
        _trackMemberStartStates = {
          ..._trackMemberStartStates,
          [res.username]: res.data,
        }
      }

      else if (res.state_type === 'loc') {
        if (!_trackMemberDistStates.hasOwnProperty(res.username) || _trackMemberDistStates[res.username] !== res.data.distanceTravelled) {
          _distStates_changed = true

          _trackMemberLocationStates = {
            ..._trackMemberLocationStates,
            [res.user_id]: {
              ...res.data,
              username: res.username
            },
          }
          _trackMemberDistStates = {
            ..._trackMemberDistStates,
            [res.username]: res.data.distanceTravelled,
          }
        }
      }

      else if (res.state_type === 'step') {
        if (!_trackMemberStepStates.hasOwnProperty(res.username) || _trackMemberStepStates[res.username] !== res.data.currentStepCount) {
          _stepStates_changed = true

          _trackMemberStepStates = {
            ..._trackMemberStepStates,
            [res.username]: res.data.currentStepCount,
          }
        }
      }
    })

    if (Object.keys(_trackMemberStartStates).length !== Object.keys(trackMemberStartStates).length) {
      onSetDispatch('setTrackMemberStartStates', 'trackMemberStartStates', _trackMemberStartStates)
    }
    if (_distStates_changed === true) {
      onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', _trackMemberLocationStates)
      onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', _trackMemberDistStates)
    }
    if (_stepStates_changed === true) {
      onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', _trackMemberStepStates)
    }
  }

  // const _handleStartState = (res) => {
  //   // console.log('[' + loggedUser.username + '] [actions.team][_handleStartState] CALLED')
  //   onSetDispatch('setTrackMemberStartStates', 'trackMemberStartStates', {
  //     ...trackMemberStartStates,
  //     [res.username]: res.data,
  //   })
  // }//, [trackMemberStartStates])

  // const _handleLocState = (res) => {
  //   // console.log('[' + loggedUser.username + '] [actions.team][_handleLocState] CALLED')
  //   onSetDispatch('setTrackMemberLocationStates', 'trackMemberLocationStates', {
  //     ...trackMemberLocationStates,
  //     [res.user_id]: {
  //       ...res.data,
  //       username: res.username
  //     },
  //   })

  //   onSetDispatch('setTrackMemberDistStates', 'trackMemberDistStates', {
  //     ...trackMemberDistStates,
  //     [res.user_id]: res.data.distanceTravelled,
  //   })
  // }//, [trackMemberLocationStates, trackMemberDistStates])

  // const _handleStepState = (res) => {
  //   // console.log('[' + loggedUser.username + '] [actions.team][_handleStepState] CALLED')
  //   onSetDispatch('setTrackMemberStepStates', 'trackMemberStepStates', {
  //     ...trackMemberStepStates,
  //     [res.user_id]: res.data.currentStepCount,
  //   })
  // }//, [trackMemberStepStates])



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

        // console.log('[' + loggedUser.username + '] [actions.team][onJoin] joined !!')

        if (res) {
          /* dispatch and store so that not join again */
          onSetDispatch('setJoined', 'joined', currentChallenge._id)
          Storer.set('joined', currentChallenge._id)

          /*
           * join the room 
           */
          const msg = {
            tbl: 'actions',
            room_id: currentChallenge._id,
            action: 'join',
            username: loggedUser.username,
            user_id: loggedUser._id,
            data: loggedUser.username + ' joined'
          }
          _handleJoin(msg)
          sendSockMsg(msg)

          // loadMembersStatus() //! use socket to update

          /*
           * On join, send first position
           */
          submitUserState(currentLocation, 'start')
          setSentFirstLoc(true)


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

        // console.log('[' + loggedUser.username + '] [actions.team][onDecline] declined')

        const msg = {
          tbl: 'actions',
          room_id: currentChallenge._id,
          action: 'decline',
          username: loggedUser.username,
          user_id: loggedUser._id,
          data: loggedUser.username + ' declined'
        }
        // _handleDecline(res) //? no need
        sendSockMsg(msg)

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
   * Host click Start the challenge
   * 
   * ---
   * 
   * Start for the whole team.
   * Team challenge can only be started once at least one person (other than host) accepted the invitation and joined the challenge
   *
   * ************************/
  const [showWarningCantStart, setShowWarningCantStart] = useState(false)
  const hideWarningCantStart = () => {
    setShowWarningCantStart(false)
    setPauseInterval(false)
  }
  const [showHostConfirmStartTeam, setShowHostConfirmStartTeam] = useState(false)
  const hideConfirmStartTeam = () => {
    setShowHostConfirmStartTeam(false)
    setPauseInterval(false)
  }
  const onPressStartTeam = () => {
    //? if totStt > 0 => at least one member accepted.
    // console.log('['+loggedUser.username+'] [actions.team][onPressStartTeam] membersJoinStatus', membersJoinStatus)

    const totStt = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0)
    if (totStt <= 1) { //! change to 1
      setShowWarningCantStart(true)
      setPauseInterval(true)
    } else {
      setShowHostConfirmStartTeam(true)
      setPauseInterval(true)
    }
  }
  const onConfirmStartTeam = () => {
    setLoading(true)
    hideConfirmStartTeam()

    userAPI.startTeamChallenge({ challenge_accepted_id: currentChallenge._id }).then((res) => {
      console.log('[' + loggedUser.username + '] [startTeamChallenge] res', res)

      const msg = {
        tbl: 'actions',
        room_id: currentChallenge._id,
        action: 'start',
        username: loggedUser.username,
        user_id: loggedUser._id,
        data: 'Host started the challenge'
      }
      _handleStart(msg)
      sendSockMsg(msg)

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
    setChatMessage('')

    if (chatMessage && chatMessage.length > 0) {
      // setLoading(true)

      console.log('[' + loggedUser.username + '] [submitChatMessage] CALLED', chatMessage)

      const msg = {
        // tbl: 'chat', //? by default is `chat`, no need to declare
        room_id: currentChallenge._id,
        action: 'chat',
        username: loggedUser.username,
        user_id: loggedUser._id,
        data: chatMessage
      }
      _handleChat(msg)

      setLoading(false)

      sendSockMsg(msg)

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
   * Take picture and send via socket channel
   *
   * ************************/
  const [showAskImgSource, setShowAskImgSource] = useState(true)
  const hideAskImgSource = useCallback(() => {
    setShowAskImgSource(false)
    setPauseInterval(false)
  })

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
      postData.append('sock', true)

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
        setPauseInterval(false)

        /* cast to other members via socket channel */
        const msg = {
          // tbl: 'chat', //? by default is `chat`, no need to declare
          room_id: currentChallenge._id,
          action: 'chat',
          username: loggedUser.username,
          user_id: loggedUser._id,
          data: res.data.content,
          picture: res.data.picture,
        }
        _handleChat(msg)
        sendSockMsg(msg)

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
    setPauseInterval(true)
  }, [])

  const onCloseShareStory = useCallback((postData) => {
    setShowShareStoryModal(false)
    setPauseInterval(false)
  }, [])



  /* ************************
   *
   * Send user states (loc states and steps state etc.)
   *
   * ************************/
  const submitUserState = (myTrackState, state_type) => {
    const msg = {
      tbl: 'states',
      room_id: currentChallenge._id,
      action: 'update_track_state',
      state_type: state_type,
      username: loggedUser.username,
      user_id: loggedUser._id,
      data: myTrackState,
    }

    //! actually no need to handle oneself track states, as mapview use trackLoc and trackState to visualize the user's state
    // if (msg.state_type === 'start') {
    //   _handleStartState(msg)
    // }
    // else if (msg.state_type === 'loc') {
    //   _handleLocState(msg)
    // }
    // else if (msg.state_type === 'step') {
    //   _handleStepState(msg)
    // }

    sendSockMsg(msg)
  }








  /* **********************************************
   * 
   * Checking things for team challenge
   *
   * ----------------------
   * 
   * All check stuff here
   *
   * **********************************************/

  /* ****************
   * 
   * Check if all members completed
   * 
   * ****************/
  const [showAnnounceTeamCompleted, setShowAnnounceTeamCompleted] = useState(false)
  const hideAnnounceTeamCompleted = () => {
    setShowAnnounceTeamCompleted(false)
    setPauseInterval(false)
  }
  useEffect(() => {
    if (membersJoinStatus != null) {
      const totMembers = Object.values(membersJoinStatus).reduce((a, b) => a + b, 0) + 1
      if (totMembers > 0 && completedMembers.length === totMembers) {
        setShowAnnounceTeamCompleted(true)
        setPauseInterval(true)
      }
    }
  }, [completedMembers])



  /* **********************************************
   *
   * Individual completion
   * 
   * ---
   * 
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
    setPauseInterval(false)
  }
  const onComplete = () => {
    // setLoading(true)
    // setCompleted(1)
    // onSetDispatch('setCompleted', 'completed', 1)
    setShowConfirmComplete(true)
    setPauseInterval(true)

    /*
     * cast to other members via socket channel
     * only needed for discover challenge
     */
    const msg = {
      tbl: 'actions',
      room_id: currentChallenge._id,
      action: 'complete',
      username: loggedUser.username,
      user_id: loggedUser._id,
      data: loggedUser.username + ' completed this challenge',
    }
    _handleComplete(msg)
    sendSockMsg(msg)
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
  const hideHostConfirmEnd = () => {
    setHostShowConfirmEnd(false)
    setPauseInterval(false)
  }
  const [donationAmount, setDonationAmount] = useState(0)
  const [rewardAmount, setRewardAmount] = useState(0)
  const onPressHostEndChallenge = () => {
    setHostShowConfirmEnd(true)
    setPauseInterval(true)

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
        console.log('[' + loggedUser.username + '] [confirmCompleteCallback] res', res)

        const msg = {
          tbl: 'actions',
          room_id: currentChallenge._id,
          action: 'end',
          username: loggedUser.username,
          user_id: loggedUser._id,
          data: loggedUser.username + ' ended this challenge',

          trackMemberStartStates: trackMemberStartStates,
          trackMemberLocationStates: trackMemberLocationStates,
          trackMemberStepStates: trackMemberStepStates,
          challenge_accepted_id: currentChallenge._id,

          donation_amount: donationAmount,
          reward_amount: rewardAmount,
        }
        _handleEnd(msg)
        sendSockMsg(msg)
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
  const hideConfirmCancel = () => {
    setShowConfirmCancel(false)
    setPauseInterval(false)
  }
  const onConfirmCancel = () => {
    setLoading(true)
    hideConfirmCancel()

    if (!isHost) {
      /*
       * When the user is not host
       * Simply out the challenge
       */
      userAPI.cancelInvitation({ challenge_accepted_id: currentChallenge._id }).then((res) => {
        console.log('[' + loggedUser.username + '] >> res', res)

        /* dispatch global states */
        onSetDispatch('setCompleted', 'completed', -1)

        /* cast to other members via socket channel */
        const msg = {
          tbl: 'actions',
          room_id: currentChallenge._id,
          action: 'out',
          username: loggedUser.username,
          user_id: loggedUser._id,
          data: loggedUser.username + ' withdrawn from this challenge',
        }
        // _handleOut(msg) //? no need
        sendSockMsg(msg)

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
    setPauseInterval(true)
  }
  const hideHostConfirmCancel = () => {
    setHostShowConfirmCancel(false)
    setPauseInterval(false)
  }
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
          tbl: 'actions',
          room_id: currentChallenge._id,
          action: 'kill',
          username: loggedUser.username,
          user_id: loggedUser._id,
          data: 'Host canceled this challenge',
        }
        _handleKill(msg)
        sendSockMsg(msg)

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



  /* **********************************************
   *
   * Simple Tab view
   *
   * **********************************************/
  const [tabIndex, setTabIndex] = useState(0)

  // const [onFocus, setOnFocus] = useState(false)
  const onFocusChat = () => {
    setPauseInterval(true)
  }


  const dimensions = Dimensions.get('window')
  const imageHeight = Math.round(dimensions.width * 9 / 16)
  const imageWidth = dimensions.width - 180



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
        {started && startTime != null && joined === currentChallenge._id ? (
          <ChallengeBarTeam />
        )
          : (<Text style={{ textAlign: 'center', lineHeight: 23, marginVertical: 6, marginHorizontal: 20 }}>Recorder will start counting once the host starts the challenge</Text>)}
        {/* <ChallengeBarTeam /> */}
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
        <TouchableOpacity onPress={() => setTabIndex(2)}
          style={{
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderBottomColor: tabIndex === 2 ? colors.primary : 'transparent',
          }}>
          <Text style={[tabIndex === 2 && { color: colors.primary, fontWeight: 'bold' }]}>
            Logs
          </Text>
        </TouchableOpacity>
      </View>


      <View style={{ flex: 1 }}>
        {tabIndex === 0 ? (<>
          {joined === currentChallenge._id ? (<View style={{ flexDirection: 'column', flex: 1, paddingTop: 10 }}>
            <View style={{ flex: 1 }}>
              <BottomSheetScrollView contentContainerStyle={{ paddingHorizontal: 20, }}>
                {messages.map((res, i) => {
                  if ((res.data != null && res.data.length > 0) || (res.picture != null && res.picture.length > 0)) {
                    return (<View key={`res-` + i} style={{ flexDirection: 'row', marginVertical: 6 }}>
                      <Text style={{
                        marginRight: 6, lineHeight: 24,
                        color: members_colors[currentChallenge.participants.indexOf(res.user_id)]
                      }}>
                        {res.username}
                      </Text>
                      <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Text style={{ lineHeight: 24 }}>
                          {res.data}
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
                // onSubmitEditing={() => submitChatMessage()}
                onChangeText={res => setChatMessage(res)}
              // onFocus={() => onFocusChat(true)}
              />
              <View style={{ alignSelf: 'center', paddingLeft: 10 }}>
                <Button mode="contained" onPress={submitChatMessage} disabled={chatMessage == null || chatMessage.length === 0}>
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
              <Text style={{ color: members_colors[currentChallenge.participants.indexOf(user._id)] }}>{user.username}</Text>
              <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
                {/* {loggedUser._id === user._id ? 1 : membersJoinStatus[user._id]} */}
                {user._id === currentChallenge.user ? 'Host'
                  : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === 1 ? 'Joined'
                    : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === -1 ? 'Declined'
                      : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === -2 ? 'Withdrawn'
                        : membersJoinStatus.hasOwnProperty(user._id) && membersJoinStatus[user._id] === 0 ? 'Pending'
                          : ''}
              </Text>
              <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
                {completedMembers.includes(user._id) && 'Completed'}
              </Text>
            </View>)
          })}
        </View>)
          : (<></>)}


        {tabIndex === 2 ? (<View style={{ paddingHorizontal: 30, paddingTop: 10 }}>
          <Text style={{ color: '#999', fontSize: 13, marginTop: 3 }}>
            Total distance team travelled: {Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0)} km / {(currentChallenge.challenge_detail.distance - 0.01)} = {100 * Object.values(trackMemberDistStates).reduce((a, b) => a + b, 0) / (currentChallenge.challenge_detail.distance - 0.01)}
          </Text>
          <Text style={{ color: '#999', fontSize: 13, marginTop: 3 }}>
            Total steps: {Object.values(trackMemberStepStates).reduce((a, b) => a + b, 0)}
          </Text>

          

          {/* <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: members_colors[currentChallenge.participants.indexOf(loggedUser._id)] }}>
              I ({loggedUser.username})
            </Text>
            <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
              travelled {trackLoc.distanceTravelled} km
            </Text>
          </View> */}

          {joined === currentChallenge._id && trackMemberLocationStates != null && Object.keys(trackMemberLocationStates).length > 0 && Object.keys(trackMemberLocationStates).map((user_id, i) => (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
            <Text style={{ color: members_colors[currentChallenge.participants.indexOf(user_id)] }}>
              {trackMemberLocationStates[user_id].username}
            </Text>

            <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
              travelled {trackMemberDistStates[trackMemberLocationStates[user_id].username]} km
            </Text>
          </View>))}


          {joined === currentChallenge._id && trackMemberStepStates != null && Object.keys(trackMemberStepStates).length > 0 && Object.keys(trackMemberStepStates).map((username, i) => (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
            <Text style={{ color: members_colors[currentChallenge.participants.indexOf(username)] }}>
              {username}
            </Text>

            <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
              walked {trackMemberStepStates[username]} steps
            </Text>
          </View>))}


          {/* {joined === currentChallenge._id && trackMemberDistStates != null && Object.keys(trackMemberDistStates).length > 0 && Object.keys(trackMemberDistStates).map((username, i) => (<View key={`us-` + i} style={{ flexDirection: 'row' }}>
            <Text style={{ color: members_colors[currentChallenge.participants.indexOf(username)] }}>
              {username}
            </Text>

            <Text style={{ marginLeft: 10, color: '#999', fontSize: 13, marginTop: 3 }}>
              walked {trackMemberDistStates[username]} km
            </Text>
          </View>))} */}


        </View>)
          : (<></>)}

      </View>

    </BottomSheet>)}



    <TakePicture showShareStoryModal={showShareStoryModal} showAskImgSource={showAskImgSource} hideAskImgSource={hideAskImgSource} onCloseShareStory={onCloseShareStory} callbackSubmitShareStory={callbackSubmitShareStory} />




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


      {!isHost && joined !== currentChallenge._id && (<View style={{
        backgroundColor: '#fff',
        borderColor: '#a2a2a22f',
        shadowColor: '#777',
        elevation: 4,
        borderWidth: 1, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10
      }}>
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