const app = require('./app');
const route = require('./routes/index.route');
const db = require('./config/db/index.db');

db.connect();

const port = process.env.PORT || 3000;

route(app);

app.listen(port, () => {
    console.log(`App listening on port 127.0.0.1:${port}`);
})

