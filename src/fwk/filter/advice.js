/* eslint-disable */
module.exports = {
    allAround () {
        return (req, res, next) => {
            console.info(`Start => ${req.method} ${req.url.substr(0, 40)} with `, req.query)
            const start = new Date()
            const end   = res.end

            res.end = function() {
                end.apply(res, arguments) // Wait for transaction

                // After transaction  ==================================================
                const endDate = new Date()
                const elapsed = endDate - start

                console.info(`End      ${req.method} ${req.url.substr(0, 40)} [${elapsed} ms] [with ${res.statusCode}: ${res.statusMessage}]`)

            }
            next()
        }
    },
}
