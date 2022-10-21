import React, { useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image } from 'react-native'
import { Button } from 'react-native-paper'
import { Text } from '../paper/typos'

function LogOutModal(props) {
  return (
    <View style={styles.centredView}>
      <Modal
        animationType="slide"
        visible={props.modalVisibility}
        onRequestClose={() => {
          console.log('do log out request')
          props.setModalVisibility(!props.modalVisibility)
        }}>
        <View style={styles.centredView}>
          <View style={styles.modalBackgroundStyle}>
            <Image
              source={require('../../../assets/images/logout.png')}
              style={{ height: 180, width: 224, marginTop: 20 }}
            />
            <Text
              style={{ textAlign: 'center', width: 200, marginTop: 20 }}
              variant="headlineSmall">
              Are you sure you want to leave?
            </Text>
            <Text style={{ marginTop: 10 }} variant="bodyMedium">We hope you come back soon...</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Button
                onPress={() => {
                  console.log('perform logout here')
                  props.onConfirmLogOut()
                  props.setModalVisibility(!props.modalVisibility)
                }}
                labelStyle={{ paddingHorizontal: 10 }}
                style={{ marginRight: 10 }}>
                Yes
              </Button>
              <Button mode="contained"
                onPress={() => {
                  console.log('no action here')
                  props.setModalVisibility(!props.modalVisibility)
                }}
                labelStyle={{ paddingHorizontal: 10 }}
                style={{ marginLeft: 10 }}>
                Back
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  centredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    opacity: 50,
  },
  modalBackgroundStyle: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    shadowRadius: 5,
    shadowColor: '#111111',
    alignItems: 'center',
    shadowOpacity: 0.25,
    elevation: 5,
    // height: 390,
    // width: 264,
    padding: 20
  },
})
export default LogOutModal
