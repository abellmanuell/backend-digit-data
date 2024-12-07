const express = require('express');
const {body, validationResult, matchedData} = require("express-validator");
const {findUsers, findUser, createUser, findUserById} = require("../../config/userDB/userdb");
const router = express.Router();
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {refreshToken} = require('../../utils/generateRefreshToken/generateRefreshToken')

function server_response(status = 200, response, message = '', options={}){
    response.header('Access-Control-Allow-Origin', process.env.ACCESS_CONTROL_ALLOW_ORIGIN)
    response.header("Access-Control-Allow-Methods", "GET, OPTIONS, POST, PUT, DELETE");
    response.header("Access-Control-Allow-Credentials", "true");true
    response.status(status)
    response.header("Content-Type", "application/json");
    response.json({status, message, ...options})
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
        return server_response(401, res, "Email address is taken!")
    }

    const password = await bcrypt.hash(data.password, 13);
    const userCreated = await createUser({email: data.email, password})

    if(userCreated.acknowledged){
        const user =  userCreated.insertedId && await findUserById(userCreated.insertedId)
        const token = jwt.sign({...user}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})

        return server_response(200, res, "Created successfully!",  {
            token, refresh_Token: await refreshToken()
        })
    }else{
        return server_response(500, res, "Unexpected error occurred, user not created!")
    }

}

res.send({error: result.array()})
})

module.exports = router;