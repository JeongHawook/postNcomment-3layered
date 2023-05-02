const PostRepository = require("../repositories/posts.repository");
const AppError = require("../utils/appError");
const { Posts } = require("../models");
class PostService {
    postRepository = new PostRepository(Posts);

    getPosts = async () => {
        try {
            const getPosts = await this.postRepository.getPosts();
            if (getPosts.length < 1) throw new AppError(4022); //{}
            return getPosts;
        } catch (error) {
            console.log(error);
            throw new AppError(error.errorCode || 4000);
            //고집부리기:  좋은점: 수정이 쉽다, 추가도 쉽다, 나중에 찾기도 쉽다, 간결하다, 확장성 재사용성. 이걸 못쓰게 날 더 설득해주세요
        }
    };
    getPost = async (_postId) => {
        try {
            const getPost = await this.postRepository.getPost(_postId);
            if (!getPost) throw new AppError(4022);
            return getPost;
        } catch (error) {
            throw new AppError(error.errorCode || 4000);
        }
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
