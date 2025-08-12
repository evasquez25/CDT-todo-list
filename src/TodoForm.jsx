import { useRef, useState } from 'react'

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef('')
    const [workingTodoTitle, setWorkingTodo] = useState('')

    function handleAddTodo(event) {
        event.preventDefault()
        onAddTodo(workingTodoTitle)  // callback function from parent
        setWorkingTodo('')  // Reset form input
        todoTitleInput.current.focus()  //refocus the input field when form is submitted
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Todo</label>
            <input id='todoTitle' name='title' value={workingTodoTitle} onChange={(event) => setWorkingTodo(event.target.value)} ref={todoTitleInput}></input>
            <button>Add Todo</button>
        </form>
    )
}

export default TodoForm