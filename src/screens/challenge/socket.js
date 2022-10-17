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



// const socket = io(SOCKET_URL)
const socket = io.connect('http://192.168.77.21:3000', {
  transports: ["websocket"],
  autoConnect: true,
  withCredentials: false,
});


function TestSockScreen({ route, navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()


  const [chatMessages, setChatMessages] = useState([])
  const [chatMessage, setChatMessage] = useState('')
  const [memberStates, setMembersStates] = useState([])


  const room_id = 123


  /* **********************************************
   *
   * Send signals
   *
   * **********************************************/
  useEffect(() => {
    // console.log('socket', socket)

    /*
     * join the room 
     */
    socket.emit('join', { room_id: room_id, user_id: loggedUser._id, data: loggedUser.username + ' joined' })
  }, [])

  /*
   * Send chat message
   */
  const submitChatMessage = () => {
    socket.emit('chat', { room_id: room_id, user_id: loggedUser._id, data: chatMessage })
    setChatMessage('')
  }



  /* **********************************************
   *
   * On receive signals
   *
   * **********************************************/
  useEffect(() => {
    /*
     * someone joined
     */
    socket.on('join_' + room_id, res => {
      console.log('[join_] someone joined.', res)
      setChatMessages([...chatMessages, res.data])
    })

    /*
     * someone sent a chat message
     */
    socket.on('chat_' + room_id, res => {
      console.log('[chat_] res', res)
      setChatMessages([...chatMessages, res.data])
    })

    /*
     * received location updates
     */
    socket.on('state_' + room_id, res => {
      console.log('[state_] res', res)
      setMembersStates([...memberStates, res.data])
    })


    return () => {
      socket.off('join_' + room_id);
      socket.off('chat_' + room_id);
      socket.off('state_' + room_id);
    }
  }, [chatMessages])


  useEffect(() => {
    console.log('[chatMessages] chatMessages', chatMessages)
  }, [chatMessages])


  return (
    <DefaultView>

      <View style={styles.container}>
        {chatMessages.map((msg, i) => (
          <Text key={`msg-` + i} style={{ borderWidth: 2 }}>{msg}</Text>
        ))}
        <TextInput
          style={{ height: 40, borderWidth: 2 }}
          autoCorrect={false}
          value={chatMessage}
          // onSubmitEditing={() => submitChatMessage()}
          onChangeText={msg => {
            setChatMessage(msg)
          }}
        />
        <Button mode="contained" onPress={submitChatMessage}>
          Send
        </Button>
      </View>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
})

export default TestSockScreen
