const app = require('./src/app');
const logger = require('./src/logger');
const config = require('./src/config');

app.listen(config.SERVER_PORT, () => {
    logger.info(`Server running on port ${config.SERVER_PORT}`);
});
