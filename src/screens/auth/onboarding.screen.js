import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import { Button } from 'react-native-paper';

const onboardings = [
  {
    id: '1',
    title: 'Select challenges',
    description: 'according to your interests',
    image: require('../../components/decorations/images/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Raise money',
    description: 'bigger the challenge bigger the collection',
    image: require('../../components/decorations/images/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Help others',
    description: 'your rewards are donations to charitable organizations',
    image: require('../../components/decorations/images/onboarding3.png'),
  },
];

const { width, height } = Dimensions.get('window');

function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scorllX = useRef(new Animated.Value(0)).current;
  const itemRef = useRef(null);
  const viewableItemChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
  const { width, height } = Dimensions.get('window');

  //TODO: ask for gif, resize, text baseline
  return (
    <View style={styles.container}>
      <View style={[styles.flatListContainer, { flex: 0.9 }]}>
        <FlatList
          data={onboardings}
          renderItem={({ item }) => (
            <View style={[styles.singleItemContainer, { flexDirection: 'column', width: width }]}>
              <View style={[styles.imageContainer, { flex: 0.8 }]}>
                <Image source={item.image} style={styles.image} />
              </View>
              <View style={[styles.textContainer, { flex: 0.15 }]}>
                <Text style={[styles.title, { width }]}>{item.title}</Text>
                <Text style={[styles.description, { width }]}>
                  {item.description}
                </Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scorllX } } }],
            { useNativeDriver: false },
          )}
          onViewableItemsChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          ref={itemRef}
        />
      </View>
      <View style={[styles.dotContainer]}>
        {onboardings.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scorllX.interpolate({
            inputRange,
            outputRange: [10, 10, 10],
            extrapolate: 'clamp',
          });
          const opacity = scorllX.interpolate({
            inputRange,
            outputRange: [0.1, 1, 0.1],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              //TO DO: fix the dots color (opacity)
              style={[styles.dot, { width: 10, opacity }]}
              key={i.toString()}
              scorllX={scorllX}
            />
          );
        })}
      </View>

      <View style={{ flex: 0.1, marginHorizontal: 20 }}>
        <Button style={styles.buttonContainer}
          mode="contained"
          onPress={() => {
            navigation.navigate('Signup');
          }}
          buttonColor="#E89C51"
          labelStyle={styles.buttonText}>
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  flatListContainer: {
    width: width,
    height: 0.795 * height,
  },
  singleItemContainer: {
    width: '100%',
    height: '100%',
    paddingTop: 0.05 * height,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  imageContainer: {
    width: 0.885 * width,
    height: 0.6 * height,
    alignSelf: 'center',
  },
  image: {
    width: 0.885 * width,
    height: 0.6 * height,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textContainer: {
    // height: 0.08 * height,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.1,
    textAlign: 'center',
    color: '#000000',
    alignSelf: 'stretch',
  },
  description: {
    width: '100%',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    textAlign: 'center',
    color: '#000000',
    paddingHorizontal: 64,
    alignSelf: 'stretch',
  },
  dotContainer: {
    flexDirection: 'row',
    height: 32,
    justifyContent: 'center',
    alignContent: 'center',
    // bottom: '28%',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    // backgroundColor: '#9A82DB',
    backgroundColor: '#6750A4a2',
    borderColor: '#6750A4a2',
    borderWidth: 2,
  },
  // TODO: How to implement?
  // dotOpacity: {
  //   height: 10,
  //   borderRadius: 5,
  //   marginHorizontal: 8,
  //   backgroundColor: 'white',
  //   borderColor: '#B0A7C0',
  //   borderWidth: 2,
  // },
  buttonContainer: {
    // marginBottom: '11.5%',
    // marginHorizontal: 0.057 * Dimensions.get('window').width,
    // borderRadius: 12,
    // position: 'relative',
    // height: 0.0625 * Dimensions.get('screen').height,
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 0.1,
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;
