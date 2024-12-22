const express = require('express');
const { server_response } = require('../../utils/server_response');
const { findUserById } = require('../../config/userDB/userdb');
const router = express.Router()

router.get("/", async (req, res, next)=>{
    console.log(req.user)
    const other = await findUserById(req.user.userId);    

    if(!req.user){
        return server_response(404, res, "Error occured")
    }

    return server_response(200, res, "Successfully completed", other)
})


module.exports = router;