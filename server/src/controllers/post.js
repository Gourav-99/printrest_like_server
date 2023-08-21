import { log } from "winston";
import { Post, User } from "../database";
import logger from "../logger";
import axios from "axios";

export const createPost = async (req, res) => {
  try {
    const file = req.file;
    const uploadIoDoc = await axios.post(
      `https://api.upload.io/v2/accounts/${
        process.env.UPLOAD_IO_ACCOUNT_ID || "W142i6B"
      }/uploads/binary`,
      file.buffer,
      {
        headers: {
          Authorization: `Bearer ${
            process.env.UPLOAD_IO_API_KEY ||
            "public_W142i6BD83frV8iiMMihkhdd9wtR"
          }`,
        },
      }
    );
    const { fileUrl } = uploadIoDoc.data;
    const { title, description } = req.body;
    const post = await Post.create({
      title,
      description,
      image: fileUrl,
      user: req.user.id,
    });
    return res.status(201).json({
      message: "Post created succesfully",
      success: true,
      data: post,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    console.log(req.query);
    const { _limit = 10, _page = 1, _search } = req.query;

    if (_search && _search.length > 0) {
      logger.warn("searching ", _search, _search.length);
      const posts = await Post.find({
        title: { $regex: _search, $options: "i" },
      })
        // await Post.find({$text: {$search: _search}})
        .limit(_limit)
        .skip((_page - 1) * 10)
        .sort({ createdAt: -1 })
        .populate("user");
      return res.status(201).json({
        message: "Posts fetched successfully",
        success: true,
        data: posts,
      });
    }
    const offset = (_page - 1) * 10;
    const posts = await Post.find()
      .limit(_limit)
      .skip(offset)
      .sort({ createdAt: -1 })
      .populate("user");
    return res.status(201).json({
      message: "Posts fetched successfully",
      success: true,
      data: posts,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id)
      .populate("user", "firstName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "firstName profilePicture", // Select only the fields you need
        },
      });
    // console.log(post);
    if (!post) {
      return res.status(400).json({
        message: "Post doen'st exists",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Post fetched successFully",
      success: true,
      data: post,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const post = await Post.findByIdAndUpdate(id, { title, description });
    return res.status(200).json({
      message: "Post Updated success fully",
      success: true,
      data: post,
    });
  } catch (error) {
    logger.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const liked = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("post id", id);
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          likes: req.user.id,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Liked Successfully",
      success: true,
      data: post.likes,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Post deleted Successfully",
      success: true,
      data: deletedPost,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
