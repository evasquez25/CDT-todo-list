import TodoListItem from './TodoListItem'
import styles from './TodoList.module.css'

function TodoList({ todoList, onCompleteTodo, onUpdateTodo, isLoading }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted)
    
    return (
        <>
            {isLoading ? (
                <p>Todo list loading...</p>
            ) : (
                <ul>
                    {filteredTodoList.length === 0 ? <p>Add a todo above to get started</p> : 
                    filteredTodoList.map(todo => 
                        <TodoListItem 
                            key={todo.id}
                            todo={todo} 
                            onCompleteTodo={onCompleteTodo} 
                            onUpdateTodo={onUpdateTodo}
                        />
                    )}
                </ul>
            )}
        </>
    )
}

export default TodoList