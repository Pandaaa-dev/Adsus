const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const fs = require('fs')

const authMid = require('../../utils/authMid')
const adminAuth = require('../../utils/adminauth')
const Video = require('../../models/Video')

const videoRoutes = express.Router();

const filename = ''



// Multer Config 
const fileStorageEngine = multer.diskStorage({destination: (req, file, cb) => {
    cb(null, "../../assets/Videos")
}, 
filename: (req,  file, cb) => {
    const fileName = jwt.sign({
        companyName: req.body.companyName,
        price: req.body.price
    }, process.env.VIDEO_FILE_ENC_KEY)
    filename = fileName
    cb(null, fileName )
}})
const upload = multer({storage: fileStorageEngine});

// -------------------------------------------------------------------------------------------

// Send/Create Video

videoRoutes.post('/sendVideo', authMid, adminAuth, upload.single('companyVid'), async (req, res) => {

    try {

        const newVideo = await Video.create({
            file_path: '../../assets/Videos' + filename,
            points: req.body.points,
            expiration_date: req.body.expiration_date? req.body.expiration_date : null,
            company: req.body.company,
        })
    } catch(e) {
        res.status(500)
        res.send({error: e})
        return
    }

    req.status(200);
    req.send({finished: true})
})

// Delete Video; 

videoRoutes.post('/sendVideo', authMid, adminAuth, async (req, res) => {

    try {

        const videoToDelete = await Video.findOne({
                where: {
                    id: req.body.id,
                    company: req.body.company
                }
            });
        if(videoToDelete.length < 1 ){
            res.status(204);
            res.send({
                error: "Could not find Video."
            })
            return
        }
        
        // Delete from database
        const deleteVideo = await Video.destroy({where: {file_path: '../../assets/Videos' + videoToDelete.file_path }})

        //Delete video from the file manager
        fs.unlink('../../assets/Videos' + videoToDelete.file_path)
    } catch(e) {
        res.status(500)
        res.send({error: e})
        return
    }

    req.status(200);
    req.send({finished: true})
})





module.exports = videoRoutes

