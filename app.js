const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');
const { errorHandler, notFound } = require('./middlewares/error.js');
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000', 'https://smlight.vercel.app', '*'],
  })
);

app.use(cookieParser());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//set security headers
app.use(helmet());
//Prevent xss attack
app.use(xss());
//Enable Cors
app.use(cors());
//Prevent http param pollution
app.use(hpp());

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
