import TodoListItem from './TodoListItem'
import styles from './TodoList.module.css'

import { useSearchParams, useNavigate } from 'react-router'
import { useEffect } from 'react'

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted)

    // React Router
    const [ searchParams, setSearchParams ] = useSearchParams()
    const navigate = useNavigate()

    // Pagination
    const itemsPerPage = 5
    const currentPage = parseInt(searchParams.get('page') || '1', 10)
    const indexOfFirstTodo = (currentPage - 1) * itemsPerPage
    const totalPages = Math.ceil(filteredTodoList.length / itemsPerPage)

    // Slice todo list
    const paginatedTodoList = filteredTodoList.slice(indexOfFirstTodo, indexOfFirstTodo + itemsPerPage)

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setSearchParams({page: currentPage - 1})
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setSearchParams({page: currentPage + 1})
        }
    }

    useEffect(() => {
        if (totalPages > 0) {
            const isInvalid = isNaN(currentPage) || currentPage < 1 || currentPage > totalPages
            if (isInvalid) {
                navigate('/')
            }
        }
    }, [currentPage, navigate, totalPages])
    
    return (
        <>
            {isLoading ? (
                <p>Todo list loading...</p>
            ) : (
                <ul>
                    {filteredTodoList.length === 0 ? <p>Add a todo above to get started</p> : 
                    paginatedTodoList.map(todo => 
                        <TodoListItem 
                            key={todo.id}
                            todo={todo} 
                            onCompleteTodo={onCompleteTodo} 
                            onUpdateTodo={onUpdateTodo}
                        />
                    )}
                </ul>
            )}

            <div className='paginationControls'>
                <button type='button' onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} of {totalPages}</span>
                <button type='button' onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </>
    )
}

export default TodoList