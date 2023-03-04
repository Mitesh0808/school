//importing modules
const cookieParser = require("cookie-parser");

const express = require("express");
const cors = require("cors");
swaggerJsdoc = require("swagger-jsdoc");
swaggerUi = require("swagger-ui-express");
const app = express();
const connectDb = require("./connectDb/connectDb");
connectDb();
const notFound = require("./middleware/not-found");
const router = require("./routers");
//db importing
app.use(cors());
const swaggerJSONDocument = require("./swagger.json");
// const swaggerYAMLDocument = require("./");
//parser
app.use(express.json());
app.use(cookieParser());
//swagger
//routers
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJSONDocument));

// app.use("/", (req, res) => {
//   res.send("server working");
// });
app.use("/", router);
//not found
app.use(notFound);
//

app.listen(5000, (err) => {
  if (err) console.log(err);
  else console.log("server listing at 5000");
});
