import { config } from 'dotenv'
import '@babel/polyfill'
import express    from 'express'
import bodyParser from 'body-parser'
import advice     from './fwk/filter/advice'

const router = express.Router()
const app = express()

// =================================================================================================
// config
config({ path: '../.env' })

// =================================================================================================
// default express set
app.use(router)
router.use(advice.allAround())
app.use(bodyParser.json({ limit: 1e6 }))

// =================================================================================================
// controller
app.use('/', (req, res) => {
    res.status(200)
    res.set('Content-Type', 'application/json')
    res.json({ message: 'alive' })
})

//==================================================================================================
// error handler
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err && err.type === 'entity.parse.failed') {
        res.status(400)
        res.set('Content-Type', 'application/json')
        res.json({ message: 'Payload should be in JSON format' })
        return
    }
    next()
})

//==================================================================================================
// server start
app.listen(process.env.SERVER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`server listening on port ${process.env.SERVER_PORT}!`)
})

