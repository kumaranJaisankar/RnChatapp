import {
  StyleSheet,
  Text,
  View,
  Alert,
  useAnimatedValue,
  Button,
  useColorScheme,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AppColors from '../colors/AppColors';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ChatPage from '../screens/ChatPage';
import Setting from '../screens/Setting';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

const MainScreen = ({navigation}) => {
  const [userDetails, setDetails] = useState({});
  const isDark = useColorScheme() === 'dark';
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await AsyncStorage.getItem('userDetail');
        console.log(response, 'ndjkbfbf');
        if (response === null) {
          navigation.navigate('login');
        } else {
          setDetails(JSON.parse(response));
        }
      } catch (error) {}
    };
    fetchDetails();
  }, []);
  const loggingOut = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('login');
    } catch (error) {
      Alert.alert(error);
    }
  };
  return (
    <Tab.Navigator
      initialRouteName="chatPage"
      screenOptions={({route}) => ({
        tabBarIcon: props => {
          console.log(route);
          switch (route.name) {
            case 'chatPage':
              return (
                <FontAwesome
                  name="group"
                  color={props.focused ? 'white' : '#938d8d'}
                  size={props.focused ? 29 : 25}
                />
              );
            case 'setting':
              return (
                <MaterialIcons
                  size={props.focused ? 29 : 25}
                  name="settings"
                  color={props.focused ? 'white' : '#938d8d'}
                />
              );
          }
        },
        tabBarStyle: {
          backgroundColor: isDark ? AppColors.darker : 'white',
          height: 70,
          margin: 0,
          padding: 0,
        },
        tabBarShowLabel: false,
        headerStyle: {backgroundColor: AppColors.darker},
        headerTintColor: AppColors.light,
        headerShadowVisible: true,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 100,
          fontSize: 20,
          letterSpacing: 3,
        },
      })}>
      <Tab.Screen
        name="chatPage"
        component={ChatPage}
        options={{
          title: 'Rn Chat',
        }}
      />
      <Tab.Screen name="setting" component={Setting} />
    </Tab.Navigator>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'green',
    width: 100,
  },
});
