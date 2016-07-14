/**
 * Created by ASAWAVETVUTT VARIT on 2016/06/23.
 */
module.exports = {

  attributes: {
    id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    text: {
      type: 'string',
      size: 300
    },
    bot:{
      type: 'string',
      size: 300
    },
    room_id:{
      type: 'integer'
    }
  }
};
