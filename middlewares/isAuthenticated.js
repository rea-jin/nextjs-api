const jwt = require("jsonwebtoken");

function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "トークンがありません",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "トークンが正しくありません",
      });
    }

    console.log(decoded.id);
    req.userId = decoded.id;
    next();
  });
}
// このミドルウェアは、リクエストヘッダーのAuthorizationにトークンがあるかどうかを確認します。
// トークンがない場合は、401ステータスコードを返します。
// トークンがある場合は、そのトークンが正しいかどうかを確認します。
// トークンが正しくない場合は、401ステータスコードを返します。
// トークンが正しい場合は、リクエストオブジェクトにユーザーIDを追加して、次のミドルウェアに進みます。next()関数を呼び出すことで、次のミドルウェアに進むことができます。
// module.exportsで、このミドルウェアを外部に公開します。
module.exports = isAuthenticated;
