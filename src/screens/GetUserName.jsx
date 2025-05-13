import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Wrapper from '../components/Wrapper';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/slices/mainSlice';
import {CommonActions, useNavigation} from '@react-navigation/native';

const GetUserName = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [user, setuser] = useState('');

  const EnterUser = () => {
    if (user !== '') {
      dispatch(setUser(user));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    } else {
      Alert.alert('please enter a username');
    }
  };

  return (
    <Wrapper>
      <View style={styles.mainView}>
        <View>
          <Text style={styles.heading}>Enter Your Unique UserName</Text>
        </View>
        <View style={styles.inputView}>
          <FeatherIcon name={'user'} size={20} />
          <TextInput
            value={user}
            onChangeText={v => setuser(v)}
            placeholder="userName"
            placeholderTextColor={'grey'}
            style={{
              flex: 1,
              color: 'black',
              fontSize: 15,
              paddingHorizontal: 15,
            }}
          />
        </View>
        <TouchableOpacity
          style={styles.enterButton}
          onPress={() => EnterUser()}>
          <FeatherIcon name={'plus'} size={20} color={'white'} />
          <Text style={styles.enterText}>Enter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.enterButton, {alignSelf: 'center', backgroundColor: '#ff6f6f'}]}
          onPress={() => {
           navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: 'Home'}]
            })
           ) 
          }}>
          <FeatherIcon name={'user'} size={20} color={'white'} />
          <Text style={styles.enterText}>Play as guest!</Text>
        </TouchableOpacity>
      </View>
    </Wrapper>
  );
};

export default GetUserName;

const styles = StyleSheet.create({
  mainView: {
    paddingHorizontal: 30,
    gap: 40,
  },
  heading: {
    alignSelf: 'center',
    color: 'white',
    fontSize: 20,
    fontWeight: 500,
  },
  inputView: {
    backgroundColor: 'white',
    alignSelf: 'center',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    height: 45,
    paddingHorizontal: 15,
  },
  enterButton: {
    padding: 8,
    paddingHorizontal: 20,
    backgroundColor: '#aeb7ff',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    elevation: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  enterText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
