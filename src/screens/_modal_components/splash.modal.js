import React from 'react'
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native'
import { Text } from '../../components/paper/typos'

function SplashModal(props) {
  setTimeout(() => {
    // navigation.navigate('Onboarding')
    props.onFinishSpash()
  }, 1500);
  return (
    <View style={styles.background}>
      <View style={styles.imageConatiner}>
        <Image
          style={{
            resizeMode: 'contain',
            width: '90%',
          }}
          source={require('../../../assets/images/splash.png')}></Image>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#6750A4',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  imageConatiner: {
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    bottom: '35%',
  },
})

export default SplashModal
