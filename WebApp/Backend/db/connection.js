//FOR LIVE SERVER CAPROVER Uncomment it
const mongoose = require("mongoose");

// mongoose
//   .connect(
//     "mongodb://srv-captain--smart-agri-database/mydatabase?authSource=admin",
//     {
//       user: "smartAgriDatabase",
//       pass: "sma$r$t$Agr$iD$a$%tabase",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("DB Connected");
//   })
//   .catch((err) => {
//     console.log("Error Connecting to Database");
//     console.log(err);
//   });

mongoose
  .connect(
    "mongodb+srv://rehan:rehan@cluster0.qhfay.mongodb.net/taggtoday?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected To MongoDB");
  })
  .catch((error) => {
    console.log("Error while connecting to Database");
    console.log(error.message);
  });
