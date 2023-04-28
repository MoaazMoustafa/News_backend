const axios = require("axios");
const redis = require("redis");
const User = require("../models/user");
const client = redis.createClient({
    host: "redis-server",
});

const appConfig = require("../config");

exports.sources = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const userSources = user?.sources || [];

    axios
        .get(
            `${appConfig.newsBaseURL}/top-headlines/sources?apiKey=${appConfig.API_KEY}`
        )
        .then((result) => {
            result?.data?.sources.map((source) => {
                if (userSources.includes(source?.id)) source.subscribed = true;
                else {
                    source.subscribed = false;
                }
                return source;
            });
            return res.status(200).json(result.data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.subscribe = async (req, res, next) => {
    try {
        const source = req.body.source;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $addToSet: { sources: source } },
            { new: true }
        );
        client.del(user._id.toString());
        client.del("mostSubscribed");
        return res.status(200).send("subscribed");
    } catch (err) {
        next(err);
    }
};

exports.unSubscribe = async (req, res, next) => {
    try {
        const source = req.body.source;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { sources: source } },
            { new: true }
        );
        client.del(user._id.toString());
        client.del("mostSubscribed");
        return res.status(200).send("unsubscribed");
    } catch (err) {
        next(err);
    }
};

exports.home = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        let sourcesParam;
        if (user.sources) sourcesParam = user?.sources.join();
        else {
            sourcesParam = "";
        }

        client.get(req.user._id.toString(), (err, reply) => {
            if (err) console.error(err);
            if (reply) {
                return res.status(200).json(JSON.parse(reply));
            } else {
                const queryParam = sourcesParam
                    ? `everything?sources=${sourcesParam}`
                    : "top-headlines?country=us";
                axios
                    .get(
                        `${appConfig.newsBaseURL}/${queryParam}&apiKey=${appConfig.API_KEY}`
                    )
                    .then((result) => {
                        client.set(
                            req.user._id.toString(),
                            JSON.stringify(result.data),
                            "EX",
                            300,
                            (err, reply) => {
                                if (err) next(err);
                                return res.status(200).json(result.data);
                            }
                        );
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.mostSubscribed = (req, res, next) => {
    client.get("mostSubscribed", function (err, cachedResult) {
        if (err) next(err);
        if (cachedResult) return res.status(200).json(JSON.parse(cachedResult));
        else {
            User.aggregate([
                { $unwind: "$sources" },
                { $group: { _id: "$sources", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 },
            ])
                .then((result) => {
                    client.set(
                        "mostSubscribed",
                        JSON.stringify(result),
                        "EX",
                        300,
                        (err, reply) => {
                            if (err) throw err;
                            return res.status(200).json(result);
                        }
                    );
                })
                .catch((err) => next(err));
        }
    });
};
