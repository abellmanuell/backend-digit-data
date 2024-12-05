const express = require('express');
const {body, validationResult, matchedData} = require("express-validator");
const {findUsers, findUser, createUser} = require("../../config/userDB/userdb");
const router = express.Router();
require('dotenv').config()
const bcrypt = require('bcrypt')

function server_response({status = 200, message = '', response}){
    response.header('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN)
    response.status(status)
    response.header("Content-Type", "application/json");
    response.json({status, message})
}

router.post("/",
    [body('email').trim().notEmpty().isEmail().withMessage("Email address incorrect"),
    body("password").notEmpty().isLength({min: 8}).withMessage("Password should be at least 8 character")],
    async (req, res)=>{
const result = validationResult(req);

if(result.isEmpty()){
    const data = matchedData(req)
    const isUserExist = await findUser(data)

    if(isUserExist){
        return server_response({response: res, message: "Email address is taken!" })
    }

    const password = await bcrypt.hash(data.password, 13);
    const isCreated = await createUser({email: data.email, password})

    if(isCreated.acknowledged){
        return server_response({response: res, message: "Created successfully!" })
    }else{
        console.error("Unexpected error occurred, user not created!")
        server_response({response:res, status: 500, message: "Unexpected error occurred, user not created!"})
        return
    }
}

res.send({error: result.array()})
})

module.exports = router;