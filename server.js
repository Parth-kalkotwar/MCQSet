const express = require("express");
const app = express();
const db = require("./models");
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const quesRoutes = require("./routes/questions");
app.use("/api", quesRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log("Listing to Port ", PORT);
  });
});
