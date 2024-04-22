const authService = require("../services/authService");

const signUp = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const userData = await authService.signUp({
      first_name,
      last_name,
      email,
      password,
    });

    res
      .status(201)
      .json({ message: "User created successfully", data: userData });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.signIn(email, password);
    res.json({ message: "Logged in successfully", user, token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
module.exports = {
  signIn,
  signUp,
};
