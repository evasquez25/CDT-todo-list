import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useState, useEffect } from 'react'

function App() {
  const [ todoList, setTodoList ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
  const token = `Bearer ${import.meta.env.VITE_PAT}`

  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false
    }

    setTodoList([...todoList, newTodo])
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return {...todo, isCompleted: true}
      }
      return todo
    })

    setTodoList(updatedTodos)
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === editedTodo.id) {
        return {...editedTodo}
      }
      return todo
    })

    setTodoList(updatedTodos)
  }

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true)

      const options = {
        method: "GET",
        headers: {
          "Authorization": token
        }
      }

      try {
        const resp = await fetch(url, options)
        if (!resp.ok) {
          throw new Error(resp.message)
        }

        const data = await resp.json()

        const fetchedTodos = data.records.map((record) => {
          const todo = {
            // Assign record properties from json to the appropriate todo properties
            id: record.id,
            ...record.fileds
          }
          if (!todo.isCompleted) {
            // Airtable doesn't return properties whose values are false or empty strings
            // Set property to false so field exists and prevents logic bugs
            todo.isCompleted = false 
          }
          return todo
        })
        setTodoList([...fetchedTodos])
      } catch(error) {
        //TODO
      } finally {
        //TODO
      }
    }
    fetchTodos()
  }, [])

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}></TodoList>
    </div>
  )
}

export default App
