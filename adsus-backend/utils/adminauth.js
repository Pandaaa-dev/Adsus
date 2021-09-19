const User = require('../models/User')

// i had 0 for banned 1 for unactivated 2 for normal 3 for moderator 4 for admin



const adminAuth = async (req, res, next) => {
    const user = await User.find({username: req.username});

    // Checking if user exists and user has admin role or not
    if(user.length < 1 && user.role !==4 ){
        res.status(401);
        res.send({
            error: "This is not for normal members."
        })
        return
    }
    next()
}


module.exports = adminAuth