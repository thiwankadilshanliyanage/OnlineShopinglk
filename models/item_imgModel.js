module.exports = (sequelize, DataTypes) =>{
    const ItemImage = sequelize.define("itemImg",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        item_id: {
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

    return ItemImage
}