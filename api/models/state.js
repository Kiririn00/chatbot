/**
 * Created by Varit on 3/8/17.
 */
module.exports = {

  attributes: {
    state_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    state_name:{
      type: 'string',
      size: 500
    }
  }
};

