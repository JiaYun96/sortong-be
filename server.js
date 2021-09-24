require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8000
const mongoose = require('mongoose')
const cors = require('cors')

//Routers
const userRouter = require('./routers/userRouter')
const boardRouter = require('./routers/boardRouter')
const cardRouter = require('./routers/cardRouter')

// =======================================
//              MIDDLEWARE
// =======================================

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/user',  userRouter)
app.use('/api/v1/boards', boardRouter)
app.use('/api/v1/cards', cardRouter)
app.use('*', (req, res) => res.status(404).json({ error: "not found" }))


// =======================================
//              LISTENER
// =======================================

// Mongoose connection setup
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
// mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-ov6942-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`,{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect('mongodb://localhost/sortong');
const db = mongoose.connection;

db.once('open', () => {
  // we're connected!
  console.log('Connection to server via mongoose successful');
  app.listen(port, () => {
    console.log(`SORTONG app listening on port: http://localhost:${port}/`)
  });
});

db.on('error', (err) => {
  console.log("Mongoose connection failed", err);
});

