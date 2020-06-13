const mongoose = require("mongoose");
const app = require("./app");

mongoose
  .connect("mongodb://localhost:27017/my_database", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected DB");
    console.log("app is running on port 5000");
    return app.listen(5000);
  })
  .catch((err) => {
    console.log("not connected");
    console.log(err);
  });

// prepei na kano  install kai to mongoDb ektos apo to mongoose
// GIA TO DB PREPEI NA TREKSO PROTA TO DOCKER CONTAINER ME :
// docker run -d -p 27017:27017 --name my-mongo mongo

// me to docker container ls vlepo pia containers trexo

// docker stop my-mongo

// sto contorlers folder exo tin logiki/methods pou ektelite otan pigeno se kapio route

// trexo ta test apla grafodas npm run test
