/**
 * Created by Varit on 10/24/16.
 */

module.exports = {

  attributes: {
    id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    spot_name:{
      type: 'string',
      size: 100
    },
    temple: {
      type: 'integer',
      size: 10
    },
    natural:{
      type: 'integer',
      size: 10
    },
    history:{
      type: 'integer',
      size: 10
    }
  }
};
