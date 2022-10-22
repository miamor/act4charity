import React, { PropTypes, Component } from 'react'
import { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import { ProgressBar, Button, Appbar, useTheme } from 'react-native-paper'
import { DefaultView } from '../../components/containers'
import { Text } from '../../components/paper/typos'

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeSelectScreen({ navigation }) {
  const { colors } = useTheme()

  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title='Challenge Type' color={colors.primary} />
      </Appbar.Header>

      <View style={{ backgroundColor: 'transparent', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        {/* <Text variant='titleLarge'>Choose your mode</Text> */}

        <View style={{ flex: 0.2 }} />

        <View style={{ flex: 0.3, flexDirection: 'column', paddingHorizontal: 30, paddingVertical: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ChallengeListMapDiscover', { key: 'ChallengeListMapDiscover' })} style={{ backgroundColor: '#DFD5EC', borderRadius: 12, flex: 1, flexDirection: 'column', paddingTop: 10, paddingHorizontal: 10 }}>
            <View style={{ backgroundColor: '#fff', flex: 0.9, borderRadius: 12 }}>
              <Text>Put image here</Text>
            </View>
            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <View style={{ alignItems: 'center' }}>
                <Text>Discover</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.3, flexDirection: 'column', paddingHorizontal: 30, paddingVertical: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ChallengeListWalk', { key: 'ChallengeListWalk' })} style={{ backgroundColor: '#DFD5EC', borderRadius: 12, flex: 1, flexDirection: 'column', paddingTop: 10, paddingHorizontal: 10 }}>
            <View style={{ backgroundColor: '#fff', flex: 0.9, borderRadius: 12 }}>
              <Text>Put image here</Text>
            </View>
            <View style={{ alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
              <Text>Walk</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 0.2 }} />

      </View>

    </DefaultView>
  )
}

const styles = StyleSheet.create({
  challengeModeContainer: {
    //marginTop: 21,
    //marginBottom: 48,
    //alignItems: 'center',
    justifyContent: 'space-between',
    width: 366,
    height: 420,
    alignSelf: 'center',
    //backgroundColor:'gray',
    top: 20,
    //alignItems:'center',
    //flex=1,
  },
  challengeModeOutContainer: {
    //backgroundColor:'thistle',
    backgroundColor: '#DFD5EC',
    //DFD5EC
    //'#FFFFFF'
    width: 366,
    height: 185,
    //top: 5,
    //alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between', //main axis
    alignItems: 'center', //secondary

  },
  challengeModeInContainer: {
    backgroundColor: '#D9D9D9',
    //gray
    //D9D9D9
    width: 326,
    height: 89,
    top: 10,

  },

  challengeModeDetailsInContainer: {
    marginTop: 24,
    marginBottom: 20,
    flexDirection: 'row',
  },

})

export default ChallengeSelectScreen