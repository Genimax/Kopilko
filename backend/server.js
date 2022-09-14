const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const { checkToken } = require('./middleware/cookieJWTAuth');

connectDB();

const app = express();

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.use('/dashboard', checkToken, require('./routes/dashboardRoutes'));
app.use('/user/incomes', checkToken, require('./routes/incomesRoutes'));
app.use('/users', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, console.log(`Server started on port: ${port}.`));
