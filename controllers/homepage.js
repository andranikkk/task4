const { prisma } = require("../prisma/prisma-client");

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
  all,
  remove,
  block,
  unblock,
};
