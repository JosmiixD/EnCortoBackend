const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');


//BEGIN:: Routes
const users = require('./routes/user_routes');
//END:: Routes


const port = process.env.PORT || 3000;
app.use( logger('dev') );
app.use( express.json() );
app.use( express.urlencoded({
    extended: true,
}));

app.use(cors());
app.disabled('x-powered-by');

app.set('port', port);

//BEGIN: Call Routes
users( app );
//END: Call Routes

server.listen( 3000, '192.168.0.17' || 'localhost', function () {
    console.log('NodeJs App ' + port + ' Initialized');
});

//ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status( err.status || 500 ).send(err.stack);
});

module.exports = {
    app: app,
    server: server,
};