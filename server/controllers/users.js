import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUsersExceptId = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.find();

    const filtered = users.filter((value) => {
      return value._id != id;
    });

    if (filtered) {
      res.status(200).json(filtered);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
