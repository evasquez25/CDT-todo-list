

function TodosViewForm({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    function preventRefresh(e) {
        e.preventDefault()
    }

    return (
        <>
            <form onSubmit={preventRefresh}>
                <div>
                    <label htmlFor='todoSearch'>Search todos</label>
                    <input id='todoSearch' type='text' value={queryString} onChange={(e) => setQueryString(e.target.value)} />
                    <button type='button' onClick={() => setQueryString('')}>Clear</button>
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