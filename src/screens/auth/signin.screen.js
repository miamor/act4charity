import React from 'react';
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

function SigninScreen({navigation}) {
  GoogleSignin.configure();

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({userInfo});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Image
          source={require('../../components/decorations/images/signup.png')}
          style={{
            width: 1 * Dimensions.get('screen').width,
            height: 0.35 * Dimensions.get('window').height,
          }}
        />
      </View>
      <View style={styles.bottomView}>
        <View style={styles.innerBottomView}>
          <Text style={styles.heading}>Login</Text>
          <View style={styles.formView}>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              placeholderTextColor="#49454F"
              backgroundColor="#FFFFFF"
              outlineColor="rgba(121, 116, 126, 1)"
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#49454F"
              backgroundColor="#FFFFFF"
              secureTextEntry={true}></TextInput>
            <Button
              style={[styles.buttonView, styles.buttonStyle]}
              mode="contained"
              labelStyle={styles.buttonTitle}
              onPress={() => {
                navigation.navigate('Interest');
              }}>
              Login
            </Button>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              height: 0.025 * Dimensions.get('window').height,
              marginTop: 0.025 * Dimensions.get('window').height,
            }}>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(98, 91, 113, 1)',
              }}
            />
            <Text style={{textAlign: 'center', color: 'rgba(103, 80, 164, 1)'}}>
              or login with
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(98, 91, 113, 1)',
              }}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => {
                signIn();
              }}>
              <Image
                style={styles.registerIcon}
                source={require('../../components/decorations/images/googleicon.png')}
              />
              <Text style={styles.registerTitle}>Google</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <Pressable style={styles.registerButton}>
              <Image
                style={styles.registerIcon}
                source={require('../../components/decorations/images/facebookicon.png')}
              />
              <Text style={styles.registerTitle}>Facebook</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.bottomLineContainer}>
          <Text style={styles.bottomLineText}>Don't have an account? </Text>
          <Pressable
            mode="text"
            onPress={() => {
              navigation.navigate('Signup');
            }}>
            <Text style={[styles.bottomLineText, {color: '#6750A4'}]}>
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  topView: {
    height: 0.3 * Dimensions.get('window').height,
    width: '100%',
    justifyContent: 'center',
  },
  bottomView: {
    width: '100%',
    height: 0.7 * Dimensions.get('window').height,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    justifyContent: 'flex-start',
  },
  innerBottomView: {
    paddingHorizontal: 0.06 * Dimensions.get('screen').width,
    paddingTop: 0.025 * Dimensions.get('screen').height,
  },
  heading: {
    fontSize: 36,
    lineHeight: 0.05 * Dimensions.get('screen').height,
    fontWeight: '400',
    fontFamily: 'Roboto',
    textAlign: 'left',
    color: '#6750A4',
  },
  formView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  textInput: {
    marginTop: 0.025 * Dimensions.get('screen').height,
    height: 0.0625 ** Dimensions.get('screen').height,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  buttonView: {
    marginTop: 0.025 * Dimensions.get('window').height,
    width: '100%',
  },
  buttonTitle: {
    height: '100%',
    width: '100%',
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    alignItems: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 0.1,
    color: 'rgba(255, 255, 255, 1)',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 0.0625 * Dimensions.get('window').height,
    borderRadius: 12,
    backgroundColor: '#E89C51',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 0.0625 * Dimensions.get('screen').height,
    borderRadius: 12,
    borderColor: '#79747E',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  registerIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    paddingHorizontal: 16,
  },
  registerTitle: {
    color: '#6750A4',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bottomLineContainer: {
    height: 0.025 * Dimensions.get('screen').height,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    bottom: -0.02 * Dimensions.get('window').height,
  },
  bottomLineText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    linnHeight: 20,
    letterSpacing: 0.25,
    color: '#000000',
  },
});

export default SigninScreen;
