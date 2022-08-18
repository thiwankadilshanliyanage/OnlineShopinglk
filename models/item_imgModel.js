module.exports = (sequelize, DataTypes) =>{
    const ItemImage = sequelize.define("itemImg",{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        item_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
            get(){
                const image = this.getDataValue('img')
                var imageArray = []
                if(image==""){
                    return null
                }else{
                    for(var len=0;len<image?.split(',').length;len++){
                        imageArray[len] = 'http://localhost:8080/'+image.split(',')[len]
                    }
                }
                return imageArray
            }
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