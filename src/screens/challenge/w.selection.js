import React from 'react';
import {useState} from 'react';
import {StyleSheet, View, Dimensions, FlatList, Image} from 'react-native';
import {Text, Button, useTheme} from 'react-native-paper';
import {DefaultView} from '../../components/containers';

const {height, width} = Dimensions.get('screen');

let distances = [
  {
    id: 1,
    title: '1 km',
    selected: false,
  },
  {
    id: 2,
    title: '1.25 km',
    selected: false,
  },
  {
    id: 3,
    title: '1.5 km',
    selected: false,
  },
  {
    id: 4,
    title: '2 km',
    selected: false,
  },
  {
    id: 5,
    title: '2.5 km',
    selected: false,
  },
  {
    id: 6,
    title: 'Custom',
    selected: false,
  },
];

let times = [
  {
    id: 1,
    title: '10 minutes',
    selected: false,
  },
  {
    id: 2,
    title: '15 minutes',
    selected: false,
  },
  {
    id: 3,
    title: '20 minutes',
    selected: false,
  },
  {
    id: 4,
    title: '25 minutes',
    selected: false,
  },
  {
    id: 5,
    title: '30 minutes',
    selected: false,
  },
  {
    id: 6,
    title: 'Custom',
    selected: false,
  },
];

function WalkSelectionScreen({navigation}) {
  const [distanceSelected, setDistanceSelected] = useState(distances);
  const [timeSelected, setTimeSelected] = useState(times);
  const [distanceChosen, setDistanceChosen] = useState(false);
  const [timeChosen, setTimeChosen] = useState(false);

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

  handleTimeOnpress = (item, itemID) => {
    let newItem = timeSelected.map(
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
    setTimeSelected(newItem);
    // Update state not successful...
    console.log(timeSelected);
  };

  const {colors} = useTheme();

  return (
    <DefaultView>
      <View style={styles.screenTitleContainer}>
        <Text style={styles.titleStyle}>Walk</Text>
        <Image
          source={require('../../assets/icons/directions_walk.png')}
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
            justifyContent: 'flex-start',
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
        <Text style={styles.instructionText}>Choose a time</Text>
      </View>
      <View style={styles.selectionContainer}>
        <FlatList
          data={times}
          style={styles.list}
          numColumns={3}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'flex-start',
          }}
          renderItem={({item, index}) => {
            return (
              <Button
                onPress={(item, index) => {
                  item.selected = true;
                  handleTimeOnpress(item, index + 1);
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
              setTimeChosen(true);
            }
          }}></FlatList>
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button
          mode="text"
          style={styles.bottomButtonContainer}
          contentStyle={styles.buttonContent}
          labelStyle={styles.bottomButtonLabel}
          onPress={() => {
            navigation.navigate(WTeamCreation3);
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
          disabled={!distanceChosen && timeChosen}
          onPress={() => {
            navigation.navigate(ChallengeWalkDetailStart);
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
    alignContent: 'space-between',
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
    // color: '#6750A4',
  },
});

export default WalkSelectionScreen;
