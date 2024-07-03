import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from "./services/bug.service.js"
import { userService } from './services/user.service.js'

const app = express()
app.listen(3030, () => console.log('Server ready at port 3030'))

//Express config
app.use(cookieParser())
app.use(express.static('public'))
app.use(express.json())

//REST API for bugs
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt,
        severity: +req.query.severity,
        pageIdx: req.query.pageIdx
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            console.log('cannot get bugs', err)
            res.status(500).send('cannot get bugs')
        })
})

app.post('/api/bug', (req, res) => {
    const loggedUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedUser) return res.status(401).send('Cannot add bug')

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
            console.log('cannot save bug', err)
            res.status(500).send('cannot save bug')
        })
})

app.put('/api/bug', (req, res) => {
    const loggedUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedUser) return res.status(401).send('Cannot update bug')

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
            console.log('cannot save bug', err)
            res.status(500).send('cannot save bug')
        })
})

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
            console.log('cannot get bug', err)
            res.status(500).send('cannot get bug')
        })
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.send(`bug ${bugId} removed!`))
        .catch(err => {
            console.log('cannot remove bug', err)
            res.status(500).send('cannot remove bug')
        })
})

//User API
app.get('/api/user', (req, res) => {
    userService.query()
        .then(users => res.send(users))
        .catch(err => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then(user => res.send(user))
        .catch(err => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

//Auth API
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid credentials')
            }
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot sign up')
            }
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})