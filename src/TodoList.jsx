import TodoListItem from './TodoListItem'

function TodoList({ todoList }) {
      
    return (
        <ul>
            {todoList == 0 ? <p>Add todo above to get started</p> : todoList.map(todo => <TodoListItem key={todo.id} todo={todo}/>)}
        </ul>
    )
}

export default TodoList