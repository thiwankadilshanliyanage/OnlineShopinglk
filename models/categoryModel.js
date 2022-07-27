module.exports = (sequelize, DataTypes) =>{
    const Category = sequelize.define("category",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return Category
}