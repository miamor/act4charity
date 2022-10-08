import React, {useState} from 'react';
import {Alert, Modal, StyleSheet, Pressable, View, Image} from 'react-native';
import {Text, Button, Switch} from 'react-native-paper';

function HelpModal(props) {
  return (
    <View style={{backgroundColor: '#ffffff'}}>
      <Modal
        animationType="slide"
        visible={props.helpModalVisibility}
        onRequestClose={() => {
          props.setHelpModalVisibility(!props.helpModalVisibility);
        }}>
        <View style={styles.mainViewContainer}>
          <Text variant="headlineMedium" style={{color: '#6750A4'}}>
            Help
          </Text>
          <Text style={{marginTop: 18}} variant="bodyLarge">
            Select the contact option that best suits you
          </Text>
          <View style={{alignItems: 'center', marginTop: 24}}>
            <Image
              style={{width: 366, height: 418}}
              source={require('../assets/icons/helpIcons.png')}
            />
          </View>
          <Image
            style={{height: 30, width: 366}}
            source={require('../assets/icons/helptime.png')}
          />
          <Image
            style={{height: 24, width: 366, marginTop: 24}}
            source={require('../assets/icons/helpday.png')}
          />
          <Button
            mode="text"
            style={{width: 20, marginTop: 65}}
            onPress={() => {
              console.log('back button pressed');
              props.setHelpModalVisibility(!props.helpModalVisibility);
            }}>
            {<Text style={{color: '#6750A4'}}>BACK</Text>}
          </Button>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
});
export default HelpModal;