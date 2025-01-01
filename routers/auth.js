// server.jsではappを使っていたがrouterにする
const router = require("express").Router(); // 関数
const { PrismaClient } = require("@prisma/client"); // prismaをつかうため
const bcrypt = require("bcrypt"); // パスワードハッシュのため　　モジュールによって変数かオブジェクトで読み込むかが違う
const jwt = require("jsonwebtoken");
const generateIdenticon = require("../utils/generateIdenticon"); // 画像生成のため

// prisma client
const prisma = new PrismaClient();

// 新規ユーザー登録API urlを変更する
router.post("/register", async (req, res) => {
  // 分割代入でリクエスト取得
  const { username, email, password } = req.body;
  //   password はハッシュ化
  const hashedPassword = await bcrypt.hash(password, 10);
  // アイコン画像作成
  const size = 64;
  console.log(username);
  const profileImageUrl = generateIdenticon(username, size);
  // modelを使ってdataを挿入
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      profile: {
        create: {
          bio: "hello, nice to meet you",
          profileImageUrl: profileImageUrl,
        },
      },
    },
    include: {
      profile: true, // profileにもアクセスできる
    },
  });
  // 取得したオブジェクトを返す
  return res.json({ user });
});

// ユーザーログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // emailはユニークなので
  const user = await prisma.user.findUnique({ where: { email } }); // モデルのデータが取れる
  // ユーザーがいなければ
  if (!user) {
    return res.status(401).json({ error: "パスワードかメルアドが違います:e1" });
  }
  console.log(user);

  // password check
  const isPasswordValid = await bcrypt.compare(password, user.password); // リクエストとモデルの値を比較
  if (!isPasswordValid) {
    return res.status(401).json({ error: "パスワードかメルアドが違います:e2" });
  }
  console.log(isPasswordValid);

  // json web token のライブラリを使う
  // .envはprocess.envでよびだせる
  // user idをpayloadに入れてるのでJWTのサイトでトークンを貼り付けるとidの値が見れる
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d", // 期限：1d or 20h or 60　など
  });

  // tokenだけかえす
  return res.json({ token });
});

// 出力して他で使えるようにする
module.exports = router; // 上で指定したオブジェクト
