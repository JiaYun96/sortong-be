require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const cors = require('cors')

// =======================================
//              MIDDLEWARE
// =======================================

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// =======================================
//              LISTENER
// =======================================

// Mongoose connection setup
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-ov6942-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,{useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;

db.once('open', () => {
  // we're connected!
  console.log('Connection to server via mongoose successful');
  app.listen(port, () => {
    console.log(`SORTONG app listening on port: http://localhost:${port}/`)
  });
});

db.on('error', () => {
  console.log("Mongoose connection failed");
});

