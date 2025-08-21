import { useRef, useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'

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
            <TextInputWithLabel ref={todoTitleInput} value={workingTodoTitle} onChange={(event) => setWorkingTodo(event.target.value)} elementId="todoTitle" labelText="Todo"></TextInputWithLabel>
            <button disabled={!workingTodoTitle}>Add Todo</button>
        </form>
    )
}

export default TodoForm