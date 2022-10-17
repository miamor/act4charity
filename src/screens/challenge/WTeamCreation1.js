import React, {PropTypes, Component} from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Image, Pressable} from 'react-native';
import {ProgressBar, Appbar, useTheme, Text, Button} from 'react-native-paper';
import {DefaultView} from '../../components/containers';

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function WTeamCreation1({navigation}) {
  const {colors} = useTheme();
  const [twoPSelected, setTwoPSelected] = useState(false);
  const [threePSelected, setThreePSelected] = useState(false);
  const [fourPSelected, setFourPSelected] = useState(false);
  const [userNameSelected, setUserNameSelected] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Walk" color={colors.primary} />
        <Image
          source={require('../../../assets/icons/directions_walk.png')}
          style={{
            width: 28,
            height: 28,
            position: 'absolute',
            marginLeft: 340,
            alignSelf: 'center',
          }}
        />
      </Appbar.Header>
      <View style={styles.mainViewContainer}>
        <Text style={{marginTop: 24}} variant="headlineSmall">
          Number of Members
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 48,
          }}>
          {/* first option */}
          <Pressable
            onPress={() => {
              setTwoPSelected(!twoPSelected);
              setThreePSelected(false);
              setFourPSelected(false);
              setSelectedPeople(2);
            }}
            android_ripple={{color: colors.primary}}
            style={
              twoPSelected ? styles.selectedButton : styles.unselectedButton
            }>
            <Text
              variant="titleMedium"
              style={{color: '#000000', marginRight: 8}}>
              2
            </Text>
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26, marginRight: 4}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
          </Pressable>
          {/* second option */}
          <Pressable
            onPress={() => {
              setThreePSelected(!threePSelected);
              setTwoPSelected(false);
              setFourPSelected(false);
              setSelectedPeople(3);
            }}
            android_ripple={{color: colors.primary}}
            style={
              threePSelected ? styles.selectedButton : styles.unselectedButton
            }>
            <Text
              variant="titleMedium"
              style={{color: '#000000', marginRight: 8}}>
              3
            </Text>
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26, marginRight: 4}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
          </Pressable>
        </View>
        <View style={{marginTop: 24}}>
          {/* third option */}
          <Pressable
            onPress={() => {
              setFourPSelected(!fourPSelected);
              setTwoPSelected(false);
              setThreePSelected(false);
              setSelectedPeople(4);
            }}
            android_ripple={{color: colors.primary}}
            style={
              fourPSelected ? styles.selectedButton : styles.unselectedButton
            }>
            <Text
              variant="titleMedium"
              style={{color: '#000000', marginRight: 8}}>
              4
            </Text>
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26, marginRight: 4}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
            <Image
              source={require('../../../assets/icons/person.png')}
              style={{width: 26, height: 26}}
            />
          </Pressable>
        </View>
        <Image
          source={require('../../../assets/icons/divider.png')}
          style={{width: 366, height: 24, alignSelf: 'center', marginTop: 48}}
        />
        <Text style={{marginTop: 24}} variant="headlineSmall">
          Add team members by
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 48,
            justifyContent: 'space-between',
            marginBottom: 48,
          }}>
          <Pressable
            onPress={() => {
              setUserNameSelected(!userNameSelected);
              setLocationSelected(false);
              setSelectedMode('username');
            }}
            android_ripple={{color: colors.primary}}
            style={
              userNameSelected ? styles.selectedButton : styles.unselectedButton
            }>
            <Text
              variant="titleMedium"
              style={{color: '#000000', marginRight: 8}}>
              Username
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setUserNameSelected(false);
              setLocationSelected(!locationSelected);
              setSelectedMode('location');
            }}
            android_ripple={{color: colors.primary}}
            style={
              locationSelected ? styles.selectedButton : styles.unselectedButton
            }>
            <Text
              variant="titleMedium"
              style={{color: '#000000', marginRight: 8}}>
              Nearby
            </Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <View style={styles.challengeButtonContainer}>
            <Button
              onPress={() => {
                console.log('next');
              }}
              style={{backgroundColor: '#ffffff', borderRadius: 12}}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  style={{color: colors.primary, height: 56}}>
                  BACK
                </Text>
              }
            </Button>
          </View>
          <View style={styles.challengeButtonContainer}>
            <Button
              onPress={() => {
                console.log('next');
                navigation.navigate('WTeamCreation2', {
                  numberOfPeople: selectedPeople,
                  selectedMode: selectedMode,
                });
              }}
              style={{backgroundColor: '#E89C51', borderRadius: 12}}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  style={{color: '#FFFFFF', height: 56}}>
                  NEXT
                </Text>
              }
            </Button>
          </View>
        </View>
      </View>
    </DefaultView>
  );
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 18,
    marginRight: 18,
    backgroundColor: '#ffffff',
    height: 800,
  },
  unselectedButton: {
    flexDirection: 'row',
    borderColor: '#6750A4',
    borderWidth: 2,
    borderRadius: 12,
    height: 48,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedButton: {
    flexDirection: 'row',
    borderColor: '#6750A4',
    borderWidth: 2,
    borderRadius: 12,
    height: 48,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8DEF8',
  },
  targetButtonStyle: {
    height: 48,
    alignContent: 'center',
    justifyContent: 'space-around',
  },
  challengeButtonContainer: {
    marginTop: 21,
    marginBottom: 48,
    width: 180,
  },
});
export default WTeamCreation1;
