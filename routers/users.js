// server.jsではappを使っていたがrouterにする
const router = require("express").Router(); // 関数
const { PrismaClient } = require("@prisma/client"); // prismaをつかうため
const isAuthenticated = require("../middlewares/isAuthenticated");

// prisma client
const prisma = new PrismaClient();

// ユーザー情報取得API
router.get("/find", isAuthenticated, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });
    console.log(user);

    if (!user) {
      return res.status(404).json({
        error: "ユーザーが見つかりません",
        message: "ユーザーが見つかりません",
      });
    }
    res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
      message: "サーバーエラーです。",
    });
  }
});

// プロフィール取得API
router.get("/profile/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const profile = await prisma.profile.findUnique({
      where: {
        userId: parseInt(userId),
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    console.log(profile);

    if (!profile) {
      return res.status(404).json({
        error: "プロフィールが見つかりません",
        message: "プロフィールが見つかりません",
      });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
      message: "サーバーエラーです。",
    });
  }
});
module.exports = router;
