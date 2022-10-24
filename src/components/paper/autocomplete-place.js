// import i18n from 'i18n-js'
import React from 'react'
import Axios from 'axios'
import CustomInput from './custom-input'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import { Text } from './typos'
import { useTheme } from 'react-native-paper'

const HERE_API_KEY = 'f8Ty685oEod3d67633Pu5wvUzUiDU49wKrKQNJM8UV4'
// const HERE_TOKEN = 'CmMemONckd0aQT2eYGnGXYmbYVPwZDIl2vKLPJDuH30yRsphLNjS9P4ND8ezpOT6VUBvB24rFaAza4ddezhdqA'


const HerePlacesInput = ({ styleType, label, onSelect, value, ...props }) => {
  const { colors } = useTheme()
  const [suggests, setSuggests] = React.useState(null)
  const [selected, setSelected] = React.useState(null)
  const [val, setVal] = React.useState(null)
  const [showSuggests, setShowSuggests] = React.useState(false)

  const _handleChangeText = (text) => {
    // //console.log('[_handleChangeText] ~~~ text', text)
    setVal(text)
    setSelected(null)
    if (text.length > 2) {
      // //console.log('[here] https://geocode.search.hereapi.com/v1/geocode?apiKey=' + HERE_API_KEY + '&q=' + encodeURIComponent(text))
      Axios.get(`https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${HERE_API_KEY}&searchtext=${encodeURIComponent(text)}`).then((res) => {
        // const data = res.data;
        if (res.data.Response.View.length > 0) {
          const data = res.data.Response.View[0].Result;
          // //console.log('[here]  >> data', data)
          // if (data.hasOwnProperty('items')) {
          if (data.length > 0) {
            const suggestions = []
            // if (data.length > 0) suggestions.push(data.items[0])
            // if (data.length > 1) suggestions.push(data.items[1])
            data.forEach((item, i) => {
              // //console.log('[here]    >> item', item)
              suggestions.push(item)
            })
            setSuggests(suggestions)
            setShowSuggests(true)
          } else {
            setSuggests(null)
            setShowSuggests(false)
          }
        } else {
          setSuggests(null)
          setShowSuggests(false)
        }
      }).catch(error => {
        //console.error(error)
      })
    } else {
      setSuggests(null)
      setShowSuggests(false)
    }
  }

  const _handleSelect = (suggest) => {
    setShowSuggests(false)
    onSelect(suggest)
    setSelected(suggest.Address.Label)
  }

  return (
    <>
      {/* <CustomInput
        {...props}
        label={label}
        // style={{ backgroundColor: colors.surface, marginBottom: -12 }}
        // selectionColor={colors.primary}
        // underlineColor="transparent"
        // mode="outlined"
        onChange={(event) => _handleChangeText(event.target.value)}
        value={selected != null ? selected : val != null ? val : value}
        customStyle={{ fontSize: 16, flex: 1, marginLeft: 0, paddingHorizontal: 0, paddingVertical: 0, textAlign: 'left' }}
      /> */}

      <CustomInput
        placeholder={label}
        // style={styles.textInput}
        // onChangeText={handleChangeName}
        //onBlur={handleBlur('name')}
        onChangeText={_handleChangeText}
        value={selected != null ? selected : val != null ? val : value}
        customStyle={{ fontSize: 16, flex: 1, marginLeft: 0, paddingHorizontal: 0, paddingVertical: 0, textAlign: 'left' }}
      />

      {showSuggests && suggests != null && (
        <ScrollView style={{ border: '1px solid #eee', background: '#fff', marginTop: 0 }}>
          {suggests.length > 0 ? (<>
            {suggests.map((suggest, i) => (
              i < 5 ? (<TouchableOpacity key={suggest.Location.LocationId}
                style={{
                  // paddingHorizontal: 20,
                  // borderWidth: 1,
                  // borderColor: '#ffffff1a',
                  marginTop: -1,
                  // borderBottomLeftRadius: 5,
                  // borderBottomRightRadius: 5,
                  backgroundColor: '#00000064',
                  opacity: .6,
                  // paddingHorizontal: styleType==='border' ? 15 : 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  // marginHorizontal: 5,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.primary + '52',
                }}
                onPress={() => _handleSelect(suggest.Location)}
              >
                <Text>{suggest.Location.Address.Label}</Text>
              </TouchableOpacity>) : null
            ))}
          </>) : (
            <View></View>
          )}
        </ScrollView>
      )}
    </>
  )
}

// export default { HerePlacesInput, TIMEZONEDB_API_KEY }
export default React.memo(HerePlacesInput)