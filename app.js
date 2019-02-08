const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const routes = require('./routes/routes');

dotenv.config();

const app = express();
const port  = process.env.PORT || 3434;

const config = require('./config');
// allow promises with mongoose.
mongoose.Promise = global.Promise;

// setup up database connection
if (process.env.NODE_ENV === 'test') {
    mongoose.connect(config.url_test);
} else {
    mongoose.connect(config.url);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', routes);



app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
});