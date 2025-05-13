import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import React, {useEffect, useState} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Wrapper from '../components/Wrapper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { 
  listenToGameUpdates, 
  makeMove, 
  resetGame as resetFirebaseGame,
  leaveGame
} from '../utils/gameService';
import { 
  resetOnlineGame, 
  setGameArray, 
  setCurrentTurn,
  setGameStatus
} from '../redux/slices/mainSlice';

const OnlineGameScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get game state from Redux
  const user = useSelector(state => state.main.user);
  const gameRoomId = useSelector(state => state.main.gameRoomId);
  const isPlayer1 = useSelector(state => state.main.isPlayer1);
  const opponentUser = useSelector(state => state.main.opponentUser);
  const array = useSelector(state => state.main.array);
  
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waitingForPlayer, setWaitingForPlayer] = useState(true);
  const [localTurn, setLocalTurn] = useState('O');
  const [winner, setWinner] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  
  const colors = ['#bbff80', '#b56eff', '#8add42', '#fd3d8f', '#33e79a', '#edeb6b'];
  const [currentColor, setColor] = useState(colors[0]);

  useEffect(() => {
    if (!gameRoomId) {
      navigation.navigate('Home');
      return;
    }
    
    // Subscribe to game updates
    const unsub = listenToGameUpdates(gameRoomId, (data) => {
      if (!data) {
        Alert.alert('Error', 'Game room not found');
        navigation.navigate('Home');
        return;
      }
      
      setGameData(data);
      
      // Update waiting status
      if (data.player2 && data.gameStatus === 'playing') {
        setWaitingForPlayer(false);
      } else if (data.gameStatus === 'waiting') {
        setWaitingForPlayer(true);
      }
      
      // Update game board
      dispatch(setGameArray(JSON.parse(data.gameBoard)));
      
      // Update turn
      dispatch(setCurrentTurn(data.currentTurn));
      setLocalTurn(data.currentTurn);
      
      // Update game status
      dispatch(setGameStatus(data.gameStatus));
      
      // Check winner
      if (data.winner) {
        setWinner(data.winner);
        if (data.winner === 'O' || data.winner === 'X') {
          const winnerName = (data.winner === 'O') ? data.player1 : data.player2;
          const isCurrentUserWinner = winnerName === user;
          Alert.alert(
            'Game Over',
            isCurrentUserWinner ? 'You won! 🎉' : `${winnerName} won!`,
            [{ text: 'OK' }]
          );
        } else if (data.winner === 'draw') {
          Alert.alert('Game Over', 'It\'s a draw!', [{ text: 'OK' }]);
        }
      }
      
      setLoading(false);
    });
    
    setUnsubscribe(() => unsub);
    
    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [gameRoomId, navigation, dispatch, user]);

  const toogleColor = () => {
    const index = colors.indexOf(currentColor);
    if(index < colors.length-1) {
      setColor(colors[index + 1]);
    } else {
      setColor(colors[0]);
    }
  };

  const handleClick = async (row, col) => {
    // Don't allow moves if game is not playing
    if (!gameData || gameData.gameStatus !== 'playing') return;
    
    // Don't allow moves if it's not the player's turn
    const isMyTurn = (isPlayer1 && localTurn === 'O') || (!isPlayer1 && localTurn === 'X');
    if (!isMyTurn) return;
    
    // Don't allow moves if cell is already filled
    if (array[row][col] !== null) return;
    
    try {
      // Make the move
      await makeMove(gameRoomId, row, col, localTurn, user);
      toogleColor();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const resetGameAction = async () => {
    try {
      await resetFirebaseGame(gameRoomId);
      setWinner(null);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  
  const exitGame = async () => {
    try {
      // Leave the game in Firebase
      if (gameRoomId) {
        await leaveGame(gameRoomId, user);
      }
      
      // Clean up local state
      if (unsubscribe) {
        unsubscribe();
      }
      
      // Reset game state in Redux
      dispatch(resetOnlineGame());
      
      // Navigate back to home
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error leaving game:', error);
      
      // Even if there's an error, try to navigate home
      dispatch(resetOnlineGame());
      navigation.navigate('Home');
    }
  };

  if (loading) {
    return (
      <Wrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#aeb7ff" />
          <Text style={styles.loadingText}>Loading game...</Text>
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={[styles.heading, {color: '#feffa3'}]}>Tic</Text>
          <Text style={[styles.heading, {color: '#e7afed'}]}>Tac</Text>
          <Text style={[styles.heading, {color: '#94dad8'}]}>Toe</Text>
        </View>
        
        {waitingForPlayer ? (
          <View style={styles.waitingContainer}>
            <ActivityIndicator size="small" color="#aeb7ff" />
            <Text style={styles.waitingText}>Waiting for player to join...</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.turnText, {color: currentColor}]}>
              {localTurn === 'O' ? `${gameData?.player1}'s turn (O)` : `${gameData?.player2}'s turn (X)`}
            </Text>
            
            <View style={styles.playersContainer}>
              <Text style={styles.playerText}>
                You: {isPlayer1 ? 'O' : 'X'} {isPlayer1 ? '(First)' : '(Second)'}
              </Text>
              <Text style={styles.playerText}>
                Opponent: {!isPlayer1 ? 'O' : 'X'}
              </Text>
            </View>
          </>
        )}
      </View>

      <View style={styles.gameContainer}>
        {array.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                onPress={() => handleClick(rowIndex, colIndex)}
                style={styles.boxView}
                disabled={waitingForPlayer || winner !== null}>
                {item === 'O' ? (
                  <FeatherIcon name={'circle'} size={40} color={'red'} />
                ) : item === 'X' ? (
                  <MaterialIcon name={'close'} size={40} color={'black'} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={()=>resetGameAction()}>
          <FeatherIcon name={'repeat'} size={25} color={'white'} />
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.resetButton, {backgroundColor: '#ff6b6b'}]} 
          onPress={exitGame}
        >
          <FeatherIcon name={'x'} size={25} color={'white'} />
          <Text style={styles.resetText}>EXIT</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default OnlineGameScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  heading: {
    flexDirection: 'row',
    fontSize: 45,
    fontWeight: 'bold',
  },
  turnText: {
    fontSize: 25,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  waitingText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  playersContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  playerText: {
    color: 'white',
    fontSize: 14,
  },
  gameContainer: {
    borderWidth: 2,
    borderColor: '#a399d0',
    borderRadius: 15,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  row: {
    flexDirection: 'row',
  },
  boxView: {
    height: 70,
    width: 70,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 20
  },
  resetButton: {
    padding: 12,
    paddingHorizontal: 30,
    backgroundColor: '#aeb7ff',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resetText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
}); 