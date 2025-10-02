const actions = {
    //actions in useEffect that loads todos
    fetchTodos: 'fetchTodos',
    loadTodos: 'loadTodos',
    //found in useEffect and addTodo to handle failed requests
    setLoadError: 'setLoadError',
    //actions found in addTodo
    startRequest: 'startRequest',
    addTodo: 'addTodo',
    endRequest: 'endRequest',
    //found in helper functions
    updateTodo: 'updateTodo',
    completeTodo: 'completeTodo',
    //reverts todos when requests fail
    revertTodo: 'revertTodo',
    //action on Dismiss Error button
    clearError: 'clearError'
}

function todosReducer(state = initialState, action) {
    switch(action.type) {
        case actions.fetchTodos:
            return {...state, isLoading: true};
        case actions.loadTodos: {
            const fetchedTodos = action.records.map((record) => {
                const todo = {
                    // Assign record properties from json to the appropriate todo properties
                    id: record.id,
                    ...record.fields
                }
                if (!todo.isCompleted) {
                    // Airtable doesn't return properties whose values are false or empty strings
                    // Set property to false so field exists and prevents logic bugs
                    todo.isCompleted = false
                }
                return todo
            })
            return {
                ...state,
                todoList: fetchedTodos,
                isLoading: false
            };
        }
        case actions.setLoadError:
            return {
                ...state, 
                errorMessage: action.error?.message || action.message || 'Failed to load todos', 
                isLoading: false,
                isSaving: false
            };
        case actions.startRequest:
            return {
                ...state,
                isSaving: true
            };
        case actions.addTodo: {
            const record = action.record;
            const savedTodo = {
                id: record.id,
                ...record.fields
            }
            if (!record.fields.isCompleted) {
                savedTodo.isCompleted = false;
            }
            return {
                ...state,
                todoList: [...state.todoList, savedTodo], // append new todo
                isSaving: false
            };
        }
        case actions.endRequest:
            return {
                ...state,
                isLoading: false,
                isSaving: false
            };
        case actions.revertTodo: {
            if (action.originalTodo) {
                action.editedTodo = action.originalTodo;
            }
            // fallthrough
        }
        case actions.updateTodo: {
            const updatedTodos = state.todoList.map((todo) =>
                todo.id === action.editedTodo.id ? action.editedTodo : todo
            );
            const updatedState = {
                ...state,
                todoList: updatedTodos,
            }
            if (action.error) {
                updatedState.errorMessage = `${action.error.message}. Reverting todo...`;
            }
            return updatedState;
        }
        case actions.completeTodo: {
            const updatedTodos = state.todoList.map((todo) =>
                todo.id === action.completedTodo.id ? {...todo, isCompleted: true} : todo
            );
            return {
                ...state,
                todoList: updatedTodos
            }
        }
        case actions.clearError:
            return {
                ...state,
                errorMessage: ''
            };
        default:
            return state;
    }
}

const initialState = {
    todoList: [],
    isLoading: false,
    errorMessage: '',
    isSaving: false,
    sortField: 'createdTime',
    sortDirection: 'desc',
    queryString: '',
}

export { initialState, actions, todosReducer }