const jwt = require('jsonwebtoken')
const RefreshTokens = require('../models/RefreshToken')
const User = require('../models/User')


// Authenticating Different important requests through tokens and sending refresh tokens too(IF needed)
const authMid = async (req, res, next) => {

    const token = req.get('Authentication') && req.get('Authentication').split(' ')[1]
    if(!token){
        res.status(401)
        res.send({
           error: "Not Authenticated, log in again",
         });
       return
    }
    const refreshToken = req.get('Refresh')
    if(!refreshToken){
        res.status(401)
        res.send({
           error: "Not Authenticated, log in again",
         });
       return
    }

    // If refreshtoken isnt in the mongodb database
    const authenticatedRefreshToken = await RefreshTokens.find(refreshToken)
    if(!authenticatedRefreshToken) {
        res.status(401)
        res.send({
           error: "Not Authenticated, log in again",
         });
       return
    }
    // If token and refreshToken are different tokens 
    try {
        const refreshUser = jwt.verify(authenticatedRefreshToken, process.env.REFRESH_SECRET)
    } catch(e) {
        res.status(500)
        res.send({
           error: "Server Error...",
         });
       return
    }
    try {
        const tokenUser = jwt.verify(token, process.env.TOKEN_SECRET)
    }  catch(e) {
        res.status(500)
        res.send({
           error: "Server Error...",
         });
       return
    }
    if(refreshUser.username !== tokenUser.username){
        req.authenticated = false
        res.status(401)
         res.send({
            error: "Refresh User Tokens",
          });
        return
    }
    // If user exists or not
    const user = await User.findOne({username: refreshUser.username})
    
    // If user doesnt exist and if user is banned
    if(user.length < 1 && user.role === 0 ) {
      req.authenticated = false
      res.status(401)
       res.send({
          error: "User not found",
        });
      return
    }

    // Token and Refresh token match, And user exists!
    req.authenticated = true
    req.username = tokenUser.username
    next();
}


module.exports = authMid