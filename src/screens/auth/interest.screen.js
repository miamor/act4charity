import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {Button} from 'react-native-paper';

const interestTopics = [
  {
    id: 1,
    title: 'Healthcare',
    image: require('../../components/decorations/images/icon-healthcare.png'),
    selected: false,
  },
  {
    id: 2,
    title: 'Reading',
    image: require('../../components/decorations/images/icon-reading.png'),
    selected: false,
  },
  {
    id: 3,
    title: 'Sport',
    image: require('../../components/decorations/images/icon-sport.png'),
    selected: false,
  },
  {
    id: 4,
    title: 'Tourism',
    image: require('../../components/decorations/images/icon-tourism.png'),
    selected: false,
  },
  {
    id: 5,
    title: 'Nature',
    image: require('../../components/decorations/images/icon-nature.png'),
    selected: false,
  },
  {
    id: 6,
    title: 'Animals',
    image: require('../../components/decorations/images/icon-animals.png'),
    selected: false,
  },
];

function InterestScreen({navigation}) {
  const [select, setSelect] = useState(interestTopics);

  const handleOnpress = item => {
    let newItem = select.map(val => {
      if (val.id === item.id) {
        val.selected = item.selected;
      }
      return {...val};
    });
    setSelect(newItem);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Interests</Text>
      <Text style={styles.instruction}>
        Select the topics that interest you most
      </Text>
      <View style={styles.slectionContainer}>
        <FlatList
          data={interestTopics}
          numColumns={2}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          pagingEnabled
          bounces={false}
          contentContainerStyle={{
            justifyContent: 'space-around',
          }}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Image source={item.image} style={styles.itemImage}></Image>
              <Button
                style={[styles.itemSelect]}
                onPress={() => {
                  item.selected = !item.selected;
                  handleOnpress(item);
                }}
                buttonColor={item.selected ? '#rgba(31, 31, 31, 0.12)' : ''}
                labelStyle={styles.itemTitle}>
                {item.title}
              </Button>
            </View>
          )}></FlatList>
      </View>
      <Button
        style={styles.button}
        mode="contained"
        buttonColor="#E89C51"
        labelStyle={styles.buttonTitle}
        onPress={() => {
          navigation.navigate('PersonalInterest');
        }}>
        Done
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: '5.5%',
    paddingVertical: '5.5%',
    justifyContent: 'flex-start',
  },
  heading: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 36,
    lineHeight: 44,
    alignItems: 'flex-start',
    color: 'rgba(103, 80, 164, 1)',
  },
  instruction: {
    paddingVertical: '5.5%',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(51, 45, 65, 1)',
    letterSpacing: 0.5,
  },
  slectionContainer: {
    height: '60%',
    width: '100%',
  },
  list: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    width: Dimensions.get('window').width * 0.43,
    height: Dimensions.get('window').height * 0.17,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  itemImage: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  itemSelect: {
    marginVertical: '6%',
    marginHorizontal: '6%',
    borderRadius: 14,
    justifyContent: 'center',
  },
  itemTitle: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#6750A4',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    mariginVertical: '11%',
    height: 0.0625 * Dimensions.get('screen').height,
    width: '100%',
    borderRadius: 12,
    marginBottom: '16.5%',
    justifyContent: 'center',
  },
  buttonTitle: {
    height: '100%',
    width: '100%',
    fontFamily: 'Roboto',
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 1)',
    letterSpacing: 0.1,
  },
});
export default InterestScreen;
