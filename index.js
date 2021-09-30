const app = require('./src/app')
const NODE_ENV = process.env.NODE_ENV || 'development'
const host = '0.0.0.0'

require('./src/database');
require('dotenv').config();

const init = async () =>{

    await app.listen(process.env.PORT || 4000, host)
    
    console.log('App runnig on port: ',process.env.PORT || 4000)
}

init()

module.exports = app;
