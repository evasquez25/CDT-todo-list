import './App.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import { useState, useEffect } from 'react'

const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`
const token = `Bearer ${import.meta.env.VITE_PAT}`

function handleOptions(method, payload) {
    const options = {
        method: method,
        headers: {
            Authorization: token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }
    return options
}

const encodeUrl = ({ sortField, sortDirection }) => {
    let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`
    return encodeURI(`${url}?${sortQuery}`)
}

function App() {
    const [ todoList, setTodoList ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ isSaving, setIsSaving ] = useState(false)
    const [ sortField, setSortField ] = useState('createdTime')
    const [ sortDirection, setSortDirection ] = useState('desc')

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
        const options = handleOptions('POST', payload)

        try {
            setIsSaving(true)
            const resp = await fetch(encodeUrl({sortDirection: sortDirection, sortField: sortField}), options)  // Add todo to AirTable first
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

    const completeTodo = async (completedTodo) => {
        // Optimistically complete todo
        const updatedTodos = todoList.map((todo) => 
            todo.id === completedTodo.id ? {...todo, isCompleted: true} : todo
        )
        setTodoList(updatedTodos)

        // Setup to update Airtable
        const payload = {
            records: [
                {
                    id: completedTodo.id,
                    fields: {
                        title: completedTodo.title,
                        isCompleted: true
                    }
                }
            ]
        }
        const options = handleOptions('PATCH', payload)

        try {
            // Update Airtable with completed todo
            setIsSaving(true)
            const resp = await fetch(encodeUrl({sortDirection: sortDirection, sortField: sortField}), options)
            if (!resp.ok) {
                throw new Error(resp.message)
            }
        } catch(err) {
            // Revert todos to original list if error happens
            console.log(err.message)
            setErrorMessage(`${err.message}. Reverting todo...`)
            const revertedTodos = todoList.map((todo) =>
                todo.id === completedTodo.id ? {...todo, isCompleted: false} : todo
            )
            setTodoList(revertedTodos)
        } finally {
            setIsSaving(false)
        }
    }

    const updateTodo = async (currentTodo) => {
        // Optimistically update state before updating Airtable
        const updatedTodos = todoList.map((todo) =>
        todo.id === currentTodo.id ? currentTodo : todo
        )
        setTodoList(updatedTodos)

        // Setup to update Airtable
        const originalTodo = todoList.find((todo) => todo.id === currentTodo.id)
        const payload = {
            records: [
                {
                    id: currentTodo.id,
                    fields: {
                        title: currentTodo.title,
                        isCompleted: currentTodo.isCompleted
                    }
                }
            ]
        }
        const options = handleOptions('PATCH', payload)

        try {
            // Update record in Airtable
            setIsSaving(true)
            const resp = await fetch(encodeUrl({sortDirection: sortDirection, sortField: sortField}), options)
            if (!resp.ok) {
                throw new Error(resp.message)
            }
        } catch(err) {
            // Revert to old record if there's an error
            console.log(err.message)
            setErrorMessage(`${err.message}. Reverting todo...`)
            const revertedTodos = todoList.map((todo) =>
                todo.id === currentTodo.id ? originalTodo : todo
            )
            setTodoList(revertedTodos)
        } finally {
            setIsSaving(false)
        }
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
            const resp = await fetch(encodeUrl({sortDirection: sortDirection, sortField: sortField}), options)
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
    }, [sortDirection, sortField])

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
            />

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
