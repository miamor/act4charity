import moment from 'moment';
import React, { PropTypes, Component } from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Image, ScrollView } from 'react-native';
import { Text, ProgressBar, Button, Appbar, useTheme } from 'react-native-paper';
import { DefaultView } from '../components/containers';
import { useGlobals } from '../contexts/global';

import TargetScreenModal from './TargetScreenModal';
/**
 * @param navigation
 * @returns {*}
 * @constructor
 */

function DashboardHomeScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [targetModal, setTargetModalVisibility] = useState(false);
  const [date, setDate] = useState(null);

  useEffect(() => {
    let date = moment().format('MMMM Do, YYYY');
    setDate(date);
  }, []);

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Welcome" color={colors.primary} />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <View style={styles.mainViewContainer}>
          <View style={styles.profileDetailsViewContainer}>
            <Image
              source={require('../assets/icons/placeholder.png')}
              style={{ height: 80, width: 80, borderRadius: 100 }}
            />
            <View style={styles.profileDetailsTextContainer}>
              <Text
                variant="titleLarge"
                style={{ alignSelf: 'flex-start', marginTop: 5 }}>
                {loggedUser.first_name}
              </Text>
              <Text style={{ alignSelf: 'flex-start', marginBottom: 5 }}>
                {date}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              style={{ marginLeft: 10, height: 12, width: 310, marginTop: 14 }}
              progress={0.5}
              color={'#6750A4'}
            />
            <Image
              source={require('../assets/icons/startMedal.png')}
              style={{
                height: 48,
                width: 48,
                marginRight: 10,
                position: 'absolute',
              }}
            />
            <Image
              source={require('../assets/icons/endMedal.png')}
              style={{
                height: 48,
                width: 48,
                position: 'absolute',
                marginLeft: 300,
              }}
            />
          </View>
          <View style={styles.targetButtonContainer}>
            <Button
              onPress={() => {
                console.log('define goals button pressed');
                navigation.navigate('DashboardTarget');
                //open target screen modal here
              }}
              style={{ borderRadius: 12, borderColor: '#6750A4' }}
              contentStyle={styles.targetButtonStyle}
              mode="outlined">
              {
                <Text
                  variant="labelMedium"
                  style={{ color: '#6750A4', height: 56 }}>
                  Define a target!
                </Text>
              }
            </Button>
          </View>
          <Text variant="headlineSmall">Current challenge</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <Image
              source={require('../assets/images/nochallenge.png')}
              style={{ height: 175, width: 175 }}
            />
          </View>
          <View style={styles.challengeButtonContainer}>
            <Button
              onPress={() => {
                console.log('challenge button pressed');
              }}
              style={{ backgroundColor: '#E89C51', borderRadius: 12 }}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  style={{ color: '#FFFFFF', height: 56 }}>
                  Choose a Challenge
                </Text>
              }
            </Button>
          </View>
        </View>
      </ScrollView>

    </DefaultView>
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
  progressBarContainer: {
    height: 48,
  },
  targetButtonContainer: {
    marginTop: 42,
    marginBottom: 48,
  },
  targetButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  challengeButtonContainer: {
    marginTop: 21,
    marginBottom: 48,
  },
});
export default DashboardHomeScreen;
