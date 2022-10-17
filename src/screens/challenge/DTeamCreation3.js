import React, {PropTypes, Component} from 'react';
import {useEffect, useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Pressable,
  KeyboardAvoidingView,
} from 'react-native';
import {
  ProgressBar,
  Appbar,
  useTheme,
  Text,
  Button,
  TextInput,
} from 'react-native-paper';
import {DefaultView} from '../../components/containers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function DTeamCreation3({navigation, route}) {
  const {colors} = useTheme();
  const {numberOfPeople, username1, username2, username3, selectedMode} = route.params;
  const NumberComponent = () => {
    if (numberOfPeople == '2') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            variant="titleMedium"
            style={{color: colors.primary, marginRight: 4}}>
            {numberOfPeople}
          </Text>
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
        </View>
      );
    } else if (numberOfPeople == '3') {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            variant="titleMedium"
            style={{color: colors.primary, marginRight: 4}}>
            {numberOfPeople}
          </Text>
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
        </View>
      );
    } else {
      return (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            variant="titleMedium"
            style={{color: colors.primary, marginRight: 4}}>
            {numberOfPeople}
          </Text>
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
          <Image
            source={require('../../../assets/icons/person_purple.png')}
            style={{width: 26, height: 26, marginRight: 4}}
          />
        </View>
      );
    }
  };
  const UserNameComponent = () => {
    if (numberOfPeople == '2') {
      return (
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 48}}>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            User1
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username1}
          </Text>
        </View>
      );
    } else if (numberOfPeople == '3') {
      return (
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 48}}>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            User1
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username1}
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username2}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 48}}>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            User1
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username1}
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username2}
          </Text>
          <Text variant="labelLarge" style={{marginTop: 12, marginBottom: 12, color: colors.primary}}>
            {username3}
          </Text>
        </View>
      );
    }
  };
  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Discover" color={colors.primary} />
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
      <KeyboardAwareScrollView>
        <View style={styles.mainViewContainer}>
          <Text
            style={{marginTop: 24, marginBottom: 48}}
            variant="headlineSmall">
            Your team
          </Text>
          <NumberComponent />
          <Text
            style={{marginTop: 48, marginBottom: 48}}
            variant="headlineSmall">
            Team Members
          </Text>
          <UserNameComponent />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={styles.challengeButtonContainer}>
              <Button
                onPress={() => {
                  console.log('back');
                  navigation.goBack();
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
      </KeyboardAwareScrollView>
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
export default DTeamCreation3;
