import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, ScrollView, View, Image, TouchableOpacity, ToastAndroid } from 'react-native'
import { Button, useTheme } from 'react-native-paper'
import { useGlobals } from '../../contexts/global'
import { Text, H2 } from '../../components/paper/typos'

import * as userAPI from '../../services/userAPI'
import Loading from '../../components/animations/loading'
import Storer from '../../utils/storer'
import { LOGGED_USER_KEY } from '../../constants/keys'


function InterestsModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [loading, setLoading] = useState(false)

  const [cats, setCats] = useState()
  const [selectedCats, setSelectedCats] = useState({})

  useEffect(() => {
    userAPI.listInterests({ num_per_page: 100 }).then((res) => {
      setCats(res.data)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })

    if (loggedUser.interests != null) {
      loggedUser.interests.forEach(item => {
        selectedCats[item] = 1
      })
    }
  }, [])

  const _handleContinue = () => {
    dispatch({
      type: 'setLoggedUser',
      loggedUser: {
        ...loggedUser,
        interests: selectedCats,
        target_donation: 50, // just put a fixed value here
      },
    })
    navigation.push('Loading')
  }

  const toggleToCats = (cat_id) => {
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
    console.log('>>> selected_ids', selected_ids)

    const finished_user_info = {
      ...loggedUser,
      interests: selected_ids
    }
    userAPI.updateProfile({ interests: selected_ids }).then((res) => {
      Storer.set(LOGGED_USER_KEY, finished_user_info)
      dispatch({
        type: 'setLoggedUser',
        loggedUser: finished_user_info,
      })

      setLoading(false)

      props.setInterestModalVisibility(!props.interestModalVisibility)
    }).catch(error => {
      console.error(error)
      ToastAndroid.show('Oops', ToastAndroid.SHORT)
    })
  }


  return (
    <View style={{ color: '#ffffff' }}>
      <Modal
        animationType="slide"
        visible={props.interestModalVisibility}
        onRequestClose={() => {
          props.setInterestModalVisibility(!props.interestModalVisibility)
        }}>

        {loading && <Loading />}

        <View style={styles.mainViewContainer}>
          <H2>Interests</H2>

          <Text style={{ marginTop: 24, marginBottom: 24 }} variant="bodyMedium">
            Select the topics that interest you the most
          </Text>


          <ScrollView>
            <View style={{ flex: 0.6 }}>
              {cats != null && cats.map((cat, i) => (
                <TouchableOpacity key={`cat-` + i}
                  onPress={() => toggleToCats(cat._id)}
                  style={[
                    selectedCats.hasOwnProperty(cat._id) && selectedCats[cat._id] === 1 && { backgroundColor: colors.primary },
                    {
                      height: 45,
                      paddingHorizontal: 20,
                      paddingVertical: 5,
                      borderColor: colors.primary,
                      borderRadius: 30,
                      borderWidth: 1,
                      margin: 15,
                    }
                  ]}
                >
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {/* <Image /> */}
                    <View>
                      <Text style={[selectedCats.hasOwnProperty(cat._id) && selectedCats[cat._id] === 1 && { color: '#fff' }]}>
                        {cat.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flex: 0.6, marginTop: 30 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Button mode="text"
                  style={{ marginHorizontal: 10 }}
                  labelStyle={{ paddingHorizontal: 10 }}
                  onPress={() => {
                    console.log('back button pressed')
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

          </ScrollView>

        </View>
      </Modal>
    </View>
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
