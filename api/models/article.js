/**
 * Created by Varit on 1/17/17.
 */
module.exports = {

  attributes: {
    article_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    user_id:{
      type: 'integer',
      size: 100
    },
    label_id:{
      type: 'integer',
      size: 100
    },
    spot_id:{
      type: 'integer',
      size: 100
    }

  }
};
