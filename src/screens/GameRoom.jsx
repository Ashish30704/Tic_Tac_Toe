import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useSelector, useDispatch } from 'react-redux'
import { setGameRoom, setIsPlayer1 } from '../redux/slices/mainSlice'
import { createGameRoom } from '../utils/gameService'
import { useNavigation } from '@react-navigation/native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather'

const GameRoom = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.main.user)
  const gameRoomId = useSelector(state => state.main.gameRoomId)

  useEffect(() => {
    if (!user) {
      navigation.navigate('User')
      return
    }
    createRoom()
  }, [])

  const createRoom = async () => {
    try {
      setLoading(true)
      const roomId = await createGameRoom(user)
      dispatch(setGameRoom(roomId))
      dispatch(setIsPlayer1(true))
      setLoading(false)
    } catch (error) {
      Alert.alert('Error', error.message)
      setLoading(false)
    }
  }

  const startGame = () => {
    Alert.alert('Game Started')
    navigation.navigate('OnlineGame')
  }

  return (
    <Wrapper>
      <View style={styles.mainView}>
        <Text style={styles.heading}>Game Room Created</Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.label}>Share your username for others to join:</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{user}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            The other player needs to:
          </Text>
          <Text style={styles.infoStep}>
            1. Go to "Join Room" on their device
          </Text>
          <Text style={styles.infoStep}>
            2. Enter your username: <Text style={styles.highlightText}>{user}</Text>
          </Text>
          <Text style={styles.infoStep}>
            3. Wait for the game to connect
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={()=>startGame()}>
            <MaterialIcon name={'sports-esports'} size={25} color={'white'} />
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, {backgroundColor: '#ff6b6b'}]} onPress={() => navigation.navigate('Home')}>
            <FeatherIcon name={'x'} size={25} color={'white'} />
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Wrapper>
  )
}

export default GameRoom

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#94dad8',
    marginBottom: 20
  },
  codeContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  label: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  codeBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94dad8'
  },
  codeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#feffa3'
  },
  infoContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 10,
    marginTop: 10
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10
  },
  infoStep: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 10
  },
  highlightText: {
    color: '#feffa3',
    fontWeight: '700'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aeb7ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    elevation: 5
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})