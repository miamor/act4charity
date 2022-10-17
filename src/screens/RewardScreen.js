import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Image } from 'react-native'
import { ProgressBar, Appbar, useTheme, Text, Button } from 'react-native-paper'
import { DefaultView } from '../components/containers'
import { useGlobals } from '../contexts/global'

function RewardScreen({ navigation }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const donatedAmount = 246

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Rewards" color={colors.primary} />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: '#ffffff' }}>
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
              style={{ width: 66, height: 48 }}
            />
            <Text style={{ marginLeft: 16 }} variant="displayMedium">
              ${donatedAmount}
            </Text>
          </View>
          <Text
            variant="labelSmall"
            style={{ color: colors.secondary, alignSelf: 'center', marginTop: 12 }}>
            Donated so far
          </Text>
          <Text variant="titleLarge" style={{ marginTop: 24 }}>Donation Details</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Text variant='titleSmall'>Challenge</Text>
            <Text variant='titleSmall'>Donation</Text>
          </View>
        </View>
      </ScrollView>
    </DefaultView>
  )
}

const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginRight: 24,
  },
})

export default RewardScreen
