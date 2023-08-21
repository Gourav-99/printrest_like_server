import { error } from "winston";
import { Comment, Post } from "../database";
import logger from "../logger";

export const addComment = async (req, res) => {
  try {
    const { commentText } = req.body;
    const user = req.user.id;
    // console.log(user);
    // if (!user) {
    //   logger.error(error);
    //   return res.status(400).json({
    //     message: "Unauthorised",
    //     success: false,
    //   });
    // }
    const comment = await Comment.create({
      commentText,
      user,
    });
    // const go =
    // console.log(await comment.populate("user"), "here is comments data");
    const { id } = req.params;
    const updateInPost = await Post.findByIdAndUpdate(id, {
      $push: {
        comments: comment._id,
      },
    });
    return res.status(200).json({
      message: "Comment added successfully",
      success: true,
      data: comment,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const delComment = await Comment.findByIdAndDelete(id);
    return res.status(200).json({
      message: "comment deleted successfull",
      success: true,
      data: delComment,
    });
  } catch (error) {
    logger.log(error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
