import './App.css'
import styles from './App.module.css'
import TodoList from './features/TodoList/TodoList'
import TodoForm from './features/TodoForm'
import TodosViewForm from './features/TodosViewForm'
import TodosPage from './pages/TodosPage'
import Header from './shared/Header'

import { useState, useEffect, useCallback, useReducer } from 'react'
import {
    todosReducer,
    actions as todoActions,
    initialState as initialTodosState,
} from './reducers/todos.reducer';
import { useLocation, Routes, Route } from 'react-router'

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


function App() {
    const [ sortField, setSortField ] = useState('createdTime')
    const [ sortDirection, setSortDirection ] = useState('desc')
    const [ queryString, setQueryString ] = useState('')
    const [ title, setTitle ] = useState('')

    const [ todoState, dispatch ] = useReducer(todosReducer, initialTodosState)

    const location = useLocation()

    const encodeUrl = useCallback(() => {
        let searchQuery = ''
        let sortQuery = `sort[0][field]=${sortField}&sort[0][direction]=${sortDirection}`
    
        if (queryString) {
            searchQuery = `&filterByFormula=SEARCH("${queryString}",+title)`
        }
        return encodeURI(`${url}?${sortQuery}${searchQuery}`)
    }, [queryString, sortDirection, sortField])

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
            dispatch({ type: todoActions.startRequest })
            // Add todo to AirTable first
            const resp = await fetch(encodeUrl(), options)
            if (!resp.ok) {
                throw new Error(resp.message)
            }

            // Then pull record from AirTable to show to user
            const { records } = await resp.json()
            dispatch({ type: todoActions.addTodo, record: records[0] })
        } catch(err) {
            dispatch({ type: todoActions.setLoadError, error: err })
        } finally {
            dispatch({ type: todoActions.endRequest })
        }
    }

    const completeTodo = async (completedTodo) => {
        // Optimistically complete todo
        dispatch({ type: todoActions.completeTodo, completedTodo })

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
            dispatch({ type: todoActions.startRequest })
            const resp = await fetch(encodeUrl(), options)
            if (!resp.ok) {
                throw new Error(resp.message)
            }
        } catch(err) {
            // Revert todos to original list if error happens
            dispatch({ type: todoActions.revertTodo, originalTodo: completedTodo, error: err })
        } finally {
            dispatch({ type: todoActions.endRequest })
        }
    }

    const updateTodo = async (editedTodo) => {
        // Optimistically update state before updating Airtable
        dispatch({ type: todoActions.updateTodo, editedTodo })

        // Setup to update Airtable
        const originalTodo = todoState.todoList.find((todo) => todo.id === editedTodo.id)
        const payload = {
            records: [
                {
                    id: editedTodo.id,
                    fields: {
                        title: editedTodo.title,
                        isCompleted: editedTodo.isCompleted
                    }
                }
            ]
        }
        const options = handleOptions('PATCH', payload)

        try {
            // Update record in Airtable
            dispatch({ type: todoActions.startRequest })
            const resp = await fetch(encodeUrl(), options)
            if (!resp.ok) {
                throw new Error(resp.message)
            }
        } catch(err) {
            // Revert to old record if there's an error
            console.log(err.message)
            dispatch({ type: todoActions.revertTodo, originalTodo, error: err })
        } finally {
            dispatch({ type: todoActions.endRequest })
        }
    }

    useEffect(() => {
        const fetchTodos = async () => {
            dispatch({ type: todoActions.fetchTodos })
            const options = {
                method: 'GET',
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json'
                }
            }

            try {
                const resp = await fetch(encodeUrl(), options)
                if (!resp.ok) {
                throw new Error(resp.message)
                }

                // Update todos
                const data = await resp.json()
                dispatch({ type: todoActions.loadTodos, records: data.records})
            } catch(err) {
                dispatch({ type: todoActions.setLoadError, error: err })
            } finally {
                dispatch({ type: todoActions.endRequest })
            }
        }
        fetchTodos()
    }, [sortDirection, sortField, queryString, encodeUrl])

    useEffect(() => {
        if (location.pathname === '/') {
            setTitle('Todo List')
        } else if (location.pathname === '/about') {
            setTitle('About')
        } else {
            setTitle('Not Found')
        }
    }, [location])

    return (
        <div className={styles.body}>
            <Header title={title} />

            <Routes>
                <Route 
                    path='/' 
                    element={
                        <TodosPage
                        todoState={todoState}
                        addTodo={addTodo}
                        completeTodo={completeTodo}
                        updateTodo={updateTodo}
                        sortDirection={sortDirection}
                        setSortDirection={setSortDirection}
                        sortField={sortField}
                        setSortField={setSortField}
                        queryString={queryString}
                        setQueryString={setQueryString}
                        />
                    }
                />

                <Route path='/about' element={<h1>About</h1>} />

                <Route path='*' element={<h1>404 Not Found</h1>} />
            </Routes>

            {todoState.errorMessage ? (
                <div className={styles.errorMessage}>
                    <hr/>
                    <p>{todoState.errorMessage}</p>
                    <button type="button" onClick={() => dispatch({ type: todoActions.clearError })}>Dismiss</button>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}

export default App
