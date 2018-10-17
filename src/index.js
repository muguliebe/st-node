import { config } from 'dotenv'
import '@babel/polyfill'
import express    from 'express'
import bodyParser from 'body-parser'
import advice     from './fwk/filter/advice'

const router = express.Router()
const app    = express()

config({ path: '../.env' })
app.use(router)
app.use(bodyParser.json({ limit: 1e6 }))

router.use(advice.allAround())

app.post('/users', (req, res) => {
    if (parseInt(req.headers['content-length']) === 0) {
        res.status(400)
        res.set('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'Payload should not be empty' }))
        return
    }
    if (req.headers['content-type'] !== 'application/json') {
        res.status(415)
        res.set('Content-Type', 'application/json')
        res.end(JSON.stringify({ message: 'The "Content-Type" header must always be "application/json"' }))
        return
    }
    res.status(400)
    res.set('Content-Type', 'application/json')
    res.json({ message: 'Payload should be in JSON format' })
})

app.use('/', (req, res) => {
    res.status(200)
    res.set('Content-Type', 'application/json')
    res.json({ message: 'alive' })
})

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400)
        res.set('Content-Type', 'application/json')
        res.json({ message: 'Payload should be in JSON format' })
        return
    }
    next()
})

app.listen(process.env.SERVER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server listening on port ${process.env.SERVER_PORT}!`)
})

