const jwt = require('jsonwebtoken')

// verviy tokens 

function verifytoken(req, res, next) {
    const authTokrn = req.headers.authorization
    if (authTokrn) {
        const token = authTokrn.split(" ")[1]
        try {
            const decodedpayload = jwt.verify(token, process.env.secret_key)
            req.user = decodedpayload
            console.log(decodedpayload)
            next()
        } catch (error) {
            return res.status(401).json({ message: "invaild token ,access denide" })
        }
    } else {
        return res.status(401).json({ message: "no token provided ,access denide" })
    }
}

function verifytokenandadmin(req, res, next) {
    verifytoken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "not allowed, only admin" })
        }
    })
}

function verifytokenauthrztionandadmin(req, res, next) {
    verifytoken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        } else {
            return res.status(403).json({ message: "not allowed, only person or admin" })
        }
    })
}


module.exports = {
    verifytoken,
    verifytokenandadmin,
    verifytokenauthrztionandadmin,
}