

//not-found 

const notFound = (req,res,next)=>{
    const error = new Error(`Not-found ${req.originalUrl}`) 
    res.status(404)
    next(error)
}

//Erorr hanlder Middleware 

const ErorrHanlder = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        message: error.message,
        stack: process.env.NODE_ENV !== "DEV_MX7" ?null:error.stack
    })
}

module.exports = {
    ErorrHanlder,
    notFound
}