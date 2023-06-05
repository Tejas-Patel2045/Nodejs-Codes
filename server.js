const helmet = require('helmet');
const compression = require('compression');


const express = require("express");
const app = express();
const server = require("http").Server(app);


const restaurantRoutes = require("./routes/restaurantRoutes");
const validator = require("./utilities/validator");
const utils = require("./utilities/reusableFunctions");
const config = require("./configs/config.json");
const port = config.serverPort;

const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const filterCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses if this request header is present
    return false;
  }

  // fallback to standard compression
  return compression.filter(req, res);
};

app.use(compression({
  level: 1,
  // filter decides if the response should be compressed or not,
  // based on the `shouldCompress` function above
  filter: filterCompress,
  // threshold is the byte threshold for the response body size
  // before compression is considered, the default is 1kb
  threshold: 0
}));


app.use((err, req, res, next) => {
  // you can error out to stderr still, or not; your choice
  console.error(err);

  // body-parser will set this to 400 if the json is in error
  if (err.status === 400)
    return res.status(err.status).send({ message: 'Dude, you messed up the JSON', success: false });

  return next(err); // if it's not a 400, let the default error handling do it. 
});

//Security middleware
app.use(helmet());
app.use('/api', restaurantRoutes);
module.exports = server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
