import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../redux/slices/mainSlice'
import Wrapper from '../components/Wrapper'

const SplashScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    useEffect(()=>{
        const timer = setTimeout(() => {
            GetUser()
        }, 2000);

        return () => clearTimeout(timer)
    }, [])

    const GetUser = async() => {
        try{
            const user = await AsyncStorage.getItem('user')
            if(user && user !==null) {
                dispatch(setUser(user))

                navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: 'Home'}]}))
            } else {
                navigation.dispatch(CommonActions.reset({index: 0, routes: [{name: 'User'}]}))
            }

        } catch (e) {
            console.error(e.message)
        }        
    }

  return (
    <Wrapper>
        <Image source={require('../assets/images/mainIcon.png')} style={{height: 100, width: 100}} />
    </Wrapper>
  )
}

export default SplashScreen

const styles = StyleSheet.create({})
