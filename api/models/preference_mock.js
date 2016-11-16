/**
 * Created by Varit on 11/16/16.
 */

module.exports = {

  attributes: {
    id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    spot_name:{
      type: 'string',
      size: 100
    },
    temple: {
      type: 'integer',
      size: 10
    },
    natural:{
      type: 'integer',
      size: 10
    },
    history:{
      type: 'integer',
      size: 10
    },
    lake:{
      type: 'integer',
      size: 10
    },
    castle:{
      type: 'integer',
      size: 10
    },
    museum:{
      type: 'integer',
      size: 10
    },
    market:{
      type: 'integer',
      size: 10
    },
    mountain:{
      type: 'integer',
      size: 10
    },
    train:{
      type: 'integer',
      size: 10
    },
    seichi:{
      type: 'integer',
      size: 10
    }
  }
};
