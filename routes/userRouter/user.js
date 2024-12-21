const express = require('express');
const { server_response } = require('../../utils/server_response');
const router = express.Router()

router.get("/", (req, res, next)=>{
    if(!req.user){
        return server_response(404, res, "Error occured")
    }

    return server_response(200, res, "Successfully completed", req.user)
})


module.exports = router;