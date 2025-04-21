const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(200).json({ 
        message: "Đăng ký thành công", 
        user: {
            id: result.id,
            username: result.username,
            email: result.email,
        },
        token: result.token,
    });
    console.log(result)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json({ 
        message: "Đăng nhập thành công", 
        // user: {
        //     id: result.id,
        //     username: result.username,
        //     email: result.email,
        // },
        token: result.token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message)
  }
}

module.exports = { register, login };
