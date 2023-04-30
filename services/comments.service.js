const CommentRepository = require("../repositories/comments.repository");
const PostRepository = require("../repositories/posts.repository");
const AppError = require("../utils/appError");
class CommentService {
    commentRepository = new CommentRepository();
    postRepository = new PostRepository();
    getComments = async (_postId) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const getComments = await this.commentRepository.getComments(
                _postId
            );
            if (getComments.length < 1) throw new AppError(4007);

            // getComments.map((comment)=>{

            // })
            return getComments;
        } catch (error) {
            throw new AppError(error.errodCode || 4008);
        }
    };
    createComment = async (_postId, userId, nickname, comment) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            await this.commentRepository.createComment(
                _postId,
                userId,
                nickname,
                comment
            );
        } catch (error) {
            throw new AppError(error.errodCode || 4009);
        }
    };

    authorize = async (_commentId, userId) => {
        const authorize = await this.commentRepository.getOneComment(
            _commentId
        );
        if (!authorize) throw new AppError(4007);

        return authorize.userId === userId ? true : false;
    };

    updateComment = async (userId, _postId, _commentId, comment) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const auth = await this.authorize(_commentId, userId);
            if (auth === false) throw new AppError(4018);
            //1. post 가 있는지 확인 //postRepo가져오면될슫
            //2. comment가 있는지 확인//commentId로 조회
            //3. comment의 userId 가 나인지 확인.//조회한 값의 userId랑 비교

            //authorize
            await this.commentRepository.updateComment(
                userId,
                _postId,
                _commentId,
                comment
            );
        } catch (error) {
            throw new AppError(error.errodCode || 4012);
        }
    };
    deleteComment = async (userId, _commentId, _postId) => {
        try {
            const getOnePost = await this.postRepository.getPost(_postId);
            if (!getOnePost) throw new AppError(4022);

            const auth = await this.authorize(_commentId, userId);
            if (auth === false) throw new AppError(4018);

            await this.commentRepository.deleteComment(_commentId);
        } catch (error) {
            throw new AppError(4010);
        }
    };
}
module.exports = CommentService;
