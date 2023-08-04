const Router = require( 'express' )

const { login } = require( '../controlers/login_controler' );

const router_login = Router();


router_login.post( '/login', login);


module.exports = router_login;