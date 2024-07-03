const { useState, useEffect } = React
const { useParams, useNavigate } = ReactRouterDOM

import { userService } from '../services/user.service.js'

export function UserDetails() {
    var [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    function loadUser() {
        userService.getById(params.userId)
            .then(setUser)
            .catch(err => {
                console.log(err)
                navigate('/')
            })
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
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem rerum dignissimos adipisci qui ipsum libero aut autem reiciendis nihil cumque vero, soluta fugit ut eos odit, provident excepturi, dolor eum?</p>
            <button onClick={onBack}>Back</button>
        </section>
    )

}