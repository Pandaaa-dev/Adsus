const express = require('express');
const authMid = require('../../utils/authMid');
const CardType = require('../../models/CardType')
const User = require('../../models/User');
const Request = require('../../models/Request')
const requestCardRoutes = express.Router();


// Make a request

requestCardRoutes.post('/create', authMid,  async (req, res) => {
   /* 
        -- Deducts users points.
        -- Puts a creationDate which helps in the future.
        -- Validates User. 
   */
  
    // GET user points
  const user = await User.findOne({username: req.body.username})
    if(user.length < 1) {
        res.status(401);
        res.send({error: "Could not find User"});
        return
    }
  const userPoints = user[0].points;

    // GET Video type:
    const cardType = await CardType.findOne({
        type: req.body.request.type,
        currency: req.body.request.currency,
        amount: req.body.request.amount
    })

    if(cardType.length < 1 && cardType.points > userPoints) {
        res.status(401);
        res.send({error: "User has less points!"});
        return
    }
    try {
        
        // Deducting user points
        const newUser = await User.findOneAndUpdate({username: user.username}, { $inc: {points : cardType.points }})
        
        // Making the request
        const request = await Request.create({
                uid: user.uid,
                amount: cardType.amount,
                currency: cardType.currency,
                status: 'Pending',
                location: cardType.requests            
        })  

    } catch(e) {
        res.status(400)
        res.send({
            error: "Something Happened in the server... Try again later."
        })
    }

    res.status(200);
    res.send ({
        success: true
    })
})

// Delete Request

requestCardRoutes.post('/delete', authMid, async (req, res) => {
    /* 
        -- Give half user points back.
        -- Check if the request was deleted after 10 minutes or not
   */

    // Finding req in database
    const card = await Request.findOne({where: 
                {uid: req.body.id , 
                amount: req.body.amount,
                id: req.body.id }});

    // Check if request is pending or not
    if( card.length < 1 && card.status.toLowerCase() !== 'pending'){
        res.status(404);
        res.send({
            error: "Bad Request or Could not find the card."
        })
        return
    }
    // Finding how many minutes has passed since it was created
    const difference = Math.round((Date.now() - card[0].created_at)/60000)

    // > 10 minutes = no
    if(difference > 10){
        res.status(403);
        res.send({
            error: "You cannot delete a request after 10 minutes!"
        })
        return
    }
    try {
        // Deleting request
        const deletedRequest = await Request.destroy({where: 
            {uid: card.uid , 
            amount: card.amount,
            id: card.id }})

        // Increasing 1/3 of used points of user 
        const increaseUserPoints = await User.findOneAndUpdate({uid: card.uid}, {$inc: {points: card.amount/3}})
    } catch(e) {
        res.status(403);
        res.send({
            error: e
        })
        return
    }

})




module.exports = requestCardRoutes