module.exports = (sequelize, DataTypes) =>{
    const Item = sequelize.define("item",{
       id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        seller_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        condition_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        cities_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
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

    return Item
}