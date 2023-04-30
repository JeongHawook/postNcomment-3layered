const { Transaction } = require("sequelize");
const { Users, UserInfos, sequelize } = require("../models");
const AppError = require("../utils/appError");
class UserRepository {
    signup = async (
        nickname,
        bcryptPassword,
        name,
        age,
        gender,
        email,
        profileImage
    ) => {
        const t = await sequelize.transaction({
            isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
        });
        try {
            const user = await Users.create(
                {
                    name,
                    nickname,
                    password: bcryptPassword,
                },
                { transaction: t }
            ).catch(() => {
                throw new AppError(5010);
            });
            await UserInfos.create(
                {
                    name,
                    userId: user.userId,
                    nickname,
                    age,
                    gender,
                    email,
                    profileImage,
                },
                { transaction: t }
            );
            await t.commit();
        } catch (error) {
            await t.rollback();
        }
    };
    check = async (nickname) => {
        checkNickname = await Users.findOne({
            where: { nickname: nickname },
        }).catch(() => {
            throw new AppError(5011);
        });
        return checkNickname;
    };
}
module.exports = UserRepository;
