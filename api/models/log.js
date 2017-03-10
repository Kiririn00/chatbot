/**
 * Created by Varit on 2/23/17.
 */
module.exports = {

  attributes: {
    log_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id:{
      type: 'integer',
      size: 100
    },
    state_id:{
      type: 'integer',
      size: 100
    },
    component_id: {
      type: 'integer',
      size: 100
    },
    message:{
      type: 'string',
      size: 500
    }
  }
};
