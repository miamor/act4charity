import React, { PropTypes, Component } from 'react';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Text, ProgressBar, Button} from 'react-native-paper';

import LogOutModal from '../components/LogOutModal';
import NotificationsModal from '../components/NotificationsModal';
import HelpModal from '../components/HelpModal';
import FeedbackModal from '../components/FeedbackModal';

function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [targetModal, setTargetModalVisibility] = useState(false);
  const [notificationsModal, setNotificationsModalVisibility] = useState(false);
  const [helpModal, setHelpModalVisibility] = useState(false);
  const [feedbackModal, setFeedbackModalVisibility] = useState(false);
  const [personalInformationModal, setPersonalInformationModal] = useState(false);
  
  return (
    <ScrollView style={{backgroundColor: '#ffffff'}}>
      <View style={styles.mainViewContainer}>
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
        <Text variant="headlineMedium" style={{color: '#6750A4'}}>
          Profile
        </Text>
        <View style={styles.profileDetailsViewContainer}>
          <Image
            source={require('../assets/icons/placeholder.png')}
            style={{height: 80, width: 80, borderRadius: 100}}
          />
          <View style={styles.profileDetailsTextContainer}>
            <Text
              variant="titleLarge"
              style={{alignSelf: 'flex-start', marginTop: 5}}>
              Hermione Granger
            </Text>
            <Text style={{alignSelf: 'flex-start', marginBottom: 5}}>
              Bronze Member
            </Text>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 12}}>
          <Image
            source={require('../assets/icons/settings.png')}
            style={{height: 22, width: 22, marginRight: 6}}
          />
          <Text variant="labelMedium" style={{color: '#381E72'}}>
            Settings
          </Text>
        </View>
        <View style={{marginLeft: 32, marginTop: 16}}>
          <TouchableOpacity
            style={{flexDirection: 'row', justifyContent: 'space-between'}}
            onPress={() => {
              console.log('personal information clicked');
              navigation.navigate('ProfilePersonalInfo');
            }}>
            <Text variant="bodyMedium">Personal Information</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
            onPress={() => {
              console.log('notifications clicked');
              setNotificationsModalVisibility(!notificationsModal);
            }}>
            <Text variant="bodyMedium">Notifications</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
            onPress={() => {
              console.log('interests clicked');
            }}>
            <Text variant="bodyMedium">Interests</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
            onPress={() => {
              console.log('Target clicked');
              setTargetModalVisibility(!targetModal);
            }}>
            <Text variant="bodyMedium">Target</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 22}}>
          <Image
            source={require('../assets/icons/support.png')}
            style={{height: 22, width: 22, marginRight: 6}}
          />
          <Text variant="labelMedium" style={{color: '#381E72'}}>
            Support
          </Text>
        </View>
        <View style={{marginLeft: 32, marginTop: 16}}>
          <TouchableOpacity
            style={{flexDirection: 'row', justifyContent: 'space-between'}}
            onPress={() => {
              console.log('help clicked');
              setHelpModalVisibility(!helpModal);
            }}>
            <Text variant="bodyMedium">Help</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
            onPress={() => {
              console.log('feedback clicked');
              setFeedbackModalVisibility(!feedbackModal);
            }}>
            <Text variant="bodyMedium">Feedback</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 22}}>
          <Image
            source={require('../assets/icons/legal.png')}
            style={{height: 22, width: 22, marginRight: 6}}
          />
          <Text variant="labelMedium" style={{color: '#381E72'}}>
            Support
          </Text>
        </View>
        <View style={{marginLeft: 32, marginTop: 16}}>
          <TouchableOpacity
            style={{flexDirection: 'row', justifyContent: 'space-between'}}
            onPress={() => {
              console.log('tos clicked');
            }}>
            <Text variant="bodyMedium">Terms of Service</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 16,
            }}
            onPress={() => {
              console.log('privacy policy clicked');
              setModalVisible(!modalVisible);
            }}>
            <Text variant="bodyMedium">Privacy Policy</Text>
            <Image
              source={require('../assets/icons/rightArrow.png')}
              style={{height: 22, width: 22}}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Button
        mode="text"
        style={{width: 100, marginTop: 12}}
        onPress={() => {
          console.log('logout button pressed');
          setModalVisible(!modalVisible);
        }}>
        {
          <Text style={{color: '#6750A4', textDecorationLine: 'underline'}}>
            Log Out
          </Text>
        }
      </Button>
    </ScrollView>
  );
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
});

export default ProfileScreen;
