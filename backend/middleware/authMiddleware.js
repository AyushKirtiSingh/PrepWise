const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    // 1. get token from request headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not logged in. Please login first." });
    }

    // 2. extract the token — header looks like "Bearer eyJhbGci..."
    const token = authHeader.split(" ")[1];

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    // 4. attach userId to request so next function can use it
    req.userId = decoded.userId;

    // 5. move to the next function
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token. Please login again." });
  }
};

module.exports = protect;