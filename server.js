import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from "./services/bug.service.js"


const app = express()
app.listen(3030, () => console.log('Server ready at port 3030'))

app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

//GET BUGS
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt,
        severity: +req.query.severity,
        pageIdx: req.query.pageIdx
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.error('cannot get bugs', err)
            res.status(500).send('cannot get bugs')
        })
})

//ADD BUG
app.post('/api/bug', (req, res) => {
    const { title, description, severity, createdAt, labels } = req.body
    const bugToSave = {
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || 0,
        labels: labels || []
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.error('cannot save bug', err)
            res.status(500).send('cannot save bug')
        })
})

//UPDATE BUG
app.put('/api/bug', (req, res) => {
    const { _id, title, description, severity, createdAt, labels } = req.body
    const bugToSave = {
        _id,
        title: title || '',
        description: description || '',
        severity: +severity || 0,
        createdAt: +createdAt || 0,
        labels: labels || []
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch(err => {
            console.error('cannot save bug', err)
            res.status(500).send('cannot save bug')
        })
})

//GET BUG
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    let visitedBugs = req.cookies.visitedBugs || []
    if (!visitedBugs.includes(bugId)) visitedBugs.push(bugId)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })
    console.log(visitedBugs)
    if (visitedBugs.length > 3) {
        return res.status(401).send('Wait for a bit')
    }

    visitedBugs.push(bugId)
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            console.error('cannot get bug', err)
            res.status(500).send('cannot get bug')
        })
})

//REMOVE BUG
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed!`))
        .catch(err => {
            console.error('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})