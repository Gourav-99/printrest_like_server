import { User } from "../database";
import logger from "../logger";
import { checkPass } from "../utils/auth.utils";
import {
  generateResetToken,
  generateToken,
  verifyAuthToken,
  verifyResetToken,
} from "../utils/token";

export const validateAuth = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = await verifyAuthToken(token);
    if (!decoded) {
      return res.status(401).json({
        message: "!invalid token",
        success: false,
      });
    }
    return res.status(201).json({
      message: "token validated succesfully",
      success: true,
      data: decoded,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    const alreadyUser = await User.findOne({ email });
    if (alreadyUser) {
      return res.status(400).json({
        message: "!User already exists",
        success: false,
      });
    }
    const createUser = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
    });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      data: createUser,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User doesn't exist",
        success: false,
      });
    }
    console.log(user);
    const isMatch = await checkPass(password, user.password);
    console.log(isMatch, "here");
    if (!isMatch) {
      return res.status(400).json({
        message: "!Invalid credentials",
        success: false,
      });
    }
    const userData = {
      id: user._id,
      email: user.email,
      initials: user.initials,
      fullName: user.fullName,
      profilePicture: user.profilePicture,
      role: user.role,
    };
    const token = await generateToken(userData);
    return res
      .cookie("access_token", token, {
        httpOnly: false, //when set to true it cann't be accessed from browser or client side
      })
      .status(201)
      .json({
        message: "Logged in succesfully",
        success: true,
        data: {
          token,
          user: userData,
        },
      });
  } catch (error) {
    logger.warn(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "user doesn't exists",
        success: false,
      });
    }
    const token = await generateResetToken({ email });
    const resetPassLink = `http://localhost:3000/reset-password/${token}`;
    return res.status(201).json({
      message: "Reset password sent to your email",
      success: true,
      data: {
        token,
        resetPassLink,
      },
    });
  } catch (error) {
    logger.warn(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const decoded = await verifyResetToken(token);
    if (!decoded) {
      return res.status(400).json({
        message: "!invalid or expired token",
        success: false,
      });
    }
    const { email } = decoded;
    const user = await User.findOne({ email });
    user.password = password;
    await user.save();
    return res.status(201).json({
      message: "Password reset successfully",
      success: true,
    });
  } catch (error) {
    logger.warn(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const logout = (req, res) => {
  return res.clearCookie("access_token", { path: "/" }).status(201).json({
    message: "logged out successfully",
    success: true,
  });
};
