module.exports = (sequelize, DataTypes) =>{
    const Condition = sequelize.define("condition",{
        id: {
            type: DataTypes.INTEGER,
            primaryKey:true,
            allowNull: false
        },
        condition: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { 
        timestamps: false 
    })

    return Condition
}