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
function DTeamCreation2({navigation, route}) {
  const {colors} = useTheme();
  const {numberOfPeople, selectedMode} = route.params;
  const [username1, setUserName1] = useState('');
  const [username2, setUserName2] = useState('');
  const [username3, setUserName3] = useState('');
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
            Number of Members
          </Text>
          <NumberComponent />
          <Text
            style={{marginTop: 48, marginBottom: 48}}
            variant="headlineSmall">
            Add team members by {selectedMode}
          </Text>
          {/* <UserNameComponent /> */}
          {/* <TextInput value={username1} onChangeText={username1 => setUserName1(username1)}/> */}
          {numberOfPeople == '2' && (
            <View>
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 1 Username"
                placeholder="Team Member 1 Username"
                value={username1}
                onChangeText={username1 => setUserName1(username1)}
              />
            </View>
          )}
          {numberOfPeople == '3' && (
            <View>
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 1 Username"
                placeholder="Team Member 1 Username"
                value={username1}
                onChangeText={username1 => setUserName1(username1)}
              />
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 2 Username"
                placeholder="Team Member 2 Username"
                value={username2}
                onChangeText={username2 => setUserName2(username2)}
              />
            </View>
          )}
          {numberOfPeople == '4' && (
            <View>
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 1 Username"
                placeholder="Team Member 1 Username"
                value={username1}
                onChangeText={username1 => setUserName1(username1)}
              />
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 2 Username"
                placeholder="Team Member 2 Username"
                value={username2}
                onChangeText={username2 => setUserName2(username2)}
              />
              <TextInput
                style={{marginTop: 12, marginBottom: 12}}
                mode="outlined"
                label="Team Member 3 Username"
                placeholder="Team Member 3 Username"
                value={username3}
                onChangeText={username3 => setUserName3(username3)}
              />
            </View>
          )}
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
                  navigation.navigate('DTeamCreation3', {
                    numberOfPeople: numberOfPeople,
                    username1: username1,
                    username2: username2,
                    username3: username3,
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
export default DTeamCreation2;
