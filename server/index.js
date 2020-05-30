const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Api docs
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./docs/docs.yaml');
const options = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Renting",
  customfavIcon: "/docs/rent.png"
};
app.use('/docs', express.static('docs'));
const config = require("./config/key");

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const mongoose = require("mongoose");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));


app.use('/uploads', express.static('uploads'));


if (process.env.NODE_ENV === "production") {

  
  app.use(express.static("client/build"));

  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

app.listen(process.env.PORT || 5000, function () {
  console.log('Listening on port 5000')
});