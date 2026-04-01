// Happy coding guys
const express = require("express");
const session = require("express-session");
const { normalizeRole } = require("./helpers/role");
const app = express();
const port = 3000;
const router = require("./routers/index");

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "gobite-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.userName = req.session.userName || null;
  res.locals.userId = req.session.userId || null;
  res.locals.userRole = normalizeRole(req.session.role) || null;
  next();
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Wang parkirnya ${port} bang`);
});
