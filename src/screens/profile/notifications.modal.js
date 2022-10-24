import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, View, Image } from 'react-native'
import { Button, Switch, useTheme } from 'react-native-paper'
import { useGlobals } from '../../contexts/global'
import { H2, Text, TextBold } from '../../components/paper/typos'


function NotificationsModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [beAwareSwitch1, setbeAwareSwitch1] = useState(false)
  const [beAwareSwitch2, setbeAwareSwitch2] = useState(false)
  const [beAwareSwitch3, setbeAwareSwitch3] = useState(false)
  const [socialSwitch1, setSocialSwitch1] = useState(false)
  const [socialSwitch2, setSocialSwitch2] = useState(false)
  const [reminders1, setReminders1] = useState(false)


  return (
    <Modal
      animationType="slide"
      visible={props.notificationModalVisibility}
      onRequestClose={() => {
        props.setNotificationModalVisibility(
          !props.notificationModalVisibility,
        )
      }}>
      <View style={styles.mainViewContainer}>
        <H2>Notifications</H2>

        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={{ flex: 0.7 }}>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
              <Image
                source={require('../../../assets/icons/beaware.png')}
                style={{ height: 22, width: 22, marginRight: 6 }}
              />
              <TextBold
                variant="labelMedium"
                style={{ color: colors.primary, marginBottom: 2 }}>
                Be aware
              </TextBold>
            </View>

            <View style={styles.switchViewContainer}>
              <Text style={styles.textLabel} variant="bodyMedium">
                Notify about new challenges
              </Text>
              <Switch
                value={beAwareSwitch1}
                onValueChange={() => {
                  setbeAwareSwitch1(!beAwareSwitch1)
                }}
              />
            </View>
            <View style={styles.switchViewContainer}>
              <Text style={styles.textLabel} variant="bodyMedium">
                Notify about discovery challenge locations near you
              </Text>
              <Switch
                value={beAwareSwitch2}
                onValueChange={() => {
                  setbeAwareSwitch2(!beAwareSwitch2)
                }}
              />
            </View>
            <View style={styles.switchViewContainer}>
              <Text style={styles.textLabel} variant="bodyMedium">
                App Updates
              </Text>
              <Switch
                value={beAwareSwitch3}
                onValueChange={() => {
                  setbeAwareSwitch3(!beAwareSwitch3)
                }}
              />
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 36 }}>
              <Image
                source={require('../../../assets/icons/social.png')}
                style={{ height: 22, width: 22, marginRight: 6 }}
              />
              <TextBold
                variant="labelMedium"
                style={{ color: colors.primary, marginBottom: 2 }}>
                Social
              </TextBold>
            </View>
            <View style={styles.switchViewContainer}>
              <Text style={styles.textLabel} variant="bodyMedium">
                Invitations to challenges from others
              </Text>
              <Switch
                value={socialSwitch1}
                onValueChange={() => {
                  setSocialSwitch1(!socialSwitch1)
                }}
              />
            </View>
            <View style={styles.switchViewContainer}>
              <Text style={styles.textLabel} variant="bodyMedium">
                Know if there are people around to do group challenges
              </Text>
              <Switch
                value={socialSwitch2}
                onValueChange={() => {
                  setSocialSwitch2(!socialSwitch2)
                }}
              />
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 36 }}>
              <Image
                source={require('../../../assets/icons/reminders.png')}
                style={{ height: 22, width: 22, marginRight: 6 }}
              />
              <TextBold
                variant="labelMedium"
                style={{ color: colors.primary, marginBottom: 2 }}>
                Reminders
              </TextBold>
            </View>
            <View style={styles.switchViewContainer}>
              <Text style={{ marginTop: 0 }} variant="bodyMedium">
                Recieve inactivity reminders
              </Text>
              <Switch
                value={reminders1}
                onValueChange={() => {
                  setReminders1(!reminders1)
                }}
              />
            </View>
          </View>


          <View style={{ flex: 0.3, justifyContent: 'center' }}>
            <Button mode="text"
              style={{ width: 100 }}
              labelStyle={{ paddingHorizontal: 10 }}
              onPress={() => props.setNotificationModalVisibility(!props.notificationModalVisibility)}>
              BACK
            </Button>
          </View>

        </View>

      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 30,
    marginRight: 24,
    flex: 1,
  },
  switchViewContainer: {
    marginLeft: 25,
    marginTop: 18,
    marginBottom: 3,
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: '#0f0'
  },
  textLabel: {
    flex: 1,
    // marginTop: 0,
    lineHeight: 24,
  }
})
export default NotificationsModal
