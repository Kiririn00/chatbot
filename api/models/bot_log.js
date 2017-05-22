/**
 * Created by Varit on 5/18/17.
 */

module.exports = {

  attributes: {
    bot_log_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    label_id:{
      type: 'integer'
    },
    user_id:{
      type: 'integer'
    },
    state_id:{
      type: 'integer'
    },
    feedback_id:{
      type: 'integer'
    },
    label_score:{
      type: 'integer',
      size: 200
    }
  }

};
