import React from 'react';
import useState from 'react';
import { StyleSheet, View, Dimensions, FlatList } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { DefaultView } from '../../components/containers';

const { height, width } = Dimensions.get('screen');

const icons = {
  walk: require('../../../assets/icons/walk_icon.png'),
  discovery: require('../../../assets/icons/discover_icon.png'),
};

const challengeTypes = [
  {
    id: 1,
    title: 'Walk',
    image: icons.walk,
  },
  {
    id: 2,
    title: 'Discover',
    image: icons.discovery,
  },
];

const popularChallenges = [
  { id: 1, title: 'Walk 1 km', image: icons.walk },
  { id: 2, title: 'Walk 1.5 km', image: icons.walk },
  { id: 3, title: 'Discover 1 km', image: icons.discovery },
  { id: 4, title: 'Discover 2 km', image: icons.discovery },
  { id: 5, title: 'Walk 1.25 km', image: icons.walk },
  { id: 6, title: 'Discover 3 km', image: icons.discovery },
];

function ChallengeSelectScreen({ navigation }) {
  const { colors } = useTheme();

  return (
    <DefaultView>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.titleStyle}>Challenge</Text>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Choose your challenge type</Text>
      </View>
      <View>
        <FlatList
          data={challengeTypes}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-around',
          }}
          style={styles.challengeTypeContainer}
          renderItem={({ item }) => (
            <Button
              mode="outlined"
              icon={item.image}
              style={styles.singleTypeButton}
              labelStyle={styles.singleTypeButtonLabel}
              contentStyle={styles.singleTypeButtonContent}
              onPress={() => {
                navigation.navigate(ChallengeMode);
              }}>
              {item.title}
            </Button>
          )}></FlatList>
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Popular challenges near you</Text>
      </View>
      <View style={styles.popularChallengesConatiner}>
        <FlatList
          data={popularChallenges}
          style={styles.popularChallengesList}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({ item }) => {
            //Need to modify the horizontal "space-between", but not working
            return (
              <Button
                mode="outlined"
                icon={item.image}
                style={styles.singlePopularChallengeButton}
                contentStyle={styles.singlePopularChallengeButtonContent}
                labelStyle={styles.singlePopularChallengeButtonLabel}
                onPress={item => {
                  navigation.navigate(ChallengeMode);
                }}>
                {item.title}
              </Button>
            );
          }}></FlatList>
      </View>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  screenTitleContainer: {
    marginTop: 0.0535 * height,
    marginHorizontal: 0.058 * width,
    height: 44,
  },
  titleStyle: {
    fontSize: 36,
    color: '#6750A4',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 44,
  },
  instructionContainer: {
    marginTop: 0.0535 * height,
    marginLeft: 0.058 * width,
    height: 32,
  },
  instructionText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 32,
  },
  challengeTypeContainer: {
    height: 0.242 * height,
    marginHorizontal: 0.058 * width,
  },
  singleTypeButton: {
    marginTop: 0.0535 * height,
    height: 0.067 * height,
    borderColor: '#6750A4',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
  },
  singleTypeButtonLabel: {
    height: 33,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 28,
    lineHeight: 36,
    textAlign: 'center',
    color: '#000000',
    width: 0.43 * width,
  },
  singleTypeButtonContent: {
    marginLeft: 0.14 * width,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  popularChallengesConatiner: {
    marginTop: 0.0535 * height,
    marginHorizontal: 0.058 * width,
    height: 0.214 * height,
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },
  popularChallengesList: {
    flexDirection: 'row',
    alignContent: 'space-between',
  },
  singlePopularChallengeButton: {
    height: 0.0535 * height,
    width: 0.418 * width,
    borderColor: '#6750A4',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    marginHorizontal: 0.012 * width,
  },
  singlePopularChallengeButtonContent: {
    marginRight: 0.02 * width,
    justifyContent: 'row',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  singlePopularChallengeButtonLabel: {
    width: 0.258 * width,
    height: 22,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: width > 400 ? 16 : 13,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.1,
    color: '#000000',
  },
});
export default ChallengeSelectScreen;
