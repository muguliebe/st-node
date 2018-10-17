import assert         from 'assert'
import { Then, When } from 'cucumber'
import superagent     from 'superagent'

When(/^the client creates a POST request to \/users$/, function() {
    const host = process.env.SERVER_HOSTNAME
    const port = process.env.SERVER_PORT
    this.request = superagent('POST', `${host}:${port}/users`)
})
When(/^attaches a generic empty payload$/, function() {
    return undefined
})

When(/^sends the request$/, function(callback) {
    this.request.then((response) => {
        this.response = response.res
        callback()
    }).catch((errResponse) => {
        this.response = errResponse.response
        callback()
    })
})

Then(/^our API should respond with a ([1-5]\d{2}) HTTP status code$/, function(statusCode) {
    assert.equal(this.response.statusCode, statusCode)
})

Then(/^the payload of the response should be a JSON object$/, function() {
    // Check Content-Type header
    const contentType = this.response.headers['Content-Type'] || this.response.headers['content-type']
    if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response not of Content-Type application/json')
    }

    // Check it is valid JSON
    try {
        this.responsePayload = JSON.parse(this.response.text)
    } catch (e) {
        throw new Error('Response not a valid JSON object')
    }
})

Then(/^contains a message property which says (?:"|')(.*)(?:"|')$/, function(message) {
    assert.equal(this.responsePayload.message, message)
})

When('attaches a generic non-JSON payload', function() {
    this.request.send('<?xml version="1.0" encoding="UTF-8" ?><email>dan@danyll.com</email>')
    this.request.set('Content-Type', 'text/xml')
})

When('attaches a generic malformed payload', function() {
    this.request.send('{"email": "dan@danyll.com", name: }')
    this.request.set('Content-Type', 'application/json')
})

