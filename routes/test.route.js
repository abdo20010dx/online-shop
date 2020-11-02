const router = require("express").Router()
const { socketmsg } = require("../controllers/test.controller");


router.get('/',socketmsg)

module.exports=router

