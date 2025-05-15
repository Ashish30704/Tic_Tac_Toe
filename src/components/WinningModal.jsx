// src/components/WinningModal.jsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const WinningModal = ({visible, result, onClose, onPlayAgain}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.iconContainer}>
            {result === 'draw' ? (
              <FeatherIcon name="refresh-cw" size={50} color="#FFD700" />
            ) : (
              <FeatherIcon
                name={result === 'O' ? 'circle' : 'x'}
                size={50}
                color={result === 'O' ? 'red' : 'black'}
              />
            )}
          </View>
          
          <Text style={styles.title}>
            {result === 'draw' ? 'Game Draw!' : `${result} Won!`}
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
              <FeatherIcon name="refresh-cw" size={20} color="white" />
              <Text style={styles.buttonText}>Play Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, {backgroundColor: '#ff6b6b'}]} 
              onPress={onClose}>
              <FeatherIcon name="x" size={20} color="white" />
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: Dimensions.get('window').width * 0.85,
    alignItems: 'center',
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    gap: 10
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aeb7ff',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    elevation: 10,
    gap: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WinningModal;