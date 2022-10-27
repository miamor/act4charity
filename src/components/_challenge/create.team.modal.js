import React, { useCallback, useEffect, useState } from 'react'
import { Alert, Modal, StyleSheet, Pressable, View, Image, ToastAndroid, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native'
import { Button, Provider, Surface, TextInput, useTheme, IconButton } from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown'
import { useGlobals } from '../../contexts/global'
import { Text } from '../paper/typos'

import * as userAPI from '../../services/userAPI'
import Loading from '../animations/loading'
import { members_colors } from '../../utils/vars'


function CreateTeamModal({ onClose, onSubmit }) {
  const [{ loggedUser }, dispatch] = useGlobals()
  const { colors } = useTheme()

  const [selectedList, setSelectedList] = useState([])
  const [selectedIdList, setSelectedIdList] = useState([])
  const [suggestList, setSuggestList] = useState([])
  const [showSuggest, setShowSuggest] = useState(false)


  const [loading, setLoading] = useState(false)
  const handleSubmit = () => {
    //console.log('\n')
    //console.log(selectedIdList, selectedList)
    if (selectedList.length > 0) {
      setLoading(true)
      onSubmit(selectedIdList, selectedList)
    } else {
      ToastAndroid.show('You need at least 1 partner to start a team challenge', ToastAndroid.SHORT)
    }
  }

  const findUsers = (v) => {
    setShowSuggest(true)

    if (v.length > 1) {
      // setLoading(true)

      userAPI.findUsers({ username: v }).then((res) => {
        //console.log('>> res', res)
        setSuggestList(res.data)
        // setLoading(false)
      }).catch(error => {
        // setLoading(false)
        console.error(error)
        ToastAndroid.show('Oops', ToastAndroid.SHORT)
      })
    }
  }

  const onSelectUser = (user) => {
    setShowSuggest(false)
    // //console.log('user.username', user.username)

    if (selectedList.length < 5) {
      if (selectedList.indexOf(user.username) < 0 && user.username !== loggedUser.username) {
        setSelectedList([
          ...selectedList,
          user.username
        ])
        setSelectedIdList([
          ...selectedIdList,
          user._id
        ])
      }
    } else {
      ToastAndroid.show('You can invite up to 5 people to join a team challenge !', ToastAndroid.SHORT)
    }
  }

  const onRemoveUser = (username) => {
    setShowSuggest(false)
    var sel_ar = [...selectedList]
    var sel_id_ar = [...selectedIdList]
    const index = sel_ar.indexOf(username)
    if (index > -1) {
      sel_ar.splice(index, 1)
      sel_id_ar.splice(index, 1)
      setSelectedList(sel_ar)
      setSelectedIdList(sel_id_ar)
    }
  }


  return (
    <Modal animationType="slide">
      {loading && <Loading />}
      <View style={{ flex: 1, flexDirection: 'column', padding: 20 }}>
        <View>
          <TextInput
            style={{ marginTop: 12, marginBottom: 12 }}
            mode="outlined"
            label="Find user to invite to join as a team"
            placeholder="Search username"
            onChangeText={v => findUsers(v)}
          />

          {showSuggest && <View style={{ position: 'absolute', zIndex: 1000, backgroundColor: '#fff', left: 0, right: 0, top: 65, borderWidth: 2, borderTo: 0, borderColor: colors.primary }}>
            {suggestList.map((user, i) => (<TouchableOpacity key={`user-suggest-` + i} onPress={() => onSelectUser(user)} disabled={user.username === loggedUser.username} style={{ borderBottomColor: '#ddd', borderBottomWidth: 1, paddingVertical: 5, paddingHorizontal: 10 }}>
              <Text>{user.username}</Text>
            </TouchableOpacity>))}
          </View>}
        </View>


        <View style={{ flex: 0.9, paddingTop: 30 }}>
          {/* <View style={{ flexDirection: 'row' }}>
            {selectedList.length > 0 ? selectedList.map((username, i) => (<View key={`user-sel-` + i} style={{ flexDirection: 'row' }}>
              <Text>{username}</Text>
              <IconButton icon="close" iconColor={colors.primary} size={20} onPress={() => onRemoveUser(username)} />
            </View>))
              : (<></>)}
          </View> */}

          <FlatList
            data={selectedList}
            style={styles.list}
            numColumns={1}
            scrollEnabled={false}
            keyExtractor={item => item}
            bounces={false}
            contentContainerStyle={{
              justifyContent: 'space-between',
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={{
                // flex: 1,
                marginHorizontal: 4,
                marginVertical: 5,
                borderRadius: 40,
                // paddingVertical: 5,
                paddingHorizontal: 5,
                // backgroundColor: colors.primary,
                backgroundColor: '#fff',
                borderColor: colors.primary,
                borderWidth: 1,
                flexDirection: 'row'
              }}>
                <Text style={{ flex: 1, marginTop: 6, fontSize: 18, color: members_colors[index], paddingLeft: 20 }}>{item}</Text>
                <IconButton icon="close" iconColor={colors.primary} size={20} onPress={() => onRemoveUser(item)} />
              </TouchableOpacity>
            )} />
        </View>


        <View style={{ marginTop: 30, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <Button labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={onClose}>Back</Button>
          <Button mode="contained" labelStyle={{ paddingHorizontal: 10, paddingBottom: 1, lineHeight: 20 }} onPress={handleSubmit}>Start team challenge</Button>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({

})
export default CreateTeamModal
