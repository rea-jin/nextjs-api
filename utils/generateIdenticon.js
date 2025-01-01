const Identicon = require("identicon.js");

const generateIdenticon = (username, size = 64) => {
  // ハッシュ化 15文字必要？
  console.log(username);
  let imageString = username;
  if (imageString.length < 15) {
    const random = Math.random().toString(36).substring(2, 20);
    imageString = imageString.padEnd(20, random);
  }
  const hash = require("crypto")
    .createHash("md5")
    .update(imageString)
    .digest("hex");

  const data = new Identicon(hash, size).toString();
  return `data:image/png;base64,${data}`; // image urlになる
};
// どこでも使えるようにexport
module.exports = generateIdenticon;
