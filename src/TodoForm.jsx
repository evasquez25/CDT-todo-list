import { useRef } from 'react'

function TodoForm({ onAddTodo }) {
    const todoTitleInput = useRef('')

    function handleAddTodo(event) {
        event.preventDefault()
        const title = event.target.title.value

        onAddTodo(title)  // callback function from parent
        event.target.title.value = ''  // reset input field
        todoTitleInput.current.focus()  //refocus the input field when form is submitted
    }

    return (
        <form onSubmit={handleAddTodo}>
            <label htmlFor='todoTitle'>Todo</label>
            <input id='todoTitle' name='title' ref={todoTitleInput}></input>
            <button>Add Todo</button>
        </form>
    )
}

export default TodoForm