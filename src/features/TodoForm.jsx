import { useRef, useState } from 'react'
import TextInputWithLabel from '../shared/TextInputWithLabel'
import styled from 'styled-components'

const StyledForm = styled.form`
    padding: 5px;
`

const StyledButton = styled.button`
    &:disabled {
        font-style: italic;
        opacity: 0.5;
    }
`

function TodoForm({ onAddTodo, isSaving }) {
    const todoTitleInput = useRef('')
    const [workingTodoTitle, setWorkingTodo] = useState('')

    function handleAddTodo(event) {
        event.preventDefault()
        onAddTodo({ title: workingTodoTitle, isCompleted: false })  // callback function from parent
        setWorkingTodo('')  // Reset form input
        todoTitleInput.current.focus()  //refocus the input field when form is submitted
    }

    return (
        <StyledForm onSubmit={handleAddTodo}>
            <TextInputWithLabel 
                ref={todoTitleInput}
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodo(event.target.value)} 
                elementId="todoTitle" 
                labelText="Todo"
            />
            <StyledButton disabled={!workingTodoTitle}>
                {isSaving ? 'Saving...' : 'Add Todo'}
            </StyledButton>
        </StyledForm>
    )
}

export default TodoForm