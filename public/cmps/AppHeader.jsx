const { NavLink, Link } = ReactRouterDOM
const { useNavigate } = ReactRouter

const { useState } = React

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { userService } from '../services/user.service.js'

export function AppHeader() {

    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedUser())

    function onLogout() {
        userService.logout()
            .then(() => onSetUser(null))
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className='app-header'>
            <h1>Bugs are Forever!</h1>
            <nav>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/bug">Bugs</NavLink>
                <NavLink to="/about">About</NavLink>
            </nav>

            {user ? (
                <section>
                    <Link to={`/user/${user._id}`}> Hello {user.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                </section>
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )
            }

            <UserMsg />
        </header>
    )
}
