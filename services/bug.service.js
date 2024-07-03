import fs from 'fs'
import { utilService } from "./util.service.js"


export const bugService = {
    query,
    save,
    getById,
    remove
}

const PAGE_SIZE = 3
const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy = {}) {
    return Promise.resolve(bugs)
        .then(bugs => {
            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                bugs = bugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.labels.join('')))
            }
            if (filterBy.severity) {
                bugs = bugs.filter(bug => bug.severity >= filterBy.severity)
            }
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugs = bugs.slice(startIdx, startIdx + PAGE_SIZE)
            }
            if (filterBy.creatorId){
                bugs = bugs.filter(bug => bug.creator._id === filterBy.creatorId)
            }
            return bugs
        })
}

function save(bug, loggedUser) {
    if (bug._id) {
        const bugToUpdate = bugs.find(currBug => currBug._id === bug._id)
        if (!loggedUser.isAdmin && bugToUpdate.creator._id !== loggedUser._id) {
            return Promise.reject('Not your bug')
        }
        bugToUpdate.severity = bug.severity
    } else {
        bug._id = utilService.makeId()
        bug.creator = loggedUser
        bugs.push(bug)
    }
    return _saveBugsToFile()
        .then(() => bug)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    if (!bug) return Promise.reject('cannot find bug - ' + bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('cannot find bug')
    if (!loggedUser.isAdmin && bugToUpdate.creator._id !== loggedUser._id) {
        return Promise.reject('Not your bug')
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}