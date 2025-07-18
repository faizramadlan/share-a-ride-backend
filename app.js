if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const mainRouter = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const port = process.env.PORT || 4002;
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN || '', tracesSampleRate: 1.0 });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(Sentry.Handlers.requestHandler());
app.use('/api/v1', mainRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(errorHandler);
app.use(Sentry.Handlers.errorHandler());
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
