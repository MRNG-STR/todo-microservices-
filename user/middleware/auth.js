const jwt = require("jsonwebtoken");

var verifytoken = function (req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
var signtoken = function(id) {
  try {
    const payload = {
      user: {
        id: id
      }
    };

    var result = jwt.sign(
      payload,
      "randomString",
      {
        expiresIn: 3600
      }
    );
    return result
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  "verifytoken": verifytoken,
  "signtoken": signtoken
}