import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import React from 'react'

const Wrapper = ({children, styleBackground, style}) => {
  return (
    <ImageBackground
          style={[styles.background, {styleBackground}]}
          source={require('../assets/images/background11.jpg')}>
    
        <View style={[styles.shadow, {style}]}>
           {children} 
        </View>
    
        </ImageBackground>
  )
}

export default Wrapper

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    shadow: {
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
    }
})