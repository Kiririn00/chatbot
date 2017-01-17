/**
 * Created by Varit on 10/24/16.
 */

module.exports = {

  attributes: {
    label_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
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
