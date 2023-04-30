exports.tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res);
    } catch (error) {
        console.log("check2222222");
        return next(error);
    }
};
