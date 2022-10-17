import React from 'react';
import {useState} from 'react';
import {StyleSheet, View, Dimensions, FlatList, Image} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {DefaultView} from '../../components/containers';

const {height, width} = Dimensions.get('screen');

const distances = [
  {id: 1, title: '1 km', selected: false},
  {id: 2, title: '1.25 km', selected: false},
  {id: 3, title: '1.5 km', selected: false},
  {id: 4, title: '2 km', selected: false},
  {id: 5, title: '2.5 km', selected: false},
  {id: 6, title: 'Custom', selected: false},
];

const interests = [
  {
    id: 1,
    title: 'Animals',
    image: require('../../assets/icons/interest_animal.png'),
    selected: false,
  },
  {
    id: 2,
    title: 'Healthcare',
    image: require('../../assets/icons/interest_healthcare.png'),
    selected: false,
  },
  {
    id: 3,
    title: 'Food',
    image: require('../../assets/icons/interest_food.png'),
    selected: false,
  },
  {
    id: 4,
    title: 'Gardening',
    image: require('../../assets/icons/interest_gardening.png'),
    selected: false,
  },
];

function DiscoverSelectionScreen({navigation}) {
  const [distanceSelected, setDistanceSelected] = useState(distances);
  const [interestSelected, setInterestSelected] = useState(interests);
  const [distanceChosen, setDistanceChosen] = useState(false);
  const [interestChosen, setInterestChosen] = useState(false);

  handleDistanceOnpress = (item, itemID) => {
    let newItem = distanceSelected.map(
      (
        value,
        valueID = value => {
          return value.id;
        },
      ) => {
        if (valueID === itemID) {
          value.selected = item.selected;
        } else {
          value.selected = false;
        }
        return {...value};
      },
    );
    setDistanceSelected(newItem);
    // Update state not successful...
    console.log(distanceSelected);
  };

  handleInterestOnpress = (item, itemID) => {
    let newItem = interestSelected.map(
      (
        value,
        valueID = value => {
          return value.id;
        },
      ) => {
        if (valueID === itemID) {
          value.selected = item.selected;
        } else {
          value.selected = false;
        }
        return {...value};
      },
    );
    setInterestSelected(newItem);
    // Update state not successful...
    console.log(interestSelected);
  };

  const {colors} = useTheme();
  return (
    <DefaultView>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.titleStyle}>Discover</Text>
        <Image
          source={require('../../assets/icons/discovery_icon.png')}
          style={styles.image}
        />
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Choose a distance</Text>
      </View>
      <View style={styles.selectionContainer}>
        <FlatList
          data={distances}
          style={styles.list}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({item, index}) => {
            return (
              <Button
                onPress={(item, index) => {
                  item.selected = true;
                  handleDistanceOnpress(item, index + 1);
                  console.log(distanceSelected);
                }}
                mode={item.selected ? 'contained' : 'outlined'}
                buttonColor={item.selected ? '#rgba(31, 31, 31, 0.12)' : ''}
                style={styles.buttonContainer}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}>
                {item.title}
              </Button>
            );
            if (item.selected) {
              setDistanceChosen(true);
            }
          }}></FlatList>
      </View>
      <View style={styles.separatorLineContainer}>
        <View
          style={{
            flex: 0.9,
            height: 1,
            backgroundColor: '#625B71',
          }}
        />
        <Text
          style={{
            width: 48,
            height: 24,
            fontFamily: 'Roboto',
            fontweight: '400',
            fontSize: 16,
            lineHeight: 24,
            alignItems: 'center',
            textAlign: 'center',

            color: '#6750A4',
          }}>
          OR
        </Text>
        <View
          style={{
            flex: 0.9,
            height: 1,
            backgroundColor: '#625B71',
          }}
        />
      </View>
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>Choose an interest</Text>
      </View>
      <View style={styles.selectionContainer}>
        <FlatList
          data={interests}
          style={styles.list}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-between',
          }}
          renderItem={({item, index}) => {
            let idCheck = item.id === 1;
            return (
              <Button
                mode={idCheck || item.selected ? 'contained' : 'outlined'}
                icon={item.image}
                disabled={idCheck}
                style={
                  idCheck
                    ? styles.interestButtonContainerGreyOut
                    : styles.interestButtonContainer
                }
                contentStyle={styles.interestButtonContent}
                labelStyle={
                  idCheck
                    ? styles.interestButtonLabelGreyOut
                    : styles.interestButtonLabel
                }
                onPress={(item, index) => {
                  item.selected = true;
                  handleTimeOnpress(item, index + 1);
                }}
                buttonColor={item.selected ? '#rgba(31, 31, 31, 0.12)' : ''}>
                {item.title}
              </Button>
            );
          }}></FlatList>
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button
          mode="text"
          style={styles.bottomButtonContainer}
          contentStyle={styles.buttonContent}
          labelStyle={styles.bottomButtonLabel}
          onPress={() => {
            navigation.navigate(DTeamCreation3);
          }}>
          Back
        </Button>
        <Button
          mode="Contained"
          buttonColor="#E89C51"
          textColor="#FFFFFF"
          style={styles.bottomButtonContainer}
          contentStyle={styles.buttonContent}
          labelStyle={styles.bottomButtonLabel}
          disabled={!distanceChosen && interestChosen}
          onPress={() => {
            navigation.navigate(ChallengeListMap);
          }}>
          Next
        </Button>
      </View>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  screenTitleContainer: {
    marginTop: 0.0535 * height,
    marginHorizontal: 0.058 * width,
    height: 44,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  titleStyle: {
    fontSize: 36,
    color: '#6750A4',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: 44,
    width: 0.435 * width,
  },
  image: {height: 40, width: 40, marginRight: 0.048 * width},
  instructionContainer: {
    marginTop: 0.0535 * height,
    marginHorizontal: 0.058 * width,
    height: 32,
  },
  instructionText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 32,
  },
  selectionContainer: {
    marginTop: 0.0267 * height,
    marginHorizontal: 0.058 * width,
    justifyContent: 'space-between',
  },
  list: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginTop: 0.0267 * height,
    height: 0.0535 * height,
    width: 0.266 * width,
    borderColor: '#6750A4',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    marginHorizontal: 0.012 * width,
  },
  buttonContent: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  buttonLabel: {
    width: 0.258 * width,
    height: 22,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.1,
    color: '#000000',
  },
  separatorLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 0.0267 * height,
    marginTop: 0.0535 * height,
    marginHorizontal: 0.058 * width,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0.0357 * height,
    marginHorizontal: 0.058 * width,
  },
  bottomButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 0.432 * width,
    height: 0.0625 * height,
    background: '#FFFFFF',
    borderRadius: 12,
  },
  backButtonLabel: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    alignItems: 'center',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  interestButtonContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 0.418 * width,
    height: 0.0625 * height,
    marginTop: 0.0267 * height,
    background: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#6750A4',
    marginHorizontal: 0.012 * width,
  },
  interestButtonContainerGreyOut: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 0.418 * width,
    height: 0.0625 * height,
    marginTop: 0.0267 * height,
    background: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0,
    marginHorizontal: 0.012 * width,
  },
  interestButtonContent: {
    marginRight: 0.02 * width,
    justifyContent: 'row',
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignContent: 'center',
  },
  interestButtonLabel: {
    width: 0.258 * width,
    height: 22,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.1,
    color: '#000000',
  },
  interestButtonLabelGreyOut: {
    width: 0.258 * width,
    height: 22,
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    letterSpacing: 0.1,
    color: 'rgba(0, 0, 0, 0.12)',
  },
});

export default DiscoverSelectionScreen;
