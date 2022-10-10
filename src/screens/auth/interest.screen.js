import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

function InterestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Interests</Text>
      <Text style={styles.instruction}>
        Select the topics that interest you most
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}></ScrollView>
      <Pressable style={styles.button}>
        <Text style={styles.buttonTitle}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 20,
    justifyContent: 'space-between',
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
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(51, 45, 65, 1)',
    letterSpacing: 0.5,
  },
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemImage: {
    width: 169,
    height: 140,
    backgroundColor: '',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgba(103, 80, 164, 1)',
    borderRadius: 12,
  },
  buttonTitle: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 1)',
    letterSpacing: 0.1,
  },
});
export default InterestScreen;
