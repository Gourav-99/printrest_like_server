import logger from "../logger";
import { verifyAuthToken } from "../utils/token";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(400).json({
        message: "No token provided",
        success: false,
      });
    }
    const decoded = await verifyAuthToken(token);
    if (!decoded) {
      return res.status(400).json({
        message: "!invalid token",
        success: false,
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export default isAuthenticated;
