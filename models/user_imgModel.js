module.exports = (sequelize, DataTypes) =>{
    const UserImage = sequelize.define("user_img",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: false
        }     
    },
    { 
        timestamps: false 
    })

    return UserImage
}