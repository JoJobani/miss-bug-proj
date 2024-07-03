const STORAGE_KEY_LOGGED_USER = 'loggedUser'
const BASE_URL = '/api/user/'

export const userService = {
    login,
    signup,
    logout,
    getLoggedUser,
    getById,
    getEmptyCredentials
}

function login({ username, password }) {
    return axios.post('/api/auth/login', { username, password })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGED_USER, JSON.stringify(user))
            return user
        })
}

function signup({ username, password, fullname }) {
    return axios.post('/api/auth/signup', { username, password, fullname })
        .then(res => res.data)
        .then(user => {
            sessionStorage.setItem(STORAGE_KEY_LOGGED_USER, JSON.stringify(user))
            return user
        })
}

function logout() {
    return axios.post('/api/auth/logout')
        .then(() => {
            sessionStorage.removeItem(STORAGE_KEY_LOGGED_USER)
        })
}

function getLoggedUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGED_USER))
}

function getById(userId) {
    return axios.get(BASE_URL + userId)
        .then(res => res.data)
}

function getEmptyCredentials() {
    return {
        username: '',
        password: '',
        fullname: ''
    }
}