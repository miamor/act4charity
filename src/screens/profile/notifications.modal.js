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
          <View style={{ flex: 0.8 }}>

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
              <View>
                <Text style={{ marginTop: 4 }} variant="bodyMedium">
                  Notify about new challenges
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250 }}
                  value={beAwareSwitch1}
                  onValueChange={() => {
                    setbeAwareSwitch1(!beAwareSwitch1)
                  }}
                />
              </View>
            </View>
            <View style={styles.switchViewContainer}>
              <View>
                <Text style={{ marginTop: 4, width: 250 }} variant="bodyMedium">
                  Notify about discovery challenge locations near you
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250, marginTop: 10 }}
                  value={beAwareSwitch2}
                  onValueChange={() => {
                    setbeAwareSwitch2(!beAwareSwitch2)
                  }}
                />
              </View>
            </View>
            <View style={styles.switchViewContainer}>
              <View>
                <Text style={{ marginTop: 4, width: 250 }} variant="bodyMedium">
                  App Updates
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250 }}
                  value={beAwareSwitch3}
                  onValueChange={() => {
                    setbeAwareSwitch3(!beAwareSwitch3)
                  }}
                />
              </View>
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
              <View>
                <Text style={{ marginTop: 4, width: 220 }} variant="bodyMedium">
                  Invitations to challenges from others
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250, marginTop: 10 }}
                  value={socialSwitch1}
                  onValueChange={() => {
                    setSocialSwitch1(!socialSwitch1)
                  }}
                />
              </View>
            </View>
            <View style={styles.switchViewContainer}>
              <View>
                <Text style={{ marginTop: 4, width: 220 }} variant="bodyMedium">
                  Know if there are people around to do group challenges
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250, marginTop: 10 }}
                  value={socialSwitch2}
                  onValueChange={() => {
                    setSocialSwitch2(!socialSwitch2)
                  }}
                />
              </View>
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
              <View>
                <Text style={{ marginTop: 4 }} variant="bodyMedium">
                  Recieve inactivity reminders
                </Text>
                <Switch
                  style={{ position: 'absolute', marginLeft: 250 }}
                  value={reminders1}
                  onValueChange={() => {
                    setReminders1(!reminders1)
                  }}
                />
              </View>
            </View>
          </View>


          <View style={{ flex: 0.2, marginTop: 30 }}>
            <Button mode="text"
              style={{ width: 100, marginTop: 35 }}
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
    marginLeft: 42,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})
export default NotificationsModal
