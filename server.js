const express = require("express");
const body_parser = require("body-parser");
const routes = require("./routes/router.js");
const connectdb =  require("./config/connectdb.js")
const path = require("path");
const app = express();
const cors = require("cors");
require("dotenv").config();

connectdb()

app.use(express.json());
app.use(express.static(path.resolve(path.join(__dirname, "public"))));
app.use(body_parser.json());
app.use(cors({
    origin:"*",
    withCredentials:true,
}));

app.use(routes);

const port = process.env.PORT;
app.listen(port, () => {
    console.log("Server is riunning on PORT", port);
});



