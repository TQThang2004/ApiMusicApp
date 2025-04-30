const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const registerUser = async (userData) => {
  const { username, email, password } = userData;

  const usersRef = db.ref("users");

  // Kiểm tra email đã tồn tại chưa
  const snapshot = await usersRef
    .orderByChild("email")
    .equalTo(email)
    .once("value");

  if (snapshot.exists()) {
    throw new Error("Email đã được sử dụng");
  }

  const hashedPassword = await hashPassword(password);

  const newUserRef = usersRef.push();
  await newUserRef.set({
    id: newUserRef.key,
    username,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  });

  const token = generateToken({ id: newUserRef.key, email });

  return { id: newUserRef.key, username, email, token };
};

const loginUser = async (userData) => {
  const { email, password } = userData;
  const usersRef = db.ref("users");

  // Kiểm tra email đã tồn tại chưa
  const snapshot = await usersRef
    .orderByChild("email")
    .equalTo(email)
    .once("value");

  if (!snapshot.exists()) {
    throw new Error("Email không tồn tại");
  }

  const user = snapshot.val()[Object.keys(snapshot.val())[0]];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Mật khẩu không đúng");
  }

  const token = generateToken({ id: user.id, username: user.username, email });

  return { token };
};

const loginWithGoogle = async (userData) => {
  const { id, email, name, photo } = userData;
  // console.log(id, email, name, photo);
  const usersRef = db.ref("users");

  const snapshot = await usersRef.orderByChild("id").equalTo(id).once("value");

  if (snapshot.exists()) {
    const userKey = Object.keys(snapshot.val())[0];
    const existingUser = snapshot.val()[userKey];
    const token = generateToken({
      id: existingUser.id,
      username: existingUser.username,
      email,
      photo,
    });
    return {
      token,
    };
  }

  // Nếu chưa có, tạo người dùng mới với id từ Google
  const newUserData = {
    id,
    username: name,
    email,
    avatar: photo,
    createdAt: new Date().toISOString(),
  };

  await usersRef.child(id).set(newUserData);

  const token = generateToken({ id, username, email, avatar });

  return { token };
};

module.exports = {
  registerUser,
  loginUser,
  loginWithGoogle,
};
