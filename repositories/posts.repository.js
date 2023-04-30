const { Posts } = require("../models");
const AppError = require("../utils/appError");

class PostRepository {
    getPosts = async () => {
        const getPosts = await Posts.findAll({
            attributes: [
                "postId",
                "userId",
                "nickname",
                "title",
                "createdAt",
                "updatedAt",
                "likes",
            ],
            order: [["createdAt", "DESC"]],
        }).catch(() => {
            throw new AppError(5000);
        });
        return getPosts;
    };

    getPost = async (_postId) => {
        const getPost = await Posts.findByPk(_postId).catch(() => {
            throw new AppError(5000);
        });
        return getPost;
    };

    createPost = async (title, content, userId, nickname) => {
        await Posts.create({
            title,
            content,
            userId,
            nickname,
        }).catch(() => {
            throw new AppError(5001);
        });
    };
    updatePost = async (title, content, _postId, userId) => {
        await Posts.update(
            {
                title: title,
                content: content,
            },
            {
                where: {
                    postId: _postId,
                    userId: userId,
                },
            }
        ).catch(() => {
            throw new AppError(5002);
        });
    };

    deletePost = async (_postId) => {
        //권한에서 이미 확인했으니까
        await Posts.destroy({
            where: {
                postId: _postId,
            },
        }).catch(() => {
            throw new AppError(5003);
        });
    };
}
module.exports = PostRepository;
