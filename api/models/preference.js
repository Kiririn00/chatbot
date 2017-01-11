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
    preference_name:{
      type: 'string',
      size: 100
    },
    preference_score: {
      type: 'integer',
      size: 100
    },
    preference_value:{
      type: 'integer',
      size: 100
    }
  }
};
