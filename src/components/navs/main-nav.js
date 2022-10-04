import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/core';
import PropTypes from 'prop-types';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

/**
 * @param children
 * @param style {object}
 * @param rightButton {React.ComponentElement}
 * @returns {*}
 * @constructor
 */
function MainNav({ back, children, style, rightButton }) {
  const navigation = useNavigation();
  const { colors } = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, styles.container, style]}>
      <View style={styles.content}>
        {back && <MaterialCommunityIcons
          onPress={() => navigation.pop()}
          name="chevron-left"
          color={colors.text}
          size={30}
          style={{ opacity: 0.7 }}
        />}

        <MaterialCommunityIcons
          onPress={() => navigation.navigate('Profile', { key: 1 })}
          name="account-circle-outline"
          color={colors.text}
          size={30}
          style={{ opacity: 0.7, position: 'absolute', right: 0 }}
        />
        {rightButton}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    height: 50,
    marginHorizontal: 20,
    width: Dimensions.get('window').width - 30,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

MainNav.propTypes = {
  style: PropTypes.object,
  rightButton: PropTypes.element,
  back: PropTypes.bool
};

MainNav.defaultProps = {
  rightButton: <View style={{ width: 1 }} />,
  back: false
};

export default MainNav;
