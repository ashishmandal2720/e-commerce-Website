const mongoose = require("mongoose");
const Url = 'mongodb://localhost/FoodiesApp'
// const Url = 'mongodb://localhost:27017/dogsTinder'
// const Url = 'mongodb+srv://foodiesApp:Ashish!123@cluster0.op7l1ju.mongodb.net/foodiesApp'
exports.connect = () => {
    mongoose.connect(Url)
        .then(() => {
            console.log("sucessfully connected to database");   
        })
        .catch((error) => {
            console.log("database connection failed. existing now...");
            console.error(error);

        });
};
