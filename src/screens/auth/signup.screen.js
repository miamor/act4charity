import React from 'react';
import {Text, View, Pressable, StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

function SignupScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <View style={styles.brandView}>
          <Text
            style={{
              fontSize: 28,
              lineHeight: 36,
              color: '#6750A4',
            }}>
            LOGO
          </Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        <View style={styles.innerBottomView}>
          <Text style={styles.heading}>Hello world</Text>
          <View style={styles.formView}></View>
          {/* <TextInput
            style={styles.textInput}
            placeholder="Username"
            placeholderTextColor="#49454F"
            backgroundColor="#FFFFFF"
            outlineColor="rgba(121, 116, 126, 1)"
          />
          {/* <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="#49454F"
            backgroundColor="#FFFFFF"></TextInput>
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#49454F"
            backgroundColor="#FFFFFF"
            secureTextEntry={true}></TextInput> */}
          <View style={styles.buttonView}>
            <Pressable style={styles.buttonStyle}>
              <Text style={styles.buttonTitle}>Signup</Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
            }}>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(98, 91, 113, 1)',
              }}
            />
            <View>
              <Text
                style={{textAlign: 'center', color: 'rgba(103, 80, 164, 1)'}}>
                or register with
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: 'rgba(98, 91, 113, 1)',
              }}
            />
          </View>
          <View style={styles.buttonView}>
            <Pressable style={styles.registerButton}>
              <Text style={styles.registerTitle}>Google</Text>
            </Pressable>
          </View>
          <View style={styles.buttonView}>
            <Pressable style={styles.registerButton}>
              <Text style={styles.registerTitle}>Facebook</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(103, 80, 164, 0.14)',
  },
  topView: {
    height: '15%',
    width: '100%',
  },
  brandView: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
  bottomView: {
    width: '100%',
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  innerBottomView: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 80,
  },
  heading: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400',
    fontFamily: 'Roboto',
    textAlign: 'left',
    color: '#6750A4',
  },
  formView: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  textInput: {
    marginTop: 24,
    height: 56,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  buttonView: {
    marginTop: 24,
  },
  buttonTitle: {
    fontFamily: 'Roboto',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 0.1,
    color: 'rgba(255, 255, 255, 1)',
  },
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    backgroundColor: '#6750A4',
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderColor: 'rgba(98, 91, 113, 1)',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  registerTitle: {
    color: '#6750A4',
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
});

export default SignupScreen;
