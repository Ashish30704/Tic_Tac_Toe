import AsyncStorage from "@react-native-async-storage/async-storage"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: '',
    array: [[null, null, null],[null, null, null],[null, null, null],],
    gameRoomId: null,
    isPlayer1: false,
    opponentUser: null,
    isOnlineGame: false,
    currentTurn: 'O',
    gameStatus: 'waiting' // waiting, playing, finished
}

const setData = async(data) => {
    try {
        await AsyncStorage.setItem('user', data)
    } catch (e) {
        console.error(e.message)
    }
}

const mainslice = createSlice({
    name:"main",
    initialState, 
    reducers: {
        setUser: (state, actions) => {
            state.user = actions.payload
            setData(state.user)
        },
        setGameRoom: (state, actions) => {
            state.gameRoomId = actions.payload
        },
        setIsPlayer1: (state, actions) => {
            state.isPlayer1 = actions.payload
        },
        setOpponentUser: (state, actions) => {
            state.opponentUser = actions.payload
        },
        setIsOnlineGame: (state, actions) => {
            state.isOnlineGame = actions.payload
        },
        setGameArray: (state, actions) => {
            state.array = actions.payload
            // console.error('slice array', state.array)
        },
        setCurrentTurn: (state, actions) => {
            state.currentTurn = actions.payload
        },
        setGameStatus: (state, actions) => {
            state.gameStatus = actions.payload
        },
        resetGame: (state) => {
            state.array = [[null, null, null],[null, null, null],[null, null, null]]
            state.currentTurn = 'O'
            state.gameStatus = 'waiting'
        },
        resetOnlineGame: (state) => {
            state.gameRoomId = null
            state.isPlayer1 = false
            state.opponentUser = null
            state.isOnlineGame = false
            state.array = [[null, null, null],[null, null, null],[null, null, null]]
            state.currentTurn = 'O'
            state.gameStatus = 'waiting'
        }
    }
})

export const {
    setUser, 
    setGameRoom, 
    setIsPlayer1, 
    setOpponentUser, 
    setIsOnlineGame, 
    setGameArray, 
    setCurrentTurn, 
    setGameStatus,
    resetGame,
    resetOnlineGame
} = mainslice.actions
export default mainslice.reducer