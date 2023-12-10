import './App.css';
import Numbers from './components/Numbers';
import {useState} from 'react'


function App() {
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(10)
  const [numTasks, setNumTasks] = useState(5)
  const [tasks, setTasks] = useState([])


  const handleGenerateTasks = (e) => {
    console.log(e.target)
    e.preventDefault()
    const generateTasks = []
    for (let i = 0; i < numTasks; i++) {
      const num1 = Math.floor(Math.random() * (to - from + 1 ))
      const num2 = Math.floor(Math.random() * (to - from + 1 ))

      generateTasks.push(`${num1} + ${num2} =`)
    }
    setTasks(generateTasks)
  }


  return (
    <div className="App">
      <main>
        <header>Generate calculations...</header>
        <form onSubmit={handleGenerateTasks}>
        <input placeholder='from' value={from} onChange={(e) => setFrom(+e.target.value)} />
        <input placeholder='to' value={to} onChange={(e) => setTo(+e.target.value)}></input>
        <input placeholder='how many tasks?' value={numTasks} onChange={(e) => setNumTasks(+e.target.value)}></input>
        <button type='submit'>Generate tasks</button>
        <input type='checkbox' name='Two columns' id='twoColums' />
        </form>
      </main>

      <Numbers tasks={tasks}/>
    </div>
  );
}

export default App;
