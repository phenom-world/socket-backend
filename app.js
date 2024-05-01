const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDb = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./middlewares/error.js');
const routes = require('./routes');

dotenv.config();

connectDb();

const app = express();

// app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//sanitize data
app.use(mongoSanitize());
//set security headers
app.use(helmet());
//Prevent xss attack
app.use(xss());
//Enable Cors
app.use(cors());
//Prevent http param pollution
app.use(hpp());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'welcome to Smlight API',
  });
});
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: "I'm healthy",
  });
});

app.use(notFound);

app.use(errorHandler);

module.exports = { app };
