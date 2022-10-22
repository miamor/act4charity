import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions } from 'react-native'
import { Button, Switch } from 'react-native-paper'
import { Text, H2 } from '../../components/paper/typos'


function HelpModal(props) {
  const { width } = Dimensions.get('window')

  return (
    <View style={{ backgroundColor: '#ffffff' }}>
      <Modal
        animationType="slide"
        visible={props.helpModalVisibility}
        onRequestClose={() => {
          props.setHelpModalVisibility(!props.helpModalVisibility)
        }}>
        <View style={styles.mainViewContainer}>
          <H2>Help</H2>

          <Text style={{ marginTop: 18 }} variant="bodyLarge">
            Select the contact option that best suits you
          </Text>
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Image
              style={{ width: width, height: width }}
              source={require('../../../assets/icons/helpIcons.png')}
            />
          </View>
          <Image
            style={{ height: 30, width: width }}
            source={require('../../../assets/icons/helptime.png')}
          />
          <Image
            style={{ height: 24, width: width, marginTop: 24 }}
            source={require('../../../assets/icons/helpday.png')}
          />
          
          <Button mode="text"
            style={{ width: 100, marginTop: 35 }}
            labelStyle={{ paddingHorizontal: 10 }}
            onPress={() => props.setHelpModalVisibility(!props.helpModalVisibility)}>
            BACK
          </Button>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 30,
    marginRight: 24,
  },
})
export default HelpModal