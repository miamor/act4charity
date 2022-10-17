import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native'
import { ProgressBar, Button, useTheme, Appbar } from 'react-native-paper'
import { Text } from '../components/paper/typos'

import LogOutModal from '../components/LogOutModal'
import NotificationsModal from '../components/NotificationsModal'
import HelpModal from '../components/HelpModal'
import FeedbackModal from '../components/FeedbackModal'
import { useGlobals } from '../contexts/global'
import { DefaultView } from '../components/containers'
import { TextBold } from '../components/paper'

function ProfileScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [modalVisible, setModalVisible] = useState(false)
  const [targetModal, setTargetModalVisibility] = useState(false)
  const [notificationsModal, setNotificationsModalVisibility] = useState(false)
  const [helpModal, setHelpModalVisibility] = useState(false)
  const [feedbackModal, setFeedbackModalVisibility] = useState(false)
  const [personalInformationModal, setPersonalInformationModal] = useState(false)

  return (<DefaultView>
    <Appbar.Header statusBarHeight={0}>
      <Appbar.Content title="Profile" color={colors.primary} />
    </Appbar.Header>

    <ScrollView style={{ backgroundColor: '#fff' }}>
      <View style={styles.mainViewContainer}>

        {/* <Text variant="headlineMedium" style={{ color: '#6750A4' }}>
          Profile
        </Text> */}

        <View style={styles.profileDetailsViewContainer}>
          <Image
            source={require('../../assets/icons/placeholder.png')}
            style={{ height: 80, width: 80, borderRadius: 100 }}
          />
          <View style={styles.profileDetailsTextContainer}>
            <Text
              variant="titleLarge"
              style={{ alignSelf: 'flex-start', marginTop: 5 }}>
              {loggedUser.first_name}
            </Text>
            <Text style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
              {loggedUser.level}
            </Text>
          </View>
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Image
            source={require('../../assets/icons/settings.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Settings
          </TextBold>
        </View>

        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              console.log('personal information clicked')
              navigation.navigate('ProfilePersonalInfo')
            }}>
            <Text variant="bodyMedium">Personal Information</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => {
              console.log('notifications clicked')
              setNotificationsModalVisibility(!notificationsModal)
            }}>
            <Text variant="bodyMedium">Notifications</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => {
              console.log('interests clicked')
            }}>
            <Text variant="bodyMedium">Interests</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => {
              console.log('Target clicked')
              setTargetModalVisibility(!targetModal)
            }}>
            <Text variant="bodyMedium">Target</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>


        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
          <Image
            source={require('../../assets/icons/support.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Support
          </TextBold>
        </View>
        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              console.log('help clicked')
              setHelpModalVisibility(!helpModal)
            }}>
            <Text variant="bodyMedium">Help</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => {
              console.log('feedback clicked')
              setFeedbackModalVisibility(!feedbackModal)
            }}>
            <Text variant="bodyMedium">Feedback</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>



        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22 }}>
          <Image
            source={require('../../assets/icons/legal.png')}
            style={{ height: 22, width: 22, marginRight: 6 }}
          />
          <TextBold variant="labelMedium" style={{ color: colors.primary }}>
            Support
          </TextBold>
        </View>
        <View style={{ marginLeft: 32, marginTop: 16 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            onPress={() => {
              console.log('tos clicked')
            }}>
            <Text variant="bodyMedium">Terms of Service</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 4,
            }}
            onPress={() => {
              console.log('privacy policy clicked')
              setModalVisible(!modalVisible)
            }}>
            <Text variant="bodyMedium">Privacy Policy</Text>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={{ height: 22, width: 22 }}
            />
          </TouchableOpacity>
        </View>
      </View>


      <Button
        mode="text"
        style={{ width: 100, marginTop: 12 }}
        onPress={() => {
          console.log('logout button pressed')
          setModalVisible(!modalVisible)
        }}>
        {
          <Text style={{
            color: colors.primary, // '#6750A4',
            // textDecorationLine: 'underline'
          }}>
            Log Out
          </Text>
        }
      </Button>


      <LogOutModal
        modalVisibility={modalVisible}
        setModalVisibility={setModalVisible}
      />
      <NotificationsModal
        notificationModalVisibility={notificationsModal}
        setNotificationModalVisibility={setNotificationsModalVisibility}
      />
      <HelpModal
        helpModalVisibility={helpModal}
        setHelpModalVisibility={setHelpModalVisibility}
      />
      <FeedbackModal
        feedbackModalVisibility={feedbackModal}
        setFeedbackModalVisibility={setFeedbackModalVisibility}
      />
    </ScrollView>

  </DefaultView>)
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
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
})

export default ProfileScreen
