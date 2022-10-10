import React, { PropTypes, Component } from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View, Button, Text} from 'react-native';

function ChallengesScreen() {
  return (
    <View style={styles.mainViewContainer}>
      <Text>now in challenges screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 48,
    marginRight: 24,
    marginBottom: 48,
  },
});

export default ChallengesScreen;
