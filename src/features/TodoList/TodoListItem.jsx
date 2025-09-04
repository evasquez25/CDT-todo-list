import { useState, useEffect } from "react"
import TextInputWithLabel from "../../shared/TextInputWithLabel"

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false)
    const [workingTitle, setWorkingTitle] = useState(todo.title)

    function handleCancel() {
        setWorkingTitle(todo.title)
        setIsEditing(false)
    }

    function handleEdit(event) {
        setWorkingTitle(event.target.value)
    }

    function handleUpdate(event) {
        if (isEditing === false) {
            // Will never be called bc isEditing will be True if this function is ever called
            return
        }

        event.preventDefault()
        onUpdateTodo({...todo, title: workingTitle})
        setIsEditing(false)
    }

    useEffect(() => {
        // Cover edge case where an outdated value is displayed when a user saves a todo and clicks it again immediately.
        setWorkingTitle(todo.title)
    }, [todo])

    return (
        <ul>
            <li>
                <form onSubmit={handleUpdate}>
                    {isEditing ? (
                        <>
                            <TextInputWithLabel value={workingTitle} onChange={handleEdit}/>
                            <button type="button" onClick={handleCancel}>Cancel</button>
                            <button type="button" onClick={handleUpdate}>Update</button>
                        </>
                    ) : (
                        <> 
                            <label>
                                <input 
                                type='checkbox' 
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted} 
                                onChange={() => onCompleteTodo(todo)}
                                />
                            </label>
                            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                        </>
                    )}
                </form>
            </li>
        </ul>
    )
}

export default TodoListItem