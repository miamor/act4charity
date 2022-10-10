import React, {useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, ToastAndroid} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {Text, H2} from '../../components/paper/typos';
import {DefaultView} from '../../components/containers';
import SpaceSky from '../../components/decorations/space-sky';
import CustomInput from '../../components/paper/custom-input';
import {useGlobals} from '../../contexts/global';
import {Backgrounds} from '../../svgs';
import Aquarius from '../../svgs/Aquarius';

import * as Yup from 'yup';
import {Formik} from 'formik';
import * as authAPI from '../../services/authAPI';
import axios from 'axios';

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function LoginScreen({navigation}) {
  const [{session, loggedUser}, dispatch] = useGlobals();
  // const [username, setUsername] = React.useState()
  // const [password, setPassword] = React.useState()
  const {colors} = useTheme();
  // const buttonDisabled = !username || username.length < 2

  useEffect(() => {});

  const LoginSchema = Yup.object().shape({
    // username: Yup.string().username('Username must be a valid username address').required('Username is required'),
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const _onSubmit = values => {
    authAPI
      .onAuthenticate(values)
      .then(res => {
        // console.log(res)
        // navigation.navigate('Auth', res)
        if (res.status == 'error') {
          ToastAndroid.show(res.message, ToastAndroid.SHORT);
        } else {
          navigation.navigate('Auth', res.data);
        }
      })
      .catch(error => {
        console.error(error);
        ToastAndroid.show('Oops', ToastAndroid.SHORT);
      });
  };

  return (
    <DefaultView>
      <SpaceSky level={1} />
      <Aquarius width={100} height={100} style={styles.aquarius} />
      <Backgrounds.Constellation
        color={colors.text}
        dotColor={colors.primary}
        height={220}
        width={220}
        style={styles.constellation}
      />
      <View style={{flex: 0.5}} />
      <H2 style={{textAlign: 'center', color: colors.primary, fontSize: 30}}>
        Act4Charity
      </H2>
      <Formik
        validationSchema={LoginSchema}
        initialValues={{username: '', password: ''}}
        onSubmit={values => _onSubmit(values)}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
        }) => (
          <View style={{paddingHorizontal: 20}}>
            <View style={styles.inputContainer}>
              <CustomInput
                name="username"
                placeholder="Username"
                style={styles.textInput}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                customStyle={{
                  fontSize: 16,
                  flex: 1,
                  marginLeft: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  textAlign: 'left',
                }}
                // keyboardType="email-address"
              />
              {errors.username && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.username}
                </Text>
              )}
            </View>
            <View style={styles.inputContainer}>
              <CustomInput
                name="password"
                placeholder="Password"
                style={styles.textInput}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                customStyle={{
                  fontSize: 16,
                  flex: 1,
                  marginLeft: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                  textAlign: 'left',
                }}
              />
              {errors.password && (
                <Text style={{fontSize: 10, color: 'red'}}>
                  {errors.password}
                </Text>
              )}
            </View>

            <View style={{marginTop: 30}}>
              <Button
                mode="contained"
                disabled={!isValid}
                onPress={handleSubmit}
                style={{
                  borderRadius: 30,
                }}
                labelStyle={{
                  paddingVertical: 5,
                }}>
                Login
              </Button>

              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                style={{
                  marginTop: 15,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text>Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  constellation: {
    zIndex: 0,
    position: 'absolute',
    bottom: 20,
    left: 20,
    opacity: 0.15,
  },
  aquarius: {
    zIndex: 0,
    position: 'absolute',
    top: 20,
    right: 20,
    opacity: 0.1,
  },
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    backgroundColor: '#e6e6e6',
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
});

export default LoginScreen;
