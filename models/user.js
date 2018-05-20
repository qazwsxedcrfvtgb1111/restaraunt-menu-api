module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: {type: DataTypes.STRING, unique: true, allowsNull: false},
        email: DataTypes.STRING,
        password: DataTypes.STRING
    });
    return User;
};