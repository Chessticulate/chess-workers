const app = require('./app');
const logger = require('./logger');
const config = require('./config');

app.listen(config.SERVER_PORT, () => {
  logger.info(`Server running on port ${config.SERVER_PORT}`);
});
