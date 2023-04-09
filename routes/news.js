const express = require("express");
const router = express.Router();
const newsController = require("../controllers/news");
const isAuth = require("../middlewares/auth").auth;

router.get("/", isAuth, newsController.home);
router.get("/sources", isAuth, newsController.sources);
router.get("/mostsubscribed", newsController.mostSubscribed);
//TODO add validation for source
router.post("/subscribe", isAuth, newsController.subscribe);
router.post("/unsubscribe", isAuth, newsController.unSubscribe);

module.exports = router;


