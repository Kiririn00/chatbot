/**
 * Created by Varit on 1/17/17.
 */
module.exports = {

  attributes: {
    spot_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id:{
      type: 'integer',
      size: 100,
      unique: true
    },
    label_id:{
      type: 'integer',
      size: 100,
      unique: true
    },
    label_name:{
      type: 'string',
      size: 100
    },
    label_score: {
      type: 'integer',
      size: 100
    }

  }
};
