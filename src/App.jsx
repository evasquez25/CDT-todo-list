import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useState, useEffect } from 'react'

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
const token = `Bearer ${import.meta.env.VITE_PAT}`

function App() {
  const [ todoList, setTodoList ] = useState([])
  const [ isLoading, setIsLoading ] = useState(false)
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ isSaving, setIsSaving ] = useState(false)

  const addTodo = async (newTodo) => {
    // Build payload shaped like Airtable's API expects
    const payload = {
      records: [
        {
          fields: {
            title: newTodo.title,
            isCompleted: newTodo.isCompleted
          }
        }
      ]
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }

    try {
      setIsSaving(true)
      const resp = await fetch(url, options)  // Add todo to AirTable first
      if (!resp.ok) {
        throw new Error(resp.message)
      }

      const { records } = await resp.json()   // Then pull record from AirTable to show to user

      const savedTodo = {
        id: records[0].id,
        ...records[0].fields
      }
      if (!records[0].fields.isCompleted) {
        savedTodo.isCompleted = false
      }

      setTodoList([...todoList, savedTodo])
    } catch(err) {
      console.log(err)
      setErrorMessage(err.message)
    } finally {
      setIsSaving(false)
    }
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
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
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
            ...record.fields
          }
          if (!todo.isCompleted) {
            // Airtable doesn't return properties whose values are false or empty strings
            // Set property to false so field exists and prevents logic bugs
            todo.isCompleted = false 
          }
          return todo
        })
        setTodoList(fetchedTodos)  // Update todos
      } catch(err) {
        setErrorMessage(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTodos()
  }, [])

  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm 
        onAddTodo={addTodo}
        isSaving={isSaving}
      />
      
      <TodoList 
        todoList={todoList} 
        onCompleteTodo={completeTodo} 
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      >
      </TodoList>

      {errorMessage ? (
        <div>
          <hr/>
          <p>{errorMessage}</p>
          <button type="button" onClick={() => setErrorMessage('')}>Dismiss</button>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default App
