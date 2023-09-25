const mongoose = require("mongoose");

const connectDatabase = async() => {
 try{ await mongoose
    .connect(process.env.DB_URL, 
        {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }
    )
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
    }catch(err){
  console.error(err);
    }
 
};

module.exports = connectDatabase;
