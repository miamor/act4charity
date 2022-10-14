import React, { PropTypes, Component } from 'react';
import {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import { Text, ProgressBar, Button, Appbar, useTheme } from 'react-native-paper';
import { DefaultView } from '../../components/containers';

/**
 * @param navigation
 * @returns {*}
 * @constructor
 */
function ChallengeModeScreen({ navigation }) {
    const { colors } = useTheme()
  return (
    <DefaultView>
      <Appbar.Header statusBarHeight={0}>
        <Appbar.Content title="Walk" color={colors.primary} />
      </Appbar.Header>

      <ScrollView style={{ backgroundColor: '#ffffff' }}>
        <View style={styles.mainViewContainer}>
          <Text variant="headlineSmall">Choose your mode</Text>
          
          <View style={styles.challengeModeContainer}>
              <View
                style={{
                  backgroundColor:"#DFD5EC",
                  width: 366,
                  height: 185,
                  borderRadius: 12,
                  //alignSelf:"flex-start",
                }}
              >
                <View
                  style={{
                  backgroundColor:"#D9D9D9",
                  //gray
                  width: 326,
                  height: 100,
                  alignSelf:"center",
                  top:20,
                }}/>
                <View
                  style={{
                  width: 300,
                  height: 50,
                  alignSelf:"center",
                  top:20,
                  flexDirection:"row",
                  justifyContent:"space-around",
                }}
                >
                  <View
                  style={{
                  alignItems:"center",
                  top:10,
                  }}
                  >
                  <Text variant="headlineSmall">Individual</Text>
                  </View>

                  <View
                  style={{
                  //backgroundColor:"hotpink",
                  //width: 150,
                  //height: 50,
                  //alignSelf:"center",
                  //justifyContent:"space-between",
                  alignItems:"center",
                  top:10,
                  
                  }}
                  >

                  
                  <Image source={require('../../assets/icons/individual.png')}/>
                  
                  </View>
                </View>

              </View>

              <View
                style={{
                  backgroundColor:"#DFD5EC",
                  width: 366,
                  height: 185,
                  borderRadius: 12,
                  //alignSelf:"flex-start",
                }}
              >
                <View
                  style={{
                  backgroundColor:"#D9D9D9",
                  //gray
                  width: 326,
                  height: 100,
                  alignSelf:"center",
                  top:20,
                }}/>
                <View
                  style={{
                  width: 300,
                  height: 50,
                  alignSelf:"center",
                  top:20,
                  flexDirection:"row",
                  justifyContent:"space-around",
                }}
                >
                  <View
                  style={{
                  alignItems:"center",
                  top:10,
                  }}
                  >
                  <Text variant="headlineSmall">Team</Text>
                  </View>

                  <View
                  style={{
                  //backgroundColor:"hotpink",
                  //width: 150,
                  //height: 50,
                  //alignSelf:"center",
                  //justifyContent:"space-between",
                  alignItems:"center",
                  top:10,
                  
                  }}
                  >

                  
                  <Image source={require('../../assets/icons/team.png')}/>
                  
                  </View>
                </View>

              </View>    
                
          </View>
          
          
          <View
            style={{
            //backgroundColor:"lawngreen",
            width: 366,
            height: 70,
            top:10,
            alignSelf:"center",
            flexDirection:"row",
            justifyContent:"space-around",
            }}
            >
              <View style={styles.challengeButtonContainer}>
                <Button
                  onPress={() => {
                    console.log('challenge mode Back button pressed');
                  }}
                  style={{ backgroundColor: '#FFFFFF', top: 40, borderRadius: 12 }}
                  contentStyle={styles.targetButtonStyle}
                  mode="contained">
                  {
                    <Text
                      variant="labelMedium"
                      style={{ color: colors.primary, height: 56 }}>
                      BACK
                    </Text>
                  }
                </Button>
              </View>

              <View style={styles.challengeButtonContainer}>
                <Button
                  onPress={() => {
                    console.log('challenge mode Next button pressed');
                  }}
                  style={{ backgroundColor: '#E89C51', top: 40, borderRadius: 12 }}
                  contentStyle={styles.targetButtonStyle}
                  mode="contained">
                  {
                    <Text
                      variant="labelMedium"
                      style={{ color: '#FFFFFF', height: 56 }}>
                      NEXT
                    </Text>
                  }
                </Button>
              </View>

              {/*      
              <View
                style={{
                backgroundColor:"indianred",
                width: 150,
                height:70,
                  }}/>
              */}        

          </View>

          {/*      
          <View style={styles.challengeButtonContainer}>
            <Button
              onPress={() => {
                console.log('challenge mode Next button pressed');
              }}
              style={{ backgroundColor: '#E89C51', top: 40, borderRadius: 12 }}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  style={{ color: '#FFFFFF', height: 56 }}>
                  Next
                </Text>
              }
            </Button>
          </View>
          
          <View style={styles.challengeButtonContainer}>
            <Button
              onPress={() => {
                console.log('challenge mode Back button pressed');
              }}
              //#E89C51
              style={{ backgroundColor: '#FFFFFF', borderRadius: 12 }}
              contentStyle={styles.targetButtonStyle}
              mode="contained">
              {
                <Text
                  variant="labelMedium"
                  //'#FFFFFF'
                  style={{ color: '#E89C51', height: 56 }}>
                  Back
                </Text>
              }
            </Button>
          </View>
          */}
          
        </View>
      </ScrollView>


        {/*
        <Appbar.Header statusBarHeight={0}>
            <Appbar.Content title="Walk" color={colors.primary} />
        </Appbar.Header>
        <View>
            <Text>hello world 123</Text>
        </View>
        */}
        
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 48,
    marginRight: 24,
    marginBottom: 48,
    //alignItems: 'center'
  },
  challengeModeContainer: {
    //marginTop: 21,
    //marginBottom: 48,
    //alignItems: 'center',
    justifyContent:"space-between",
    width: 366,
    height: 420,
    alignSelf:"center",
    //backgroundColor:"gray",
    top:20,
    //alignItems:"center",
    //flex=1,
  },
  challengeModeOutContainer: {
    //backgroundColor:"thistle",
    backgroundColor:'#DFD5EC',
    //DFD5EC
    //'#FFFFFF'
    width: 366,
    height: 185 ,
    //top: 5,
    //alignItems: 'center',
    flexDirection:"row",
    justifyContent:"space-between", //main axis
    alignItems:"center", //secondary

  },
  challengeModeInContainer: {
    backgroundColor:'#D9D9D9',
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

});

export default ChallengeModeScreen;