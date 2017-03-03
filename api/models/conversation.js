/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/27.
 */

module.exports = {

  attributes: {
    conversation_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    question: {
      type: 'string',
      size: 100
    },
    answer:{
      type: 'string',
      size: 500
    },
    component_id:{
      type: 'integer'
    }
  }
};
