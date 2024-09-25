const express = require("express");
const router = express.Router();
const userAuthentication = require("../middlewares/auth");
const followController = require("../controllers/follow");

router.post(
  "/follow/:authorId",
  userAuthentication,
  followController.followUser
);

router.post(
  "/unfollow/:authorId",
  userAuthentication,
  followController.unFollowUser
);

router.get(
  "/status/:authorId",
  userAuthentication,
  followController.followStatus
);

module.exports = router;
