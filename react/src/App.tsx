import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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

function App() {
  const [count, setCount] = useState(0)
  function handleClick() {
    setCount(count + 1)
  }
  return (
    <>
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
