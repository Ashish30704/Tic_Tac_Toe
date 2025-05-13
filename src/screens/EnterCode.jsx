import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Wrapper from '../components/Wrapper'
import { useSelector, useDispatch } from 'react-redux'
import { setGameRoom, setIsPlayer1, setOpponentUser } from '../redux/slices/mainSlice'
import { joinGameRoom, joinSpecificGameRoom } from '../utils/gameService'
import { useNavigation } from '@react-navigation/native'
import FeatherIcon from 'react-native-vector-icons/Feather'

const EnterCode = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [hostUsername, setHostUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useSelector(state => state.main.user)

  useEffect(() => {
    if (!user) {
      navigation.navigate('User')
    }
  }, [user, navigation])

  const joinRoom = async () => {
    if (!hostUsername.trim()) {
      Alert.alert('Error', 'Please enter the host username')
      return
    }

    if (hostUsername.trim() === user) {
      Alert.alert('Error', 'You cannot join your own game room')
      return
    }

    try {
      setLoading(true)
      // Join the room using the host's username
      const roomId = await joinGameRoom(hostUsername.trim())
      
      // Set the game room in Redux
      dispatch(setGameRoom(roomId))
      dispatch(setIsPlayer1(false))
      dispatch(setOpponentUser(hostUsername))
      
      // Join the specific room as player 2
      await joinSpecificGameRoom(roomId, user)
      
      // Navigate to the online game screen
      navigation.navigate('OnlineGame')
      setLoading(false)
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to join the game room')
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <View style={styles.mainView}>
        <Text style={styles.heading}>Join Game Room</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Enter Host's Username:</Text>
          <View style={styles.inputView}>
            <FeatherIcon name={'user'} size={20} color={'#333'} />
            <TextInput
              value={hostUsername}
              onChangeText={setHostUsername}
              placeholder="Host username"
              placeholderTextColor={'grey'}
              style={styles.input}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.disabledButton]} 
          onPress={joinRoom}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.buttonText}>Joining...</Text>
          ) : (
            <>
              <FeatherIcon name={'log-in'} size={20} color={'white'} />
              <Text style={styles.buttonText}>Join Game</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, {backgroundColor: '#ff6b6b', marginTop: 15}]} 
          onPress={() => navigation.navigate('Home')}
          disabled={loading}
        >
          <FeatherIcon name={'x'} size={20} color={'white'} />
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  )
}

export default EnterCode

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: '#94dad8',
    marginBottom: 30
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10
  },
  inputView: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    // alignSelf: 'center',
    width: 250,
    borderRadius: 10,
    height: 50,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aeb7ff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    elevation: 5
  },
  disabledButton: {
    opacity: 0.7
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
})