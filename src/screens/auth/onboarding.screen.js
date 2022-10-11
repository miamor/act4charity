import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Animated,
  Image,
  Text,
  useWindowDimensions,
} from 'react-native';
import {Button} from 'react-native-paper';

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

const {width, height} = Dimensions.get('window');

function OnboardingScreen({navigation}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scorllX = useRef(new Animated.Value(0)).current;
  const itemRef = useRef(null);
  const viewableItemChanged = useRef(({viewableItems}) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;
  const {width} = useWindowDimensions();
  const {height} = useWindowDimensions();
  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <FlatList
          data={onboardings}
          renderItem={({item}) => (
            <View style={[styles.container, {width}]}>
              <Image
                source={item.image}
                style={[
                  styles.image,
                  {
                    width: width,
                    resizeMode: 'contain',
                  },
                ]}
              />
              <View>
                <Text style={[styles.title, {width}]}>{item.title}</Text>
                <Text style={[styles.description, {width}]}>
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
            [{nativeEvent: {contentOffset: {x: scorllX}}}],
            {useNativeDriver: false},
          )}
          onViewableItemsChanged={viewableItemChanged}
          viewabilityConfig={viewConfig}
          ref={itemRef}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          height: 32,
          justifyContent: 'center',
          alignContent: 'center',
          position: 'relative',
          bottom: height > 700 ? '30%' : '20%',
        }}>
        {onboardings.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const dotWidth = scorllX.interpolate({
            inputRange,
            outputRange: [10, 10, 10],
            extrapolate: 'clamp',
          });
          const opacity = scorllX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              style={[styles.dot, {width: 10, opacity}]}
              key={i.toString()}
              scorllX={scorllX}
            />
          );
        })}
      </View>
      <View
        style={{
          paddingBottom: 32,
          paddingHorizontal: 24,
          borderRadius: 12,
          position: 'relative',
        }}>
        <Button mode="contained" onPress={() => console.log('Pressed')}>
          Get started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
  image: {
    justifyContent: 'center',
    flex: 0.9,
  },
  title: {
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
    bottom: '28%',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 8,
    backgroundColor: '#9A82DB',
    borderColor: '#6750A4',
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
    marginBottom: '11.5%',
    marginHorizontal: 0.057 * Dimensions.get('window').width,
    borderRadius: 12,
    position: 'relative',
    height: 0.0625 * Dimensions.get('screen').height,
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
