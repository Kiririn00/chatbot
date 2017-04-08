/**
 * Created by Varit on 3/17/17.
 */

module.exports = {

  attributes: {
    feedback_id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: 'integer',
      size: 100
    },
    spot_id: {
      type: 'integer',
      size: 100
    },
    score:{
      type: 'integer',
      size: 100
    }
  }

};
