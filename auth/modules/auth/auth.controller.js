const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validate } = require("../../../models/user.model");
const User = require("../../../models/user.model");

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  let user = await User.findOne({ email: email });

  if (!user) {
    res.send({
      error: true,
      message: "Invalid email or password",
    });
    return;
  }

  let matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    res.send({
      error: true,
      message: "Invalid email or password",
    });
    return;
  }

  // Generate JWT
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    "secret"
  );

  res.send({
    error: false,
    message: "Login successfull",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,

      token: userJwt,
    },
  });
}

async function signup(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const user_type = req.body.user_type;

  let user = await User.findOne({ email: email });

  if (user) {
    res.send({
      error: true,
      message: "Email already exists",
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let newUser = {
    firstName,
    lastName,
    email,
    user_type,
    password: hashedPassword,
  };

  try {
    const savedUser = await User.create(newUser);

    const userJwt = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
      },
      process.env.JWT_SECRET
    );

    res.send({
      error: false,
      message: "Account created successfully",
      data: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        token: userJwt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({
      error: true,
      message: "Failed to create user",
    });
  }
}
async function details(req, res) {
  const Users = await User.find();
  console.log(Users);
  res.send({});
}
module.exports = {
  login,
  signup,
  details,
};
