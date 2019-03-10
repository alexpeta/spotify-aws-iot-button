const AWS = require("aws-sdk");
const moment = require("moment");
const constants = require("../Utils/Constants");

AWS.config.update({ region: "us-west-2" });

var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

function upsertTokenAsync(type, token, expiresIn) {
  return new Promise(function(resolve, reject) {
    var params = {
      TableName: constants.TOKEN_TABLE_NAME,
      Item: {
        type: { S: type },
        token: { S: token },
        lastUpdated: { S: moment().format("MM/DD/YY HH:MM:SS") },
        expiresIn: { N: expiresIn.toString() },
        expiresAt: {
          S: moment()
            .add(expiresIn, "seconds")
            .format("MM/DD/YY HH:MM:SS")
        }
      }
    };

    ddb.putItem(params, function(err, data) {
      if (err) {
        console.log("Error when calling AWS dynamo to upsert ", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function getAsync(type) {
  var params = {
    TableName: constants.TOKEN_TABLE_NAME,
    Key: {
      type: { S: type }
    }
  };

  return new Promise(function(resolve, reject) {
    ddb.getItem(params, function(err, data) {
      if (err) {
        console.log("[getAsync][error]: " + err);
        reject(err);
      } else {
        if (!data) {
          resolve(null);
        } else {
          resolve(data.Item);
        }
      }
    });
  });
}

module.exports = {
  upsertTokenAsync: upsertTokenAsync,
  getAsync: getAsync
};
