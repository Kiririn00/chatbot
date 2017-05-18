/**
 * Created by ASAWAVETVUTT VARIT on 2016/07/13.
 * room.js
 * this is room model
 */
module.exports = {
  attributes: {
    room_id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    status: {
      type: 'string',
      size: 100
    }
  }



};
