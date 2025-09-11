import { useState, useEffect } from 'react'

function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    const [localQueryString, setLocalQueryString] = useState(queryString)

    function preventRefresh(e) {
        e.preventDefault()
    }

    useEffect(() => {
        // Wait 500ms after user stops typing before sending an API request
        const debounce = setTimeout(() => {
            setQueryString(localQueryString)
        }, 500)

        return () => clearTimeout(debounce) // Cancels previously scheduled API request if the effect re-runs
    }, [localQueryString, setQueryString])

    return (
        <>
            <form onSubmit={preventRefresh}>
                <div>
                    <label htmlFor='todoSearch'>Search todos</label>
                    <input id='todoSearch' type='text' value={localQueryString} onChange={(e) => setLocalQueryString(e.target.value)} />
                    <button type='button' onClick={() => setLocalQueryString('')}>Clear</button>
                </div>
                <div>
                    <label htmlFor='todoSortBy'>Sort by</label>
                    <select id='todoSortBy' onChange={(e) => setSortField(e.target.value)} value={sortField}>
                        <option value='title'>Title</option>
                        <option value='createdTime'>Time added</option>
                    </select>

                    <label htmlFor='todoDirection'>Direction</label>
                    <select id='todoDirection' onChange={(e) => setSortDirection(e.target.value)} value={sortDirection}>
                        <option value='asc'>Ascending</option>
                        <option value='desc'>Descending</option>
                    </select>
                </div>
            </form>
        </>
    )
}

export default TodosViewForm