import { db } from './firebase';
// import {getAuth} from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    onSnapshot,
    arrayUnion,
    query,
    where,
    getDocs
} from 'firebase/firestore';

const GAMES_COLLECTION = 'games';

// Create a new game room
export const createGameRoom = async (username) => {
    try {
        const gameRef = doc(collection(db, GAMES_COLLECTION));
        await setDoc(gameRef, {
            player1: username,
            player2: null,
            gameBoard: JSON.stringify([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]),
            currentTurn: 'O',
            gameStatus: 'waiting',
            winner: null,
            createdAt: new Date()
        });
        return gameRef.id;
    } catch (error) {
        console.error('Error creating game room:', error);
        throw error;
    }
};

// Join a game room using username of creator as room code
export const joinGameRoom = async (creatorUsername) => {
    try {
        // Find game room by creator's username
        const q = query(
            collection(db, GAMES_COLLECTION), 
            where('player1', '==', creatorUsername),
            where('gameStatus', '==', 'waiting')
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            throw new Error('Game room not found or already full');
        }
        
        // Get the first matching room
        const gameDoc = querySnapshot.docs[0];
        return gameDoc.id;
    } catch (error) {
        console.error('Error joining game room:', error);
        throw error;
    }
};

// Join a specific game room as player 2
export const joinSpecificGameRoom = async (gameId, username) => {
    try {
        const gameRef = doc(db, GAMES_COLLECTION, gameId);
        const gameSnap = await getDoc(gameRef);
        
        if (!gameSnap.exists()) {
            throw new Error('Game room not found');
        }
        
        const gameData = gameSnap.data();
        
        if (gameData.player2) {
            throw new Error('Game room is already full');
        }
        
        await updateDoc(gameRef, {
            player2: username,
            gameStatus: 'playing'
        });
        
        return true;
    } catch (error) {
        console.error('Error joining specific game room:', error);
        throw error;
    }
};

// Make a move in a game
export const makeMove = async (gameId, row, col, symbol, username) => {
    try {
        const gameRef = doc(db, GAMES_COLLECTION, gameId);
        const gameSnap = await getDoc(gameRef);
        
        if (!gameSnap.exists()) {
            throw new Error('Game not found');
        }
        
        const gameData = gameSnap.data();
        console.error('game Data:', gameData, '\n',)
        
        // Check if it's the player's turn
        const isPlayer1 = gameData.player1 === username;
        const isPlayer2 = gameData.player2 === username;
        
        if (!isPlayer1 && !isPlayer2) {
            throw new Error('You are not a player in this game');
        }
        
        if ((isPlayer1 && gameData.currentTurn !== 'O') || 
            (isPlayer2 && gameData.currentTurn !== 'X')) {
            throw new Error('Not your turn');
        }
        
        // Check if the cell is empty
        const board = JSON.parse(gameData.gameBoard)
        // if (gameData.gameBoard[row][col] !== null) {
        if (board[row][col] !== null) {
            throw new Error('Cell already occupied');
        }
        
        // Create a copy of the game board and update the cell
        const newBoard = [...gameData.gameBoard];
        newBoard[row][col] = symbol;
        
        // Check for a winner
        const winner = checkWinner(newBoard);
        const nextTurn = symbol === 'O' ? 'X' : 'O';
        
        // Check if the game is a draw
        const isDraw = newBoard.flat().every(cell => cell !== null) && !winner;
        
        await updateDoc(gameRef, {
            gameBoard: newBoard,
            currentTurn: nextTurn,
            gameStatus: winner || isDraw ? 'finished' : 'playing',
            winner: winner || (isDraw ? 'draw' : null)
        });
        
        return {
            gameBoard: newBoard,
            currentTurn: nextTurn,
            gameStatus: winner || isDraw ? 'finished' : 'playing',
            winner: winner || (isDraw ? 'draw' : null)
        };
    } catch (error) {
        console.error('Error making move:', error);
        throw error;
    }
};

// Listen for game updates
export const listenToGameUpdates = (gameId, callback) => {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    return onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            callback(null);
        }
    });
};

// Reset the game
export const resetGame = async (gameId) => {
    try {
        const gameRef = doc(db, GAMES_COLLECTION, gameId);
        
        await updateDoc(gameRef, {
            gameBoard: JSON.stringify([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ]),
            currentTurn: 'O',
            gameStatus: 'playing',
            winner: null
        });
        
        return true;
    } catch (error) {
        console.error('Error resetting game:', error);
        throw error;
    }
};

// Leave the game
export const leaveGame = async (gameId, username) => {
    try {
        const gameRef = doc(db, GAMES_COLLECTION, gameId);
        const gameSnap = await getDoc(gameRef);
        
        if (!gameSnap.exists()) {
            throw new Error('Game not found');
        }
        
        const gameData = gameSnap.data();
        
        // Check if the player is in the game
        const isPlayer1 = gameData.player1 === username;
        const isPlayer2 = gameData.player2 === username;
        
        if (!isPlayer1 && !isPlayer2) {
            throw new Error('You are not a player in this game');
        }
        
        // If player1 leaves, the game is over
        if (isPlayer1) {
            await updateDoc(gameRef, {
                gameStatus: 'finished',
                winner: gameData.player2 || 'Player 2'
            });
        }
        
        // If player2 leaves, the game is over
        if (isPlayer2) {
            await updateDoc(gameRef, {
                gameStatus: 'finished',
                winner: gameData.player1 || 'Player 1'
            });
        }
        
        return true;
    } catch (error) {
        console.error('Error leaving game:', error);
        throw error;
    }
};

// Helper function to check for a winner
const checkWinner = (board) => {
    // Check rows
    for (let i = 0; i < 3; i++) {
        if (board[i][0] !== null && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            return board[i][0];
        }
    }
    
    // Check columns
    for (let i = 0; i < 3; i++) {
        if (board[0][i] !== null && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
            return board[0][i];
        }
    }
    
    // Check diagonals
    if (board[0][0] !== null && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0];
    }
    
    if (board[0][2] !== null && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2];
    }
    
    return null;
}; 