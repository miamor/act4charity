import React, { useGlobals, useState } from 'react'
import {
  View,
  Pressable,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native'
import { TextInput, Button, useTheme } from 'react-native-paper'
import { Text } from '../../components/paper/typos'
import * as Yup from 'yup'
import { Formik } from 'formik'
import * as authAPI from '../../services/authAPI'
import Loading from '../../components/animations/loading'
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin'

function SigninScreen({ navigation }) {
  // GoogleSignin.configure()

  // signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices()
  //     const userInfo = await GoogleSignin.signIn()
  //     this.setState({userInfo})
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // }

  // const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [isSecureEntry, setIsSecureEntry] = useState(true)

  const SignInSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  })

  const _onSubmit = values => {
    setLoading(true)

    authAPI.onAuthenticate(values).then((res) => {
      if (res.status === 'error') {
        ToastAndroid.show(res.message, ToastAndroid.SHORT)
        setErrors({ api: res.message })
        return
      }

      authAPI.onAuthenticate(values).then((res) => {
        setLoading(false)
        navigation.navigate('Auth', res.data)
      }).catch(error => {
        setLoading(false)
        // console.error(error)
        ToastAndroid.show(error, ToastAndroid.SHORT)
      })
    }).catch(error => {
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  return (
    <View style={styles.container}>
      {loading && <Loading />}

      <View style={styles.topView}>
        <Image
          source={require('../../../assets/images/signup.png')}
          style={{
            width: 1 * Dimensions.get('screen').width,
            height: 0.35 * Dimensions.get('window').height,
          }}
        />
      </View>
      <View style={styles.bottomView}>
        <View style={styles.innerBottomView}>
          <Text style={styles.heading}>Login</Text>
          <Formik
            validationSchema={SignInSchema}
            initialValues={{
              username: '',
              password: '',
            }}
            onSubmit={values => _onSubmit(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
            }) => (
              <View style={styles.formView}>
                <View style={styles.inputContainer}>
                  <TextInput
                    name="username"
                    style={styles.textInput}
                    placeholder="Username"
                    placeholderTextColor="#49454F"
                    backgroundColor="#FFFFFF"
                    outlineColor="rgba(121, 116, 126, 1)"
                    underlineColor="transparent"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                  {errors.username && (
                    <View style={styles.errorMessageContainer}>
                      <Text style={styles.errorMessageText}>
                        {errors.username}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.inputContainer}>
                  <TextInput
                    name="password"
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#49454F"
                    backgroundColor="#FFFFFF"
                    secureTextEntry={isSecureEntry}
                    underlineColor="transparent"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    right={
                      <TextInput.Icon
                        icon={
                          isSecureEntry
                            ? require('../../../assets/icons/visibility_on.png')
                            : require('../../../assets/icons/visibility_off.png')
                        }
                        onPress={() => setIsSecureEntry(!isSecureEntry)}
                      />
                    }
                  />
                  {errors.password && (
                    <View style={styles.errorMessageContainer}>
                      <Text style={styles.errorMessageText}>
                        {errors.password}
                      </Text>
                    </View>
                  )}
                </View>
                <Button mode="contained"
                  style={styles.buttonView}
                  labelStyle={{ paddingVertical: 5 }}
                  disabled={!isValid}
                  // buttonColor={
                  //   isValid
                  //     ? 'rgba(255, 255, 255, 1)'
                  //     : 'rgba(31, 31, 31, 0.12)'
                  // }
                  onPress={handleSubmit}>
                  Login
                </Button>
              </View>
            )}
          </Formik>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 0.025 * Dimensions.get('screen').height,
            marginBottom: 0.025 * Dimensions.get('screen').height,
          }}>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: 'rgba(98, 91, 113, 1)',
            }} />
            <Text style={{
              textAlign: 'center',
              color: 'rgba(103, 80, 164, 1)',
              width: 100,
              marginTop: -9
            }}>
              or login with
            </Text>
            <View style={{
              flex: 1,
              height: 1,
              backgroundColor: 'rgba(98, 91, 113, 1)',
            }} />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.registerButton} onPress={() => { }}>
              <Image
                style={styles.registerIcon}
                source={require('../../../assets/icons/googleicon.png')}
              />
              <Text style={styles.registerTitle}>Google</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.registerButton} onPress={() => { }}>
              <Image
                style={styles.registerIcon}
                source={require('../../../assets/icons/facebookicon.png')}
              />
              <Text style={styles.registerTitle}>Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomLineContainer}>
          <Text style={styles.bottomLineText}>Don't have an account? </Text>
          <TouchableOpacity
            mode="text"
            onPress={() => {
              navigation.navigate('Signup')
            }}>
            <Text style={[styles.bottomLineText, { color: '#6750A4' }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
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
    marginTop: 0.025 * Dimensions.get('window').height,
  },
  inputContainer: {
    // height: 0.0975 * Dimensions.get('window').height,
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  textInput: {
    height: 0.0625 * Dimensions.get('window').height,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  errorMessageContainer: {
    // height: 0.025 * Dimensions.get('window').height,
    // marginBottom: 10,
    marginTop: -2,
    marginBottom: -8,
    justifyContent: 'center',
  },
  errorMessageText: {
    color: 'red',
    fontSize: 12,
    textAlignVertical: 'center',
  },
  buttonView: {
    // marginBottom: 0.025 * Dimensions.get('window').height,
    // width: '100%',
    marginBottom: 20
  },
  buttonTitle: {
    // height: '100%',
    // width: '100%',
    // fontFamily: 'Roboto',
    // fontSize: 14,
    // lineHeight: 20,
    // fontWeight: '500',
    // alignItems: 'center',
    // textAlign: 'center',
    // textAlignVertical: 'center',
    // letterSpacing: 0.1,
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    // height: 0.0625 * Dimensions.get('window').height,
    borderRadius: 12,
    backgroundColor: '#E89C51',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 0.0625 * Dimensions.get('window').height,
    borderRadius: 12,
    borderColor: 'rgba(121, 116, 126, 1)',
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
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#6750A4',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  bottomLineContainer: {
    // height: 0.025 * Dimensions.get('window').height,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
  // bottomLineText: {
  //   fontFamily: 'Roboto',
  //   fontWeight: '400',
  //   fontSize: 14,
  //   linnHeight: 20,
  //   letterSpacing: 0.25,
  //   color: '#000000',
  // },
})

export default SigninScreen
