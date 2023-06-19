import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import MainScreen from './MainScreenNavigator';
import Chat from '../screens/Chat';
import AppColors from '../colors/AppColors';
import UploadImage from '../components/UploadImage';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="splash"
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="mainScreen"
          component={MainScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="chat"
          component={Chat}
          options={({route}) => {
            const userName = route.params.data.name;
            const userAvatar = route.params.data.avatar;
            return {
              headerStyle: {backgroundColor: AppColors.dark},
              headerTintColor: 'white',
              headerRight: props => {
                return (
                  <View {...props}>
                    <Text>search</Text>
                  </View>
                );
              },
              title: userName,
              headerTitle: props => {
                return (
                  <View
                    {...props}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginLeft: 0,
                    }}>
                    {userAvatar === null ? (
                      <Image
                        style={{width: 30, height: 30}}
                        source={require('../images/user.png')}
                      />
                    ) : (
                      <Image
                        style={{width: 30, height: 30, borderRadius: 20}}
                        source={{uri: userAvatar}}
                      />
                    )}
                    <Text style={{fontSize: 17}}>{userName}</Text>
                  </View>
                );
              },
              headerBackTitleStyle: {marginRight: 0},
              headerBackTitleStyle: {
                backgroundColor: 'red',
                padding: 20,
              },
            };
          }}
        />
        <Stack.Screen
          name="uploadimage"
          component={UploadImage}
          options={{
            headerStyle: {backgroundColor: AppColors.dark},
            headerTintColor: 'white',
            title: 'Change Image',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
