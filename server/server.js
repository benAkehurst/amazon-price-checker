// Server Dependencies
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('./config/winston');
const helmet = require('helmet');

// Models Imports
const User = require('./api/models/userModel');
const SingleItem = require('./api/models/singleItemModel');
const Items = require('./api/models/itemsModel');
const Deleted = require('./api/models/deletedModel');

// Init Express
const app = express();
require('dotenv').config();

// DB Connection
mongoose.Promise = global.Promise;
let dev = process.env.DEV;
mongoose.connect(
  dev
    ? `mongodb://${process.env.LOCAL_DB}`
    : `mongodb://${process.env.PROD_DB}`,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (e) => {
    if (e) {
      const dbError = {
        error: e,
        msg: 'Error Connecting to Database. Please check MongoDB is running',
      };
      console.log(dbError);
    } else {
      console.log(`Connected to ${dev ? 'Development' : 'Prod'} Database`);
    }
  }
);

// Server Config
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan('combined', { stream: winston.stream }));
app.use(helmet());

// Cors Config
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

// Routes Definitions
const userRoutes = require('./api/routes/userRoutes');
const authRoutes = require('./api/routes/authRoutes');
const scraperRoutes = require('./api/routes/scraperRoutes');
userRoutes(app);
authRoutes(app);
scraperRoutes(app);

// 404 Handling
app.use((req, res) => {
  winston.error(`'Hit 404' - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
