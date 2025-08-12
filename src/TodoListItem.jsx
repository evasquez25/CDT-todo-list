
function TodoListItem({ todo, onCompleteTodo }) {
    return (
        <ul>
            <li>
                <form>
                    <input type='checkbox' checked={todo.isCompleted} onChange={() => onCompleteTodo(todo.id)}></input>
                    {todo.title}
                </form>
            </li>
        </ul>
    )
}

export default TodoListItem