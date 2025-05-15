const mongoose =  require('mongoose');

const dbconnect =  async  () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce ', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DataBase Connected");
    } catch (error) {
        console.log("DataBase Connection Error", error);
    };

}

module.exports = dbconnect;