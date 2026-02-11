const mongoose = require("mongoose");

function ConnectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.error("Database connection failed:", err.message);
      process.exit(1); // Stop app if "Database" fails
    });
}

module.exports = ConnectToDB;
