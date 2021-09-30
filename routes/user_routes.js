const UsersController = require('../controllers/users_controller');
const passport = require('passport');


module.exports = ( app ) => {

    //GET USERS
    app.get('/api/users/get-all', UsersController.getAll );
    app.get('/api/users/findById/:id', passport.authenticate('jwt', {session: false }) ,UsersController.getAll );

    //SAVE DATA
    app.post('/api/users/create', UsersController.register );
    app.post('/api/users/login', UsersController.login );
    app.post('/api/users/token-renew', passport.authenticate('jwt', {session: false }), UsersController.tokenRenew );

    // BEGIN::UPDATE USER INFORMATION
    app.put('/api/users/update', passport.authenticate('jwt', {session: false }) , UsersController.update );
    // END::UPDATE USER INFORMATION
}