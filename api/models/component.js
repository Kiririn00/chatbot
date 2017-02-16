/**
 * Created by Varit on 2/14/17.
 */

module.exports = {

  attributes: {
    component_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    component_name: {
      type: 'string',
      size: 100
    }
  }
};
