import express from 'express'
import cookieParser from 'cookie-parser'

import {bugService} from "./services/bug.service.js"


const app = express()

app.use(cookieParser())
app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello there'))
app.listen(3030, () => console.log('Server ready at port 3030'))