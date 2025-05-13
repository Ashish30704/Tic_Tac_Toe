import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GameScreen from '../screens/GameScreen';
import {Provider} from 'react-redux';
import store from '../redux/store';
import HomeScreen from '../screens/HomeScreen';
import GameRoom from '../screens/GameRoom';
import EnterCode from '../screens/EnterCode';
import GetUserName from '../screens/GetUserName';
import SplashScreen from '../screens/SplashScreen';
import OnlineGameScreen from '../screens/OnlineGameScreen';

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          // initialRouteName="User"
          // initialRouteName="Game"
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen}></Stack.Screen>
          <Stack.Screen name="Game" component={GameScreen}></Stack.Screen>
          <Stack.Screen name="Room" component={GameRoom}></Stack.Screen>
          <Stack.Screen name="Code" component={EnterCode}></Stack.Screen>
          <Stack.Screen name="User" component={GetUserName}></Stack.Screen>
          <Stack.Screen name="Splash" component={SplashScreen}></Stack.Screen>
          <Stack.Screen name="OnlineGame" component={OnlineGameScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default MyStack;

const styles = StyleSheet.create({});
