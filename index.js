const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const pino = require('pino');
const cors = require("cors");
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
});
const pinoHttp = require('pino-http');

const loggerMiddleware = pinoHttp({
    logger
});

const newsRoutes = require("./routes/news");
const usersRoutes = require("./routes/auth");
const config = require("./config")


app.use(loggerMiddleware);
app.use(cors());
app.use(bodyParser.json());
app.use("/api/news", newsRoutes);
app.use("/api/users", usersRoutes);


app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "something went wrong";
    res.status(statusCode).json({
        message
    });
});


mongoose.connect(config.MONGO_URL).then(
    app.listen(config.PORT)

).catch(err => console.log(err));
module.exports = app;