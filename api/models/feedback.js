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
    label_id: {
      type: 'integer'
    }
  }

};
