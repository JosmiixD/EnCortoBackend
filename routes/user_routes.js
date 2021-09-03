const UsersController = require('../controllers/users_controller');


module.exports = ( app ) => {

    //GET USERS
    app.get('/api/users/get-all', UsersController.getAll );

    app.post('/api/users/create', UsersController.register );
}