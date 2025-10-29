const { Router } = require('express');
const { CreateUser, LoginUser } = require('../Controllers/UserController');

const routes = require('express').Router();

routes.post('/regUser',CreateUser)
routes.post('/LoginUser',LoginUser)






module.exports = routes;