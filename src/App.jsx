import { useState } from 'react'
import './App.css'
import Field from './components/Filed'
import confetti from 'canvas-confetti'

const TURNOS = {
  x: "x",
  o: "o"
}

const WINNER_COMBS = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
]

function App() {
  const [board, setBoard] = useState(() => {
    const readLocalStorage = window.localStorage.getItem("board");
    if(readLocalStorage) return JSON.parse(readLocalStorage)
    return Array(9).fill(null)})
  
  const [turno, setTurnos] = useState(() => {
    const readLocalStorage = window.localStorage.getItem("turno")
    if(readLocalStorage) return readLocalStorage
    return TURNOS.x})
  const [winner, setWinner] = useState(null) // null => no hay | false => empate | true => winner
  const updateBoard = (index) => {
    setWinner(null)
    if(board[index]) return ;
    const newBoard = [...board];
    newBoard[index] = turno

    setBoard(newBoard)
    const nuevoTurno = turno === TURNOS.x ? TURNOS.o : TURNOS.x;
    setTurnos(nuevoTurno)
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turno", nuevoTurno)
    const getWinner = checkWinner(newBoard);
    if(getWinner) {
      confetti()
      setWinner(getWinner);
      window.localStorage.removeItem("board")
    } else {
      checkGameOver(newBoard)
    }
  }

  const checkWinner = (boardToCheck) => {
    for(const comb of WINNER_COMBS) {
      const [a,b,c] = comb;
      if( // Si son los tres valores iguales (X u O)
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] && 
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  }

  const resetGame = () => {
    setWinner(null)
    setBoard(Array(9).fill(null))
  }

  const checkGameOver = (newBoard) => {
    if(newBoard.every(field => field !== null)) {
      setWinner(false)
    } 
  }
  return (
    <>
      <main className='board'>
        <h1>Tres rayas minijuego</h1>
        <section>
        {
          
          winner === "x" || winner === "o" ? 
          <div className='winner'>
            <div>
            <h1>Felicidades!</h1>
            <p className='text'>El ganador es {winner.toUpperCase()}</p> 
            <button onClick={resetGame}>Jugar</button>
            </div>
          </div>
          : null
        }
        {
          winner === false ? <div className='winner'>
          <div>
          <h1>Empate!</h1>
          <p className='text-empate'>No hay ganador</p> 
          <button onClick={resetGame}>Jugar</button>
          </div>
        </div>
        : null
        }
        </section>
        <section className='game'>
          {board.map((field, index) => (
            <Field 
            key={index} 
            index={index}
            updateBoard={updateBoard}>
              {field}
            </Field>
          ))}
        </section>
        { winner === "x" || winner === "o" || winner === false ? <section></section> : 
        <section className='turn'>
          <h1 className={`square ${turno === TURNOS.x ? 'is-selected' : null}`}>X</h1>
          <h1 className={`square ${turno === TURNOS.o ? 'is-selected' : null}`}>O</h1>
        </section>

        }
      </main>
    </>
  )
}

export default App
