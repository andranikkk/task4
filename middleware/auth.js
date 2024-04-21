const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma/prisma-client");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    //
    if (user && user.isBlocked) {
      return res
        .status(403)
        .json({ message: "Доступ запрещен. Ваш аккаунт заблокирован." });
    }
    // работает после перезагрузки заблокированного пользователя
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
    console.error(error, "catched error from business middleware/auth.js");
  }
};

module.exports = { auth };
