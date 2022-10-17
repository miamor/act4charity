import React, {PropTypes, Component} from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, ScrollView, View, Image} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {ProgressBar, Appbar, useTheme, Text, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DefaultView} from '../components/containers';

const TESTDATA = [
  {
    id: '1',
    challengeTitle: 'Walking for them',
    challengeSponsor: 'Boots for all',
    donationAmount: '0.50',
    type: 'walk',
  },
  {
    id: '2',
    challengeTitle: 'All for Chris',
    challengeSponsor: "Children's Health Fund",
    donationAmount: '0.75',
    type: 'walk',
  },
  {
    id: '3',
    challengeTitle: 'Saving Koalas',
    challengeSponsor: 'Animals Australia',
    donationAmount: '0.25',
    type: 'discover',
  },
  {
    id: '4',
    challengeTitle: 'Summer Reading',
    challengeSponsor: 'Indigenous Literacy Foundation',
    donationAmount: '0.30',
    type: 'discover',
  },
];

function RewardScreen() {
  const {colors} = useTheme();
  const donatedAmount = 246;
  const renderItem = ({item}) => (
    <View style={styles.renderItemStyle}>
      <View
        style={{
          margin: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{flexDirection: 'row'}}>
          {item.type == 'walk' ? <Image
            style={{height: 40, width: 40, marginTop: 2}}
            source={require('../../assets/icons/walking.png')}
          /> : <Image
          style={{height: 40, width: 40, marginTop: 2}}
          source={require('../../assets/icons/discover.png')}
        />}
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginLeft: 12,
            }}>
            <Text variant="titleMedium">{item.challengeTitle}</Text>
            <Text variant="bodyMedium">{item.challengeSponsor}</Text>
          </View>
        </View>
        <Text>${item.donationAmount}</Text>
      </View>
    </View>
  );
  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Past Donations" color={colors.primary} />
      </Appbar.Header>

      <ScrollView style={{backgroundColor: '#ffffff'}}>
        <View style={styles.mainViewContainer}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 24,
            }}>
            <Image
              source={require('../../assets/images/Coins.png')}
              style={{width: 66, height: 48}}
            />
            <Text style={{marginLeft: 16}} variant="displayMedium">
              ${donatedAmount}
            </Text>
          </View>
          <Text
            variant="labelSmall"
            style={{
              color: colors.secondary,
              alignSelf: 'center',
              marginTop: 12,
            }}>
            Donated so far
          </Text>
          <Text variant="titleLarge" style={{marginTop: 24}}>
            Donation Details
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              marginBottom: 12,
            }}>
            <Text variant="titleSmall">Challenge</Text>
            <Text variant="titleSmall">Donation</Text>
          </View>
          <SafeAreaView>
            <FlatList
              data={TESTDATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </SafeAreaView>
        </View>
      </ScrollView>
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginRight: 24,
  },
  renderItemStyle: {
    backgroundColor: '#FFFBFE',
    borderRadius: 12,
    marginBottom: 8,
  },
});

export default RewardScreen;
