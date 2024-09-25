const Follow = require("../models/follow");
const User = require("../models/user");

const followUser = async (req, res, next) => {
  const followingId = req.params.authorId;
  const followerId = req.user.id;

  try {
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    await Follow.create({ followerId, followingId });

    res.status(201).json({ message: "Followed the user successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const unFollowUser = async (req, res, next) => {
  const followingId = req.params.authorId;
  const followerId = req.user.id;

  try {
    const follow = await Follow.findOne({ where: { followerId, followingId } });

    if (!follow) {
      return res
        .status(400)
        .json({ message: "You are not following this user" });
    }

    await follow.destroy();

    res.status(200).json({ message: "Unfollowed the user successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

const followStatus = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.authorId;

    const follow = await Follow.findOne({ where: { followerId, followingId } });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { followUser, unFollowUser, followStatus };
