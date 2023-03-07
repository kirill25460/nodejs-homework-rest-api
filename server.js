const app = require('./app')
const mongoose = require("mongoose");

const DB_HOST = 'mongodb+srv://mallet25460:fXxAFmT8nkuDzPnp@cluster0.499jj56.mongodb.net/db-contacts?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);
mongoose.connect(DB_HOST)
.then (() => app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000");
  console.log("Database connection successful")
}))
.catch (error => {
  console.log(error.messege);
process.exit(1);})


