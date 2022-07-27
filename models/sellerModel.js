module.exports = (sequelize, DataTypes) =>{
    const Seller = sequelize.define("seller",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            
            
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cities_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return Seller
}