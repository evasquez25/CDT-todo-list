import TodoForm from '../features/TodoForm'
import TodoList from '../features/TodoList/TodoList'
import TodosViewForm from '../features/TodosViewForm'

function TodosPage({
    todoState,
    addTodo,
    completeTodo,
    updateTodo,
    sortDirection,
    setSortDirection,
    sortField,
    setSortField,
    queryString,
    setQueryString
}) {

    return (
        <>
            <TodoForm
                onAddTodo={addTodo}
                isSaving={todoState.isSaving}
            />

            <TodoList
                todoList={todoState.todoList}
                onCompleteTodo={completeTodo}
                onUpdateTodo={updateTodo}
                isLoading={todoState.isLoading}
            />

            <hr/>

            <TodosViewForm 
                sortDirection={sortDirection} 
                setSortDirection={setSortDirection} 
                sortField={sortField} 
                setSortField={setSortField}
                queryString={queryString}
                setQueryString={setQueryString}
            />
        </>
    )
}

export default TodosPage
