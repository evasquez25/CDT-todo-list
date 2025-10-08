import { Link } from 'react-router'

function NotFound() {
    return (
        <>
            <h1>404 Not Found</h1>
            <Link to="/"> Return Home</Link>
        </>
    )
}

export default NotFound