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
  const userType = req.body.userType;
  const address = req.body.address; // Assuming req.body.address is an object containing address fields

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
    userType,
    address: [address], // Wrap the address object in an array if it's not already an array
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
        address: savedUser.address, // Include the address in the response
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
  res.send({ Users });
}
async function addAddress(req, res) {
  const userId = req.params.userId;

  const { street, city, state, zipCode } = req.body;
  console.log("hwkah");
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new address to the user's address array
    user.address.push({ street, city, state, zipCode });

    // Save the updated user document
    await user.save();

    res.status(201).json({ message: "Address added successfully", user });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ error: true, message: "Failed to add address" });
  }
}
module.exports = {
  login,
  signup,
  details,
  addAddress,
};
