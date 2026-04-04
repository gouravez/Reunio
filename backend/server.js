const app = require("./src/app");
const PORT = process.env.PORT;
const connectDB = require("./src/db/db");

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
