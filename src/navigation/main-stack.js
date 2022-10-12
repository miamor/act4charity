<<<<<<< Updated upstream
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native';
import React from 'react'
import { StatusBar, StyleSheet, View, Image } from 'react-native'
import { useTheme } from 'react-native-paper'
import {BottomNavigation, Text} from 'react-native-paper';

import DashboardHomeScreen from '../screens/DashboardHomeScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RewardScreen from '../screens/RewardScreen';

import { useGlobals } from '../contexts/global'
import { useIsDark } from '../hooks/use-theme'

import ChallengeStackNavigation from './challenge-stack'
import ChallengeListMapScreen from '../screens/challenge/map'
import RewardStackNavigation from './reward-stack'
import DashboardStackNavigation from './dashboard-stack';
import ProfileStackNavigation from './profile-stack';

const BarIcon = ({ color, size, name }) => {
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={name}
      style={{ marginTop: 4 }}
    />
  )
}
=======
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import {Text} from '../components/paper/typos';

import {useGlobals} from '../contexts/global';
import {useIsDark} from '../hooks/use-theme';
>>>>>>> Stashed changes

import ChallengeStackNavigation from './challenge-stack';
import ChallengeListMapScreen from '../screens/challenge/map';
import RewardStackNavigation from './reward-stack';
import ChallengeBottomSheet from '../components/challenge.bottom';
import DashboardStackNavigation from './dashboard-stack';
import ProfileStackNavigation from './profile-stack';

const BarIcon = ({color, size, name}) => {
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={name}
      style={{marginTop: 4}}
    />
  );
};

const BarLabel = ({color, children}) => {
  return (
    <Text
      style={{
        fontSize: 10,
        lineHeight: 20,
        textAlign: 'center',
        color,
      }}>
      {children}
    </Text>
  );
};

<<<<<<< Updated upstream
const Sta = createStackNavigator()

const Tab = createBottomTabNavigator()

function BottomBarNavigation() {
  const [{ session }] = useGlobals()
  const { colors } = useTheme()
  const _barStyle = useIsDark() ? 'light-content' : 'dark-content'

  return (
    <>
      <StatusBar
        barStyle={_barStyle}
        backgroundColor={colors.background}
        animated
      />
      <Tab.Navigator
      // initialRouteName="HomeScreen"
      // activeColor="red"
      // inactiveColor="white"
      // activeBackgroundColor="green"
      // inactiveBackgroundColor="green"
      // style={{ backgroundColor: 'green' }}
      
      barStyle={{backgroundColor: '#F6EDFF'}}

      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarStyle: {
        //   height: 90,
        //   paddingHorizontal: 5,
        //   paddingTop: 0,
        //   // backgroundColor: 'rgba(34,36,40,1)',
        //   position: 'absolute',
        //   borderTopWidth: 0,
        // },
      })}
      >
=======
const MyTabBarEle = ({props}) => {
  const {state, route, index, descriptors, navigation} = props;

  const {options} = descriptors[route.key];
  const label =
    options.tabBarIcon !== undefined
      ? options.tabBarIcon
      : options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // The `merge: true` option makes sure that the params inside the tab screen are preserved
      navigation.navigate({name: route.name, merge: true});
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? {selected: true} : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
      }}>
      {/* <Text style={{ color: isFocused ? '#673ab7' : '#222', backgroundColor: '#0f0' }}> */}
      {label}
      {/* </Text> */}
    </TouchableOpacity>
  );
};

const MyTabBar = ({state, descriptors, navigation}) => {
  const [{currentChallenge}] = useGlobals();

  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      {currentChallenge && <ChallengeBottomSheet />}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {state.routes.map((route, index) => (
          <MyTabBarEle
            key={`tabbarele-` + index}
            props={{state, route, index, descriptors, navigation}}
          />
        ))}
      </View>
    </View>
  );
};

const Sta = createStackNavigator();

const Tab = createBottomTabNavigator();

function BottomBarNavigation() {
  const [{loggedUser}] = useGlobals();
  const {colors} = useTheme();
  const _barStyle = useIsDark() ? 'light-content' : 'dark-content';

  return (
    <>
      <StatusBar
        barStyle={_barStyle}
        backgroundColor={colors.background}
        animated
      />

      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,

          // tabBarStyle: {
          //   height: 90,
          //   paddingHorizontal: 5,
          //   paddingTop: 0,
          //   // backgroundColor: 'rgba(34,36,40,1)',
          //   position: 'absolute',
          //   borderTopWidth: 0,
          // },
        })}
        tabBar={props => <MyTabBar {...props} />}>
>>>>>>> Stashed changes
        <Tab.Screen
          name="Dashboard"
          component={DashboardStackNavigation}
          options={{
<<<<<<< Updated upstream
            tabBarIcon: (props) => (
              <Image source={require('../assets/icons/home.png')} style={{width: 20, height: 20, marginTop: 4}}/>
              // <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Dashboard</BarLabel>
            ),
=======
            tabBarIcon: (
              <Image
                source={require('../assets/icons/home.png')}
                style={{width: 28, height: 28}}
              />
            ),
            // tabBarIcon: (props) => (
            //   <Image source={require('../assets/icons/home.png')} style={{ width: 28, height: 28 }} />
            //   // <BarIcon {...props} name="theme-light-dark" />
            // ),
            // tabBarLabel: (props) => (
            //   <BarLabel {...props}>Dashboard</BarLabel>
            // ),
>>>>>>> Stashed changes
            title: 'Challenges',
          }}
        />

        <Tab.Screen
