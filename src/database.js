const mongoose = require('mongoose');
//const URI = 'mongodb://192.168.0.10/inventary'
const URI = 'mongodb+srv://jna52:jimena52@cluster0.wlb9g.mongodb.net/inventary?retryWrites=true&w=majority'
const db = mongoose.connection;

const connect = () =>{
    mongoose.connect(URI,{
        useUnifiedTopology: true,
        useCreateIndex: true,
        useNewUrlParser: true        
    })

    db.on('open',(_) =>{
        console.log('Database connect');
    });

    db.on('error', error => console.log("Error:", error));
}

connect();