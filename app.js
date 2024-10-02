const express = require('express');
const app = express();
const port = 8080;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const payload = require('./middlewares/payload.middleware');

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));

app.use(bodyParser.json());

app.use(express.json({ extended: true }));

app.use(helmet());

app.use(payload.body);

require('./routes/index')(app);

app.get('/', (req, res) => {
    res.send('API is working.');
});

app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});