const PostRepository = require("../repositories/posts.repository");
const AppError = require("../utils/appError");
class PostService {
    postRepository = new PostRepository();

    getPosts = async () => {
        const getPosts = await this.postRepository.getPosts();
        if (getPosts.length < 1) throw new AppError(4022); //{}
        return getPosts;
    };
    getPost = async (_postId) => {
        const getPost = await this.postRepository.getPost(_postId);
        if (!getPost) throw new AppError(4022);
        return getPost;
    };

    createPost = async (title, content, userId, nickname) => {
        await this.postRepository.createPost(title, content, userId, nickname);
    };

    authorize = async (_postId, userId) => {
        const getPost = await this.postRepository.getPost(_postId);
        return getPost.userId === userId;
    };
    updatePost = async (title, content, _postId, userId) => {
        const authorize = await this.authorize(_postId, userId);
        if (authorize === true) {
            await this.postRepository.updatePost(
                title,
                content,
                _postId,
                userId
            );
        } else {
            throw new AppError(4018);
        }
    };

    deletePost = async (_postId, userId) => {
        const authorize = await this.authorize(_postId, userId);
        if (authorize === true) {
            await this.postRepository.deletePost(_postId);
        } else {
            throw new AppError(4019);
        }
    };
}

module.exports = PostService;
