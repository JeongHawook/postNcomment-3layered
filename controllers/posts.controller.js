const PostService = require("../services/posts.service");
const LikeService = require("../services/likes.service");
const AppError = require("../utils/appError");
const { postSchema } = require("../utils/joi");
class PostController {
    postService = new PostService();
    likeService = new LikeService();
    getAllPosts = async (req, res) => {
        try {
            const getPosts = await this.postService.getPosts();
            return res.status(200).json({ posts: getPosts });
        } catch (error) {
            throw new AppError(error.errorCode || 4000);
            //고집부리기:  좋은점: 수정이 쉽다, 추가도 쉽다, 나중에 찾기도 쉽다, 간결하다, 확장성 재사용성. 이걸 못쓰게 날 더 설득해주세요
        }
    };

    getOnePost = async (req, res) => {
        try {
            const { _postId } = req.params;

            const getPost = await this.postService.getPost(_postId);

            return res.status(200).json({ post: getPost });
        } catch (error) {
            throw new AppError(error.errorCode || 4000);
        }
    };

    createPost = async (req, res) => {
        try {
            const { title, content } = await postSchema
                .validateAsync(req.body, { abortEarly: false })
                .catch((error) => {
                    return res.status(412).json(error.message);
                }); //굳이 throw까지 갈 이유가 없음 joi에서 메세지를 보내니

            const { userId, nickname } = res.locals.user;

            await this.postService.createPost(title, content, userId, nickname);

            return res
                .status(201)
                .json({ message: "게시글 작성에 성공하였습니다" });
        } catch (error) {
            throw new AppError(error.errorCode || 4001);
        }
    };

    updatePost = async (req, res) => {
        try {
            const { title, content } = await postSchema
                .validateAsync(req.body)
                .catch((error) => {
                    return res.status(412).json(error.message);
                });
            const { userId } = res.locals.user;
            const { _postId } = req.params;

            await this.postService.updatePost(title, content, _postId, userId); //
            return res
                .status(200)
                .json({ message: "게시글을 수정하였습니다." });
        } catch (error) {
            throw new AppError(error.errorCode || 4002);
        }
    };

    deletePost = async (req, res) => {
        try {
            const { userId } = res.locals.user;
            const { _postId } = req.params;

            await this.postService.deletePost(title, content, _postId, userId); //
            return res
                .status(200)
                .json({ message: "게시글을 수정하였습니다." });
        } catch (error) {
            throw new AppError(error.errorCode || 4010);
        }
    };

    getLiked = async (req, res) => {
        try {
            const { userId } = res.locals.user;
            const { _postId } = req.params;

            await this.likeService.getLiked(userId, _postId);
        } catch (error) {
            throw new AppError(error.errorCode || 4005);
        }
    };

    postLike = async (req, res) => {
        const { _postId } = req.params;
        const { userId } = res.locals.user;
        try {
            const postLike = await this.likeService.postLiked(_postId, userId);

            postLike == 0
                ? res
                      .status(200)
                      .json({ message: "게시글에 좋아요를 눌렀습니다." })
                : res
                      .status(200)
                      .json({ message: "게시글에 좋아요를 취소하였습니다." });
        } catch {
            throw new AppError(error.errorCode || 4004);
        }
    };
}
module.exports = PostController;
