const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from '../services/user.service.js'
import { bugService } from '../services/bug.service.js'
import { BugList } from '../cmps/BugList.jsx'

export function UserDetails() {
    var [user, setUser] = useState(null)
    const [bugs, setBugs] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    useEffect(() => {
        if (user) loadBugs()
    }, [user])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log(err)
                navigate('/')
            })
    }

    function loadBugs() {
        if (user && user._id) {
            bugService.query({ creatorId: user._id })
                .then(setBugs)
                .catch(err => console.log(err))
        }
    }

    function onBack() {
        navigate('/')
    }

    if (!user) return <div>Loading user...</div>

    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <h3>User's bug list:</h3>
            {bugs ? <BugList bugs={bugs} showControls={false}/> : <p>Loading bugs...</p>}
            <button onClick={onBack}>Back</button>
        </section>
    )

}