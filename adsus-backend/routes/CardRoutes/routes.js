const express = require('express');
const jwt = require('jsonwebtoken')
const authMid = require('../../utils/authMid');
const adminAuth = require('../../utils/adminauth')

const Card = require('../../models/Card');
const CardType = require('../../models/CardType');
const cardRoutes = express.Router();


// Create

cardRoutes.get('/create', authMid,  adminAuth, async (req, res) => {
    
    const cardExists = await Card.findOne({code: req.body.code});
    
    if(cardExists.length > 0) {
        res.status(400);
        res.send({error: 'Card already exists!'})
        return
    }
    
    const  TokenCode = jwt.sign({
        code : req.body.code
    }, process.env.CODE_SECRET)
    try {
        const newCard = await Card.create({
            type: req.body.type,
            location: req.body.location? req.body.location : null,
            amount: req.body.amount,
            currency: req.body.currency,
            code: TokenCode,
            expiration: req.body.expiration,
            status: 'Unused',
        })    
    } catch(e) {
        res.status(400);
        res.send({error: e})
        return
    }
    res.status(200)
    res.send( {sucess: true} ) 
})

// Delete

cardRoutes.post('/delete', authMid,  adminAuth, async (req, res) => {
    
    const cardExists = await Card.findOne({code: req.body.code});
    
    if(cardExists.length < 1) {
        res.status(400);
        res.send({error: 'Card could not be found'})
        return
    }

    if(cardExists[0].status.toLowerCase() !== 'Unused' || cardExists[0].uid){
        res.status(400)
        res.send({error: `User with userid ${cardExists.uid} already took it.. contact him asap!`})
        return
    }

    try {
        const newCard = await Card.destroy({where: {code: cardExists.code}})    
    } catch(e) {
        res.status(400);
        res.send({error: e})
        return
    }
    res.status(200)
    res.send( {sucess: true} ) 
})


cardRoutes.post('/type/create', authMid, adminAuth, async (req, res) => {

    const typeExists = await CardType.findOne({ where: {
        type: req.body.type,
        location: req.body.location,
        amount: req.body.amount,
        currency: req.body.currency
    }
     })

     if(typeExists.length !== 0) {
         typeExists[0].update({where: {
            type: req.body.type,
            location: req.body.location,
            amount: req.body.amount,
            currency: req.body.currency
         }
        }, {quantity: typeExists[0].quantity + 1})
    res.send({result: "Type already exists, was increased by +1"}) 
    }

     // Card type does not exist.

     try {
         await CardType.create({
             type: req.body.type,
             location: req.body.location,
             amount: req.body.amount,
             currency: req.body.currency,
             quantity: req.body.quantity,
             status: req.body.status, 
         })
       res.send({result: 'Type was added!'})  
     } catch(e) {
        return res.send(e)
     }


})

cardRoutes.post('/type/delete', authMid, adminAuth, async (req, res) => {

    const isDeleted = await CardType.destroy({where: {
        type: req.body.type,
        location: req.body.location,
        amount: req.body.amount,
        currency: req.body.currency
    }})
    if(isDeleted > 0 ) {
        res.send({result: `${isDeleted} number of rows were deleted!`})
    } else {
        res.send({result: `Does not exist!`})
    }

})


module.exports = cardRoutes