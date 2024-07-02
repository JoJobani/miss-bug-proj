import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function BugFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const onSetFilterDebounce = useRef(utilService.debounce(onSetFilter, 200))

    useEffect(() => {
        onSetFilterDebounce.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilter(filterByToEdit)
    }

    const { txt, severity } = filterByToEdit

    return (
        <section className="bug-filter">
            <h2>Filter bugs:</h2>
            <form onSubmit={onSubmitFilter}>
                <input placeholder={'Search for name or labels...'} value={txt} onChange={handleChange} name="txt" type="text" id="txt" />

                <label htmlFor="severity">Min Severity: {severity}</label>
                <input value={severity} onChange={handleChange} name="severity" type="range" id="severity" min={0} max={5} />
            </form>
        </section>
    )
}