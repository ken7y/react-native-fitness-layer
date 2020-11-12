import {
  Platform
} from 'react-native';
import AppleHealthKit from 'rn-apple-healthkit';
import GoogleFit, {
  Scopes
} from 'react-native-google-fit'

const optionsGooglePermissions = {
  scopes: [
    Scopes.FITNESS_ACTIVITY_READ,
    Scopes.FITNESS_LOCATION_READ,
    Scopes.FITNESS_BODY_READ,
    Scopes.FITNESS_NUTRITION_READ,
    Scopes.FITNESS_BLOOD_PRESSURE_READ,
    Scopes.FITNESS_BLOOD_GLUCOSE_READ,
    Scopes.FITNESS_OXYGEN_SATURATION_READ,
    Scopes.FITNESS_BODY_TEMPERATURE_READ,
    Scopes.FITNESS_REPRODUCTIVE_HEALTH_READ,
    Scopes.FITNESS_HEART_RATE_READ,
  ],
}

const optionsApplePermissions = {
  permissions: {
    read: [
      'Height',
      'Weight',
      'StepCount',
      'HeartRate',
      'BloodPressureDiastolic',
      'BloodPressureSystolic',
      'SleepAnalysis'
    ],
  },
};

export const connect = () => {
  switch (Platform.OS) {
    case 'ios':
      AppleHealthKit.initHealthKit(optionsApplePermissions, (err, results) => {
        if (err) {
          console.log('error initializing Healthkit: ', err);
          return;
        }
      });
      break;
    case 'android':
      GoogleFit.checkIsAuthorized().then(() => {
        if (!GoogleFit.isAuthorized) {
          GoogleFit.authorize(optionsGooglePermissions.scopes)
            .then(authResult => {
              if (!authResult.success) {
                console.log("AUTH_DENIED", authResult.message);
              }
            })
            .catch((error) => {
              console.log(error + "AUTH_ERROR");
            })
        }
      })
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
};

export const getHeartRate = async (inputOption) => 
new Promise((resolve, reject) => {
  switch (Platform.OS) {
    case 'ios':
      AppleHealthKit.getHeartRateSamples(inputOption, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        retHeartRate = {};
        retHeartRate["ios.heartrate"] = [];
        results.map(x=> {
          var date = x.endDate.split("T");
          retHeartRate["ios.heartrate"].push({"date": date[0], "value": x.value, "source": x.sourceId});
        });
        resolve(retHeartRate);
      });
      break;
    case 'android':
      GoogleFit.onAuthorize(() => {
          const options = {
            startDate: "2020-11-11T00:00:17.971Z", // required
            endDate: new Date().toISOString(), // required
          }
          const callback5 = ((error, response) => {
            console.log(error, response)
          });
          GoogleFit.getHeartRateSamples(options, callback5)
      });
      console.log("Android heartrate");
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});

export const getBloodPressure = async (inputOption) => 
new Promise((resolve, reject) =>  {
  switch (Platform.OS) {
    case 'ios':
      AppleHealthKit.getBloodPressureSamples(inputOption, (err, results) => {
        if (err) {
          return;
        }
        console.log("bloodpressure")
        retBloodPressure = {}; 
        retBloodPressure["ios.bloodpressure"] = [];
        results.map(x => {retBloodPressure["ios.bloodpressure"].push(
          { "bloodPressureSystolicValue":x.bloodPressureSystolicValue,
            "bloodPressureDiastolicValue" :x.bloodPressureDiastolicValue,
            "startDate": x.startDate,
            "endDate": x.endDate
          }
          );});
        console.log(retBloodPressure)
        resolve(retBloodPressure);
      });
      break;
    case 'android':
      GoogleFit.onAuthorize(() => {
        const options = {
          startDate: "2017-01-01T00:00:17.971Z", 
          endDate: new Date().toISOString(), 
        }
        const callback = ((error, response) => {
          if (error){
            console.log(error)
          }
          retBlood = {}; 
          retBlood["googlefit.bloodpressure"] = [];

          retBloodPressure = [];
            response.map(x => {retBlood["googlefit.bloodpressure"].push(
              { "bloodPressureSystolicValue":x.value,
                "bloodPressureDiastolicValue" :x.value2,
                "startDate": x.startDate,
                "endDate": x.endDate
              }
              )});
          resolve(retBlood);
        });
        
        GoogleFit.getBloodPressureSamples(options, callback);
      });
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});

export const getStepCount = (inputOption) => 
new Promise((resolve, reject) => {
  switch (Platform.OS) {
    case 'ios':
    let startDate = (new Date(2016, 10, 23)).toISOString(); // required
    let endDate = (new Date(2020, 10, 23)).toISOString(); // required
    let options = {
      startDate,
      endDate,
      ascending: false,
      limit: 10,
      period: 1440,
      unit: "Step(s)",
      includeManuallyAdded: true,
      };
      
      AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        retSteps = {}; 
        retSteps["ios.dailysteps"] = [];
        results.map(x=> {
          var date = x.endDate.split("T");
          retSteps["ios.dailysteps"].push({"date": date[0], "value": x.value});
        });
        resolve(retSteps);
      });
      break;
    case 'android':
      GoogleFit.onAuthorize(() => {
        const options = {
          startDate: "2020-09-01T00:00:17.971Z", 
          endDate: new Date().toISOString(), 
        };
      GoogleFit.getDailyStepCountSamples(options)
          .then((res) => {
              console.log("AndroidCodeNow")
              ret = {};
              res.map(x => {
                x["steps"].map(y=> {
                if (!ret[x["source"]]) {
                  ret[x["source"]] = []
                }
                  ret[x["source"]].push(y);
                });
              });
              // alert(JSON.stringify(ret))
              resolve(ret)
          })
          .catch((err) => {
              console.log(err)
          })

      });


      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});

function toFeet(n) {
  n = n *100;
  var realFeet = ((n*0.393700) / 12);
  var feet = Math.floor(realFeet);
  var inches = Math.round((realFeet - feet) * 12);
  return feet + "." + inches;
}

export const getHeight = (inputOption) => 
new Promise((resolve, reject) => {
  switch (Platform.OS) {
    case 'ios':
    
      AppleHealthKit.getHeightSamples(inputOption, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        retHeight = {}; 
        retHeight["ios.height"] = [];
        results.map(x=> {
          retHeight["ios.height"].push({"value": x.value});
        });
        resolve(retHeight);
      });
      break;
    case 'android':
      console.log("Android height");
      GoogleFit.onAuthorize(() => {
        const options = {
          startDate: "2020-09-01T00:00:17.971Z", 
          endDate: new Date().toISOString(), 
        };
 
        GoogleFit.getHeightSamples(options, (err, res) => {
                  console.log("AndroidCodeNow")
                  ret = {};
                  res.map(x => {
                    if (!ret[x["addedBy"]]) {
                      ret[x["addedBy"]] = []
                    }
                      if(options.unit == "inch"){
                        ret[x["addedBy"]].push({"value": toFeet(x["value"])});
                      } else{
                        ret[x["addedBy"]].push({"value": x["value"]});
                        
                      }
                  });
                  resolve(ret)
              });
      });
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});

export const getWeight = (inputOption) => 
new Promise((resolve, reject) => {
  switch (Platform.OS) {
    case 'ios':
      AppleHealthKit.getWeightSamples(inputOption, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        retWeight = {}; 
        retWeight["ios.weight"] = [];
        results.map(x=> {
          retWeight["ios.weight"].push({"value": x.value});
        });
        resolve(retWeight);
      });
      break;
    case 'android':
      console.log("Android weight");
      GoogleFit.onAuthorize(() => {
        const options = {
          startDate: "2020-09-01T00:00:17.971Z", 
          endDate: new Date().toISOString(), 
        };
 
        GoogleFit.getWeightSamples(options, (err, res) => {
                  console.log("AndroidCodeNow")
                  ret = {};
                  res.map(x => {
                    if (!ret[x["addedBy"]]) {
                      ret[x["addedBy"]] = []
                    }
                      if(options.unit == "inch"){
                        ret[x["addedBy"]].push({"value": toFeet(x["value"])});
                      } else{
                        ret[x["addedBy"]].push({"value": x["value"]});
                        
                      }
                  });
                  resolve(ret)
              });
      });
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});

export const getSleepData = (inputOption) => 
new Promise((resolve, reject) => {
  switch (Platform.OS) {
    case 'ios':
      AppleHealthKit.getSleepSamples(inputOption, (err, results) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Sleep")
        console.log(results);
        let retSleep = {}
        retSleep["ios.sleep"] = results;
        resolve(retSleep);
      });
      break;
    case 'android':
      GoogleFit.onAuthorize(() => {
        const options5 = {
          startDate: '2020-01-01T12:33:18.873Z', // required, timestamp or ISO8601 string
          endDate: new Date().toISOString(), 
        };
        console.log("Android Sleep auth'd");

        GoogleFit.getSleepData(options5, (err, res) => {
              if (err){
                resolve(err)
              }
                  console.log(res);
                  resolve(res)
              });
      });
      break;
    default:
      throw new Error('Invalid platform: ' + Platform.OS);
  }
});