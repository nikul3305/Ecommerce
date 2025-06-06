const mongoose =  require('mongoose');

const dbconnect =  async  () => {

    await mongoose.connect('mongodb://localhost:27017/mydb')
        .then(() => console.log('Database Connected'))
        .catch((err) => console.error(err));

}
module.exports = dbconnect;