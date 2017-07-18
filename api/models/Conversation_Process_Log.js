/**
 * Created by Varit on 7/18/17.
 */
module.exports = {

  attributes: {
    conversation_process_log_id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id: {
      type: 'integer'
    },
    log_id:{
      type: 'integer'
    },
    process_num:{
      type: 'integer'
    }
  }

};
