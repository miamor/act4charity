import React, { useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, Dimensions, ScrollView, FlatList, ToastAndroid } from 'react-native'
import { Button, Switch, useTheme } from 'react-native-paper'
import Loading from '../../components/animations/loading'
import { Text, H2 } from '../../components/paper/typos'
import { useGlobals } from '../../contexts/global'

import * as userAPI from '../../services/userAPI'

const distances = [1, 1.25, 1.5, 2, 2.25, 2.5, 3, 3.25, 3.5]


function FilterModal(props) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const { width } = Dimensions.get('window')

  const [loading, setLoading] = useState(false)


  /*
   * Filter by distance
   */
  const [selectedDistance, setSelectedDistance] = useState(1.5)
  const onToggleDistance = (item) => {
    //console.log(item)
    setSelectedDistance(item)
  }


  /*
   * Load interests
   */
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

  /*
   * Filter by interests
   */
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


  /*
   * Do filter
   */
  const submitFilter = () => {
    props.setFilterModalVisibility(!props.filterModalVisibility)

    let filterOptions = {}
    if (selectedDistance != null) {
      filterOptions.distance = selectedDistance
    }

    const selected_ids = Object.keys(selectedCats).filter(function (key) { return selectedCats[key] === 1 })
    filterOptions.interests = selected_ids

    props.onFinishFilter(filterOptions)
  }


  return (
    <Modal
      animationType="slide"
      visible={props.filterModalVisibility}
      onRequestClose={() => {
        props.setFilterModalVisibility(!props.filterModalVisibility)
      }}>

      {loading && <Loading />}

      <View style={styles.mainViewContainer}>
        <H2>Filter challenge</H2>

        <View style={{ flex: 1, flexDirection: 'column' }}>

          <View style={{ flex: 0.32 }}>
            <Text style={{ marginTop: 25, marginBottom: 15, fontSize: 18, color: colors.primary }} variant="bodyMedium">
              Choose distance
            </Text>

            <FlatList
              data={distances}
              style={styles.list}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={item => item}
              bounces={false}
              contentContainerStyle={{
                justifyContent: 'space-between',
              }}
              renderItem={({ item, index }) => (
                <Button
                  onPress={() => onToggleDistance(item)}
                  mode={selectedDistance === item ? 'contained' : 'outlined'}
                  style={{
                    flex: 1,
                    marginHorizontal: 4,
                    marginVertical: 3,
                    borderRadius: 40
                  }}
                  labelStyle={{
                    paddingVertical: selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 3 : 2,
                  }}
                >
                  {item}km
                </Button>
              )}></FlatList>
          </View>

          <View style={{ flex: 0.3 }}>
            <Text style={{ marginTop: 25, marginBottom: 15, fontSize: 18, color: colors.primary }} variant="bodyMedium">
              Filter by categories
            </Text>

            {cats && <FlatList
              data={cats}
              style={styles.list}
              numColumns={3}
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
                  buttonColor={item.selected ? 'rgba(31, 31, 31, 0.12)' : ''}
                  style={{
                    flex: 1,
                    marginHorizontal: 4,
                    marginVertical: 3,
                    borderRadius: 40
                  }}
                  labelStyle={{
                    paddingVertical: selectedCats.hasOwnProperty(item._id) && selectedCats[item._id] === 1 ? 3 : 2,
                  }}
                    >
                  {item.title}
                </Button>
              )}></FlatList>}
          </View>

          <View style={{ flex: 0.1, justifyContent: 'flex-end' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Button mode="text"
                style={{ marginHorizontal: 10 }}
                labelStyle={{ paddingHorizontal: 10 }}
                onPress={() => props.setFilterModalVisibility(!props.filterModalVisibility)}
              >
                BACK
              </Button>

              <Button mode="contained"
                style={{ marginHorizontal: 10 }}
                labelStyle={{ paddingHorizontal: 10 }}
                onPress={submitFilter}
                style={{ borderRadius: 30 }}
              >
                Filter
              </Button>
            </View>
          </View>

        </View>

      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  mainViewContainer: {
    marginLeft: 24,
    marginTop: 30,
    marginRight: 24,
    flex: 1,
  },
})
export default FilterModal