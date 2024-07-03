const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug, showControls }) {

    const user = userService.getLoggedUser()

    function isOwner(bug) {
        if (!user) return false
        if (!bug.creator) return true
        return user.isAdmin || bug.creator._id === user._id
    }

    return (
        <ul className="bug-list">
            {bugs.map((bug) => (
                <li className="bug-preview" key={bug._id}>
                    <BugPreview bug={bug} />
                    <Link to={`/bug/${bug._id}`}>Details</Link>
                    {
                        isOwner(bug) && (showControls) &&
                        <section className='bug-controls'>
                            <button onClick={() => onRemoveBug(bug._id)}>x</button>
                            <button onClick={() => onEditBug(bug)}>Edit</button>
                        </section>
                    }
                </li>
            ))
            }
        </ul >
    )
}
