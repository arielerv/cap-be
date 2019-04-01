require('dotenv').load();
const {NODE_ENV, PORT} = process.env;

const app = require('./src');
const logger = require('./src/helpers/logger');

app.listen(PORT, () => logger.info(`Started at port ${PORT} in ${NODE_ENV} environment...`));
