import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Wrapper from '../components/Wrapper';
import {useNavigation} from '@react-navigation/native';

const GameScreen = () => {
  const [array, setArray] = useState([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  const colors = [
    '#bbff80',
    '#b56eff',
    '#8add42',
    '#fd3d8f',
    '#33e79a',
    '#edeb6b',
  ];
  const [currentColor, setColor] = useState(colors[0]);
  const [turn, setTurn] = useState('O');
  const [winner, setWinner] = useState(null);

  useEffect(() => {}, [array, turn]);

  const handleClick = (Index, index) => {
    if (array[Index][index] !== null) return;
    const newArray = array.map((row, r) =>
      row.map((cell, c) => (r === Index && c === index ? turn : cell)),
    );
    const win = checkWinner(newArray);
    const isDraw = newArray.flat().every(cell => cell !== null) && !winner;
    setArray(newArray);
    if (win !== null) {
      setWinner(win);
      Alert.alert(`${win} Won`, 'Game Over');
      reset();
    } else {
      if (isDraw) {
        Alert.alert('Game Draw');
        reset();
        return;
      }
      setTurn(turn === 'O' ? 'X' : 'O');
      toogleColor();
    }
  };

  const toogleColor = () => {
    const index = colors.indexOf(currentColor);
    if (index < colors.length - 1) {
      setColor(colors[index + 1]);
    } else {
      setColor(colors[0]);
    }
  };

  const reset = () => {
    setArray([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);
    setWinner(null);
    setTurn('O');
  };

  const checkWinner = array => {
    for (let i = 0; i < 3; i++) {
      if (
        array[i][0] !== null &&
        array[i][0] === array[i][1] &&
        array[i][0] === array[i][2]
      ) {
        return array[i][0];
      }
      if (
        array[0][i] !== null &&
        array[0][i] === array[1][i] &&
        array[1][i] === array[2][i]
      ) {
        return array[0][i];
      }
    }
    if (
      array[0][0] !== null &&
      array[0][0] === array[1][1] &&
      array[0][0] === array[2][2]
    ) {
      return array[0][0];
    }
    if (
      array[0][2] !== null &&
      array[0][2] === array[1][1] &&
      array[0][2] === array[2][0]
    ) {
      return array[0][2];
    }
    return null;
  };

  const navigation = useNavigation();

  return (
    <Wrapper>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <Text style={[styles.heading, {color: '#feffa3'}]}>Tic</Text>
          <Text style={[styles.heading, {color: '#e7afed'}]}>Tac</Text>
          <Text style={[styles.heading, {color: '#94dad8'}]}>Toe</Text>
        </View>
        <Text style={[styles.turnText, {color: currentColor}]}>
          Player {turn}'s turn
        </Text>
      </View>

      <View style={styles.gameContainer}>
        {array.map((row, Index) => (
          <View key={Index} style={styles.row}>
            {row.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleClick(Index, index)}
                style={styles.boxView}>
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

      <View style={{flexDirection: 'row', gap: 20}}>
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <FeatherIcon name={'repeat'} size={25} color={'white'} />
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.resetButton, {backgroundColor: '#ff6b6b'}]}
          onPress={() => navigation.goBack()}>
          <FeatherIcon name={'arrow-left'} size={25} color={'white'} />
          <Text style={styles.resetText}>Go Back</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </Wrapper>
    // </ScrollView>
  );
};

export default GameScreen;

export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 40,
  },
  header: {
    alignItems: 'center',
    gap: 10,
  },
  heading: {
    flexDirection: 'row',
    fontSize: 45,
    fontWeight: 'bold',
  },
  turnText: {
    fontSize: 25,
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
  symbolText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  resetButton: {
    padding: 12,
    paddingHorizontal: 25,
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
