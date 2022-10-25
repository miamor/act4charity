import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, ScrollView, View, Image, TouchableOpacity, ToastAndroid, FlatList, Dimensions } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { useGlobals } from '../../contexts/global'
import { Text, H2 } from '../../components/paper/typos'

import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import Storer from '../../utils/storer'


function InterestsModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [cats, setCats] = useState()
  const [selectedCats, setSelectedCats] = useState({})

  useEffect(() => {
    setLoading(true)
    
    userAPI.listInterests({ num_per_page: 100 }).then((res) => {
      setCats(res.data)
      setLoading(false)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })

    if (loggedUser.interests != null) {
      loggedUser.interests.forEach(item => {
        selectedCats[item] = 1
      })
    }
  }, [])

  const onToggleInterest = (cat_id) => {
    if (!selectedCats.hasOwnProperty(cat_id) || selectedCats[cat_id] === 0) {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 1
      })
    } else if (selectedCats[cat_id] === 1) {
      setSelectedCats({
        ...selectedCats,
        [cat_id]: 0
      })
    }
  }

  const onUpdateInterests = async () => {
    setLoading(true)
    // const selected_ids = Object.keys(selectedCats).find(key => selectedCats[key] === 1)
    const selected_ids = Object.keys(selectedCats).filter(function (key) { return selectedCats[key] === 1 })
    // //console.log('>>> selected_ids', selected_ids)

    const finished_user_info = {
      ...loggedUser,
      interests: selected_ids
    }
    userAPI.updateProfile({ interests: selected_ids }).then((res) => {
      Storer.set('loggedUser', finished_user_info)
      dispatch({
        type: 'setLoggedUser',
        loggedUser: finished_user_info,
      })

      setLoading(false)

      props.setInterestModalVisibility(!props.interestModalVisibility)
    }).catch(error => {
      setLoading(false)
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }

  const { height } = Dimensions.get('window')


  return (
    <Modal
      animationType="slide"
      visible={props.interestModalVisibility}
      onRequestClose={() => {
        props.setInterestModalVisibility(!props.interestModalVisibility)
      }}>

      {loading && <Loading />}

      <View style={[styles.mainViewContainer, { height: height, flexDirection: 'column' }]}>
        <H2>Interests</H2>

        <Text style={{ marginTop: 24, marginBottom: 24 }} variant="bodyMedium">
          Select the topics that interest you the most
        </Text>


        <View style={{ flex: 0.4 }}>
          {cats && <FlatList
            data={cats}
            style={styles.list}
            numColumns={2}
            scrollEnabled={false}
            keyExtractor={item => item._id}
            bounces={false}
            contentContainerStyle={{
              justifyContent: 'space-between',
            }}
            renderItem={({ item, index }) => (
              <Button
                onPress={() => onToggleInterest(item._id)}
                mode={selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 'contained' : 'outlined'}
                // buttonColor={item.selected ? 'rgba(31, 31, 31, 0.12)' : ''}
                style={{
                  flex: 1,
                  marginHorizontal: 4,
                  marginVertical: 10,
                  borderRadius: 40
                }}
                labelStyle={{
                  paddingVertical: selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 5 : 4,
                  fontSize: 17
                }}
              >
                {item.title}
              </Button>
            )}></FlatList>}
        </View>

        <View style={{ flex: 0.1, justifyContent: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Button mode="text"
              style={{ marginHorizontal: 10 }}
              labelStyle={{ paddingHorizontal: 10 }}
              onPress={() => {
                //console.log('back button pressed')
                props.setInterestModalVisibility(!props.interestModalVisibility)
              }}>
              BACK
            </Button>

            <Button mode="contained"
              style={{ marginHorizontal: 10 }}
              labelStyle={{ paddingHorizontal: 10 }}
              disabled={Object.keys(selectedCats).length === 0 || Object.values(selectedCats).reduce((a, b) => a + b, 0) === 0}
              onPress={onUpdateInterests}
              style={{ borderRadius: 30 }}
            >
              Update
            </Button>
          </View>
        </View>

      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 12,
    marginRight: 24,
  },
})
export default InterestsModal
