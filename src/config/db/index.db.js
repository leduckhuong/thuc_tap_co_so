const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.connect(process.env.DBURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect mongodb successfully!!!');
    }
    catch(error) {
        console.log('Connect falure!!!');
        console.log('Error: ', error);
    }
}

module.exports = { connect };
