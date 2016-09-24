module.exports = {

  attributes: {
    id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    spot_name: {
      type: 'string',
      size: 100
    },
    score:{
      type: 'integer',
      size: 100
    }
  }
};
