import React from 'react';
import {View, Image, StyleSheet, useWindowDimensions} from 'react-native';

const width = useWindowDimensions().width;

function SplashScreen() {
  return (
    <View style={styles.background}>
      <View style={styles.imageConatiner}>
        <Image
          style={styles.image}
          source={require('../../components/decorations/images/splash.png')}></Image>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {backgroundColor: '#6750A4'},
  imageConatiner: {
    position: 'relative',
    top: '14.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {resizeMode: 'contain', width: 0.91 * width, height: 0.91 * width},
});
export default SplashScreen;
