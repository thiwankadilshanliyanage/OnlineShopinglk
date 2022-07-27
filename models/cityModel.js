module.exports = (sequelize, DataTypes) =>{
    const City = sequelize.define("city",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return City
}