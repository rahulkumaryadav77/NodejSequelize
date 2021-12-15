module.exports = (sequelize, DataTypes)=> {
    const User = sequelize.define("User",{

        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },

        userName: {
            type:DataTypes.STRING,
            allowNull: false,
            
        },

        password: {
            type:DataTypes.STRING,
            allowNull: false
            
        },

        totalOrder: {
            type:DataTypes.INTEGER,
            allowNull: false,
            
        },
        userEmail: {
            type:DataTypes.STRING,
            allowNull: false,
            unique: false 
        },
       
        userImage: {
            type:DataTypes.STRING,
            allowNull:false,

        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        last_logged_in: {
            type: DataTypes.DATE,

        }
        
    },{
        timestamps: false
    });
    
    return User;
};