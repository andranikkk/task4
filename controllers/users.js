const { prisma } = require("../prisma/prisma-client");
const jwt = require("jsonwebtoken");
const brypt = require("bcrypt");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await prisma.user.findFirst({ where: { email } });

    const isPasswordCorrect =
      user && (await brypt.compare(password, user.password));
    const secret = process.env.JWT_SECRET;

    if (user && isPasswordCorrect && secret) {
      res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error processing" });
    console.error(error);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields must be provided" });
    }

    const registeredUser = await prisma.user.findFirst({
      where: { email },
    });

    if (registeredUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const salt = await brypt.genSalt(10);
    const hashedPassword = await brypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const secret = process.env.JWT_SECRET;

    if (user && secret) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name,
        token: jwt.sign({ id: user.id }, secret, { expiresIn: "30d" }),
      });
    } else {
      return res
        .status(400)
        .json({ message: "Email or password is incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error processing" });
    console.error(error);
  }
};

const current = async (req, res) => {
  return res.status(200).json(req.user);
};

const all = async (req, res) => {
  try {
    const allUsers = await prisma.user.findMany();
    
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ message: "Error getting users" });
    console.error(error);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).json("User deleted!");
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
    console.error(error);
  }
};

const block = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        isBlocked: true,
      },
    });
    res.status(204).json({ message: "Ok" });
  } catch (error) {
    res.status(500).json({ message: "Error processing" });
    console.error(error);
  }
};

const unblock = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.updateMany({
      where: {
        id,
      },
      data: {
        isBlocked: false,
      },
    });
    res.status(204).json("Ok");
  } catch (error) {
    res.status(500).json({ message: "Error processing" });
    console.error(error);
  }
};

module.exports = {
  login,
  register,
  current,
  all,
  remove,
  block,
  unblock,
};
