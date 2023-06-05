const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('restaurant', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    longitude: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    preparationTime: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    contactNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    zipCode: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    outletLocation: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    licenceNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    franchiseCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    pushNotificationStatus: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    appNotificationStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    mailNotificationStatus: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    restaurantStatusId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modifiedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ModifiedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    
  }, {
    sequelize,
    tableName: 'restaurant',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      }
    ]
  });
};
