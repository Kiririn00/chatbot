/**
 * Created by Varit on 1/19/17.
 */

module.exports = {

  attributes: {

    spot_id:{
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    spot_name:{
      type: 'varchar',
      size: 100
    }

  }

};
