const app = require("./src/index");

app.listen(process.env.PORT, (req, res, next) => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
