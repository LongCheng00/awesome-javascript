import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import Board from './components/Board'
import './App.css'

function Products() {
  const products = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Smartphone', price: 499.99, isSmart: true },
    { id: 3, name: 'Tablet', price: 299.99 },]
  const listItems = products.map((product) =>
    <li key={product.id}
      style={{ color: product.isSmart ? 'magenta' : 'darkgreen' }}>
      {product.name}</li>
  )
  return (
    <ul>{listItems}</ul>
  )
}

function UserProfile() {
  const user = {
    name: 'Hedy Lamarr',
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 90,
    count: 0,
  };
  return (
    <>
      <h1>{user.name} </h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize,
          borderRadius: '50%',
          border: '2px dashed green'
        }}
      />
    </>
  )
}

function MyButton({ count, onClick }) {
  const [sum, setSum] = useState(0)

  const handleClick = () => {
    setSum(sum + 1)
  };
  return (
    <>
      <button className="my-button" onClick={onClick}>
        Click Parent's Count: {count}</button>

      <button className="my-button" onClick={handleClick}>
        Click Me
      </button>
      {sum}
    </>
  )
}
function Square({ value, onSquareClick }:
  { value: number, onSquareClick }) {
  function handleClick() {
  }
  return <button className="square" onClick={onSquareClick}>{value}</button>
}
function Board() {
  const [xIsNext, setXIsNext] = useState(true)
  const [squares, setSquares] = useState(Array(9).fill(null))
  function handleClick(i: number) {
    console.log("Square clicked")
    if (squares[i] || calculateWinner(squares)) {
      return
    }
    const newSquares = squares.slice()
    newSquares[i] = xIsNext ? "X" : "O"
    setSquares(newSquares)
    setXIsNext(!xIsNext)
  }
  function calculateWinner(squares: Array<string | null>) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b]
        && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
    <div className='status'>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  )
}

function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return (
    <>
      <Board />
      <UserProfile />
      <div>
        <MyButton count={count} onClick={handleClick} />
        <Products />
        <MyButton count={count} onClick={handleClick} />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
