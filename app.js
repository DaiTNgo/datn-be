const express = require('express');
const cookieParser = require('cookie-parser');
const route = require('./routes');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(cors());

app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://datn-fe.netlify.app/');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET,OPTIONS'
    );
    next();
});

app.get('/', (_, res) => {
    res.sendFile(__dirname + '/index.html');
});

route(app);
//Error handling
app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        success: false,
        message: error.message,
    });
});

module.exports = app;