<<<<<<< Updated upstream
          name="Challenges"
          component={ChallengeStackNavigation}
          options={{
            tabBarIcon: (props) => (
              <Image source={require('../assets/icons/challenges.png')} style={{width: 20, height: 20, marginTop: 4}} />
              // <BarIcon {...props} name="theme-light-dark" />
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Challenges</BarLabel>
            ),
            title: 'Challenges',
          }}
        />
        
        <Tab.Screen
          name="Profile"
          component={ProfileStackNavigation}
          options={{
            tabBarIcon: (props) => (
              // <BarIcon {...props} name="book-open-page-variant" />
              <Image source={require('../assets/icons/profile.png')} style={{width: 20, height: 20, marginTop: 4}}/>
            ),
            tabBarLabel: (props) => (
              <BarLabel {...props}>Profile</BarLabel>
            ),
=======
          name="ChallengesStack"
          component={ChallengeStackNavigation}
          options={{
            tabBarIcon: (
              <Image
                source={require('../assets/icons/challenges.png')}
                style={{width: 28, height: 28}}
              />
            ),
            // tabBarIcon: (props) => (
            //   <Image source={require('../assets/icons/challenges.png')} style={{width: 28, height: 28}} />
            //   // <BarIcon {...props} name="theme-light-dark" />
            // ),
            // tabBarLabel: (props) => (
            //   <BarLabel {...props}>Challenges</BarLabel>
            // ),
            title: 'Challenges',
          }}
        />

        <Tab.Screen
          name="RewardStack"
          component={RewardStackNavigation}
          options={{
            tabBarIcon: (
              <Image
                source={require('../assets/icons/rewards.png')}
                style={{width: 28, height: 28}}
              />
            ),
            // tabBarIcon: (props) => (
            //   // <BarIcon {...props} name="book-open-page-variant" />
            //   <Image source={require('../assets/icons/profile.png')} style={{width: 28, height: 28}}/>
            // ),
            // tabBarLabel: (props) => (
            //   <BarLabel {...props}>Profile</BarLabel>
            // ),
            title: 'Rewards',
          }}
        />

        <Tab.Screen
          name="ProfileStack"
          component={ProfileStackNavigation}
          options={{
            tabBarIcon: (
              <Image
                source={require('../assets/icons/profile.png')}
                style={{width: 28, height: 28}}
              />
            ),
            // tabBarIcon: (props) => (
            //   // <BarIcon {...props} name="book-open-page-variant" />
            //   <Image source={require('../assets/icons/profile.png')} style={{width: 28, height: 28}}/>
            // ),
            // tabBarLabel: (props) => (
            //   <BarLabel {...props}>Profile</BarLabel>
            // ),
>>>>>>> Stashed changes
            title: 'Rewards',
          }}
        />
      </Tab.Navigator>
    </>
<<<<<<< Updated upstream
  )
  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([
  //   {
  //     key: 'homeDash',
  //     title: 'Home',
  //     focusedIcon: () => (
  //       <Image
  //         source={require('../assets/icons/home.png')}
  //         style={{width: 24, height: 24}}
  //       />
  //     ),
  //   },
  //   {
  //     key: 'challenges',
  //     title: 'Challenges',
  //     focusedIcon: () => (
  //       <Image
  //         source={require('../assets/icons/challenges.png')}
  //         style={{width: 24, height: 24}}
  //       />
  //     ),
  //   },
  //   {
  //     key: 'rewards',
  //     title: 'Rewards',
  //     focusedIcon: () => (
  //       <Image
  //         source={require('../assets/icons/rewards.png')}
  //         style={{width: 24, height: 24}}
  //       />
  //     ),
  //   },
  //   {
  //     key: 'profile',
  //     title: 'Profile',
  //     focusedIcon: () => (
  //       <Image
  //         source={require('../assets/icons/profile.png')}
  //         style={{width: 24, height: 24}}
  //       />
  //     ),
  //   },
  // ]);

  // const renderScene = BottomNavigation.SceneMap({
  //   homeDash: DashboardStackNavigation,
  //   challenges: ChallengesScreen,
  //   rewards: RewardScreen,
  //   profile: ProfileStackNavigation,
  // });

  // return (
  //     <BottomNavigation
  //       navigationState={{index, routes}}
  //       onIndexChange={setIndex}
  //       renderScene={renderScene}
  //     />
  // );
=======
  );
>>>>>>> Stashed changes
}

function MainStackNavigation() {
  return (
    <>
<<<<<<< Updated upstream
      <Sta.Navigator screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#fff',
        },
      }} mode="modal">
=======
      <Sta.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: {
            // backgroundColor: '#00f',
          },
          // mode: 'modal'
        }}>
>>>>>>> Stashed changes
        <Sta.Screen
          name="Home"
          component={BottomBarNavigation}
          options={{
            cardStyle: {
              backgroundColor: '#000',
            },
          }}
        />
<<<<<<< Updated upstream

        {/* <Sta.Screen
          name="DiscoveryDestSelection"
          component={ChallengeListMapScreen}
          // options={{
          //   cardStyle: {
          //     backgroundColor: '#000',
          //     // marginTop: 50,
          //     // borderTopLeftRadius: 30,
          //     // borderTopRightRadius: 30,
          //   },
          // }}
        /> */}

=======
>>>>>>> Stashed changes
      </Sta.Navigator>
    </>
  );
}

export default MainStackNavigation;
