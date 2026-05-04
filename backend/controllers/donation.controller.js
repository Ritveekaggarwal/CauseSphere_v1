import Donation from "../models/donation.model.js";

export const getDonorDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 USER STATS
    const stats = await Donation.aggregate([
      { $match: { donorUser: userId } },
      {
        $group: {
          _id: "$donorUser",
          totalDonated: { $sum: "$amount" },
          campaigns: { $addToSet: "$campaign" }
        }
      },
      {
        $project: {
          totalDonated: 1,
          campaignsCount: { $size: "$campaigns" }
        }
      }
    ]);

    // 🔥 LEADERBOARD (ALL USERS)
    const leaderboard = await Donation.aggregate([
      {
        $group: {
          _id: "$donorUser",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          total: 1,
          name: { $arrayElemAt: ["$user.firstName", 0] }
        }
      }
    ]);

    // 🔥 RANK
    const all = await Donation.aggregate([
      {
        $group: {
          _id: "$donorUser",
          total: { $sum: "$amount" }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const rank =
      all.findIndex(d => d._id?.toString() === userId.toString()) + 1;

    res.json({
      totalDonated: stats[0]?.totalDonated || 0,
      campaignsCount: stats[0]?.campaignsCount || 0,
      leaderboard,
      rank: rank || "-",
    });

  } catch (err) {
    res.status(500).json({ msg: "Dashboard error" });
  }
};