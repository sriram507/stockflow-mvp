// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   const token = req.headers.authorization;

//   console.log("TOKEN RECEIVED:", token); // DEBUG LINE

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const decoded = jwt.verify(token, "secret");
//     req.orgId = decoded.orgId;
//     next();
//   } catch (err) {
//     console.error("JWT ERROR:", err.message);
//     return res.status(403).json({ message: "Invalid token" });
//   }
// };


const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, "secret");
    req.orgId = decoded.orgId;
    next();
  } catch {
    res.sendStatus(403);
  }
};
