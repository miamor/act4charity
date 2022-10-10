import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Pressable, View, Image} from 'react-native';
import {Text, Button, Switch} from 'react-native-paper';

function NotificationsModal(props) {
  const [beAwareSwitch1, setbeAwareSwitch1] = useState(false);
  const [beAwareSwitch2, setbeAwareSwitch2] = useState(false);
  const [beAwareSwitch3, setbeAwareSwitch3] = useState(false);
  const [socialSwitch1, setSocialSwitch1] = useState(false);
  const [socialSwitch2, setSocialSwitch2] = useState(false);
  const [reminders1, setReminders1] = useState(false);
  return (
    <View style={{backgroundColor: '#ffffff'}}>
      <Modal
        animationType="slide"
        visible={props.notificationModalVisibility}
        onRequestClose={() => {
          props.setNotificationModalVisibility(
            !props.notificationModalVisibility,
          );
        }}>
        <View style={styles.mainViewContainer}>
          <Text variant="headlineMedium" style={{color: '#6750A4'}}>
            Notifications
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 24}}>
            <Image
              source={require('../assets/icons/beaware.png')}
              style={{height: 22, width: 22, marginRight: 6}}
            />
            <Text
              variant="labelMedium"
              style={{color: '#381E72', marginBottom: 2}}>
              Be aware
            </Text>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4}} variant="bodyMedium">
                Notify about new challenges
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250}}
                value={beAwareSwitch1}
                onValueChange={() => {
                  setbeAwareSwitch1(!beAwareSwitch1);
                }}
              />
            </View>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4, width: 250}} variant="bodyMedium">
                Notify about discovery challenge locations near you
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250, marginTop: 10}}
                value={beAwareSwitch2}
                onValueChange={() => {
                  setbeAwareSwitch2(!beAwareSwitch2);
                }}
              />
            </View>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4, width: 250}} variant="bodyMedium">
                App Updates
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250}}
                value={beAwareSwitch3}
                onValueChange={() => {
                  setbeAwareSwitch3(!beAwareSwitch3);
                }}
              />
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 36}}>
            <Image
              source={require('../assets/icons/social.png')}
              style={{height: 22, width: 22, marginRight: 6}}
            />
            <Text
              variant="labelMedium"
              style={{color: '#381E72', marginBottom: 2}}>
              Social
            </Text>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4, width: 220}} variant="bodyMedium">
                Invitations to challenges from others
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250, marginTop: 10}}
                value={socialSwitch1}
                onValueChange={() => {
                  setSocialSwitch1(!socialSwitch1);
                }}
              />
            </View>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4, width: 220}} variant="bodyMedium">
                Know if there are people around to do group challenges
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250, marginTop: 10}}
                value={socialSwitch2}
                onValueChange={() => {
                  setSocialSwitch2(!socialSwitch2);
                }}
              />
            </View>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 36}}>
            <Image
              source={require('../assets/icons/reminders.png')}
              style={{height: 22, width: 22, marginRight: 6}}
            />
            <Text
              variant="labelMedium"
              style={{color: '#381E72', marginBottom: 2}}>
              Reminders
            </Text>
          </View>
          <View style={styles.switchViewContainer}>
            <View>
              <Text style={{marginTop: 4}} variant="bodyMedium">
                Recieve inactivity reminders
              </Text>
              <Switch
                style={{position: 'absolute', marginLeft: 250}}
                value={reminders1}
                onValueChange={() => {
                  setReminders1(!reminders1);
                }}
              />
            </View>
          </View>
          <Button
            mode="text"
            style={{width: 20, marginTop: 125}}
            onPress={() => {
              console.log('back button pressed');
              props.setNotificationModalVisibility(!props.notificationModalVisibility);
            }}>
            {<Text style={{color: '#6750A4'}}>BACK</Text>}
          </Button>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
  switchViewContainer: {
    marginLeft: 42,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
export default NotificationsModal;
