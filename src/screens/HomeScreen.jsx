import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather'
import Wrapper from '../components/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../redux/slices/mainSlice';

const HomeScreen = () => {

  const user = useSelector(state => state.main.user)

  useEffect(()=> {
    const id = setInterval(() => {
      setColorList(prev => [prev[2], prev[0], prev[1]])
    }, 1000);
    return () => clearInterval(id)
  }, [])

  const navigation = useNavigation();
  
  const colors = ['#94dad8', '#feffa3', '#e7afed']
  const [colorList, setColorList] = useState(colors)

  const ticColor = colorList[0]
  const tacColor = colorList[1]
  const toeColor = colorList[2]

  const dispatch = useDispatch()

  return (
    // <View style={styles.mainBack}>
    <Wrapper>
        <View style={styles.headContainer}>
          <Image
            source={require('../assets/images/mainIcon.png')}
            style={{height: 50, width: 50}}
          />
          <Text style={[styles.heading, {color: ticColor}]}>Tic</Text>
          <Text style={[styles.heading, {color: tacColor}]}>Tac</Text>
          <Text style={[styles.heading, {color: toeColor}]}>Toe</Text>
        </View>
        <View style={styles.mainContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Game')}>
            <FeatherIcon style={{position: 'absolute', padding: 15}} name={'wifi-off'} size={25} color={'white'} />
            <Text style={styles.buttonText}>Play Offline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {user !== '' ? navigation.navigate('Room') : navigation.navigate('User')}}>
            <MaterialIcon style={{position: 'absolute', padding: 10}} name={'room-preferences'} size={30} color={'white'} />
            <Text style={styles.buttonText}>Create Room</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {user !== '' ? navigation.navigate('Code') : navigation.navigate('User')}}>
            <MaterialIcon style={{position: 'absolute', padding: 10}} name={'meeting-room'} size={30} color={'white'} />
            <Text style={styles.buttonText}>Join Room</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{backgroundColor: 'red'}}> */}
          <TouchableOpacity style={styles.logOut} onPress={()=>{
            dispatch(setUser(''))
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'User'}]
              })
            )
          }}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        {/* </View> */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>v1.0</Text>
        </View>
        </Wrapper>
    
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainBack: {
    flex: 1,
  },
  headContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flexDirection: 'row',
    gap: 10,
  },
  heading: {
    fontSize: 45,
    fontWeight: 700,
  },
  mainContainer: {
    alignSelf: 'center',
    padding: 40,
    gap: 20,
  },
  button: {
    flexDirection: 'row',
    padding: 15,
    paddingHorizontal: 70,
    backgroundColor: '#aeb7ff',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 40,
    shadowColor: 'white',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 600,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  footerText: {
    color: 'white',
  },
  logOut: {
    padding: 7,
    backgroundColor: '#ff6b6b',
    borderRadius: 10,
    position: 'absolute',
    bottom: '3%',
    // right: '5%'
  }
});
