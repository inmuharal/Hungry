// Happy coding guys
const express = require('express')
const session = require('express-session')
const app = express()
const port = 3000
const router = require("./routes/index")

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }))

// Setup session
app.use(session({
  secret: 'gobite-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true jika pakai HTTPS
}))

app.use("/", router)

app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
