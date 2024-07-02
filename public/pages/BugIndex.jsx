import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { BugList } from '../cmps/BugList.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(setBugs)
            .catch(err => console.log(err))
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => {
            let nextPageIdx
            if (prevFilter.pageIdx !== undefined) nextPageIdx = 0
            return { ...prevFilter, ...filterBy, pageIdx: nextPageIdx }
        })
    }

    function togglePagination() {
        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }
        })
    }

    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Description?')
        }
        bugService
            .save(bug)
            .then((savedBug) => {
                console.log('Added Bug', savedBug)
                setBugs([...bugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch((err) => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    if (!bugs) return <div>Loading...</div>

    return (
        <main>
            <section className='info-actions'>
                <button onClick={onAddBug}>🐛 Add Bug 🐛</button>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <section className='pagination'>
                    <button onClick={togglePagination} >Toggle Pagination</button>
                    <button onClick={() => onChangePage(-1)}>-</button>
                    {filterBy.pageIdx + 1 || 'No Pagination'}
                    <button onClick={() => onChangePage(1)}>+</button>
                </section>
            </section>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </main>
    )
}
