1. Installation

2. IOS setup 

3. Android Setup

4. How to use this package, what you can pass in each function



# 1. Installation
Assuming npm and node are both installed (If not please follow the instructions at https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/ )
  
Run: npm install react-native-health-layer --save
Run: react-native link react-native-health-layer

# 2. IOS Setup
Assuming a continuation from the installation step

Run: cd ./ios && pod install 

Update ./ios/<Project Name>/info.plist in your React Native project with these lines 
<key>NSHealthShareUsageDescription</key> 
<string>Read and understand health data.</string> <key>NSHealthUpdateUsageDescription</key> 
<string>Share workout data with other apps.</string>

Open up the project’s workspace file in xcode and go to the Capabilities section and enable “HealthKit” 

IOS stores all the data locally on the device so opening up the permissions will allow for the software to retrieve it.

# 3. Android Setup
Need the following SDKs to be installed: 
Android Support Repository 
Android Support Library 
Google Play services 
Google Repository 
Google Play APK Expansion Library
Android Studio
Due to Google storing the fitness data online and attached to a user rather than device, OAuth tokens need to be set up.

Full instructions here: https://developers.google.com/fit/android/get-api-key

If Mac/Linux run: keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android 
<br>
If windows run: keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android

You should see something like this:
Alias name: <alias_name>
Creation date: Feb 02, 2013
Entry type: PrivateKeyEntry
Certificate chain length: 1
Certificate[1]:
Owner: CN=Android Debug, O=Android, C=US
Issuer: CN=Android Debug, O=Android, C=US
Serial number: 4cc9b300
Valid from: Mon Feb 02 08:01:04 UTC 2013 until: Mon Feb 02 18:05:04 PST 2033
Certificate fingerprints:
    MD5:  AE:9F:95:D0:A6:86:89:BC:A8:70:BA:34:FF:6B:AC:F9
    SHA1: BB:0D:AC:74:D3:21:E1:43:67:71:9B:62:90:AF:A1:66:6E:44:5D:75
    Signature algorithm name: SHA1withRSA
    Version: 3

- Head to Google API console (https://console.developers.google.com/flows/enableapi?apiid=fitness) 
- Select or create a new project 
- Enable Fitness API 
- Click “Go to Credentials”
- Click “New Credentials” and select “OAuth Client ID”
Under “Application Type” select “Android”
In the open dialog enter your SHA-1 and package name. Will look like 
BB:0D:AC:74:D3:21:E1:43:67:71:9B:62:91:AF:A1:66:6E:44:5D:75
com.example.android.fit-example
- Click “Create”


Back in the codebase, open up MainApplication.java in <Projectname>/android/app/src/main/java/com/<projectname>/ 
and append import com.reactnative.googlefit.GoogleFitPackage; to the top of the file

Add in android/settings.gradle:
include ':react-native-google-fit' 
project(':react-native-google-fit').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-google-fit/android')
Add in android/app/build.gradle:
compile project(':react-native-google-fit')

Add in android/app/src/main/AndroidManifest.xml:
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACTIVITY_RECOGNITION" />

# 4. How to use this package
This package contains 7 functions

Isostring looks like: 2011-10-05T14:48:00.000Z

*Connect()* which takes in no input parameters and will authorize & ask for permissions 

*getHeartRate()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    date: 2020-08-10,
    value: 84}
    ]} 
It takes in a Json input of {startDate: isoString, endDate: isoString} to filter the dates

*getBloodPressure()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    bloodPRessureSystolicValue:100, 
    bloodPressureDiastolicValue: 70, 
    startDate: isoString, 
    endDate:isoString}
    ]} 
Units returned will be in “mmhg” 
It takes in a Json input of {startDate: isoString, endDate: isoString} to filter the dates

*getStepCount()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    date:isoString,
    value:85}
    ]} 
It takes in a Json input of {startDate: isoString, endDate: isoString} to filter the dates



*getHeight()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    value: 174
    }]}
It takes in a Json input of {startDate: isoString, endDate: isoString, unit: (cm or inch)} to filter the dates
Default is in “cm”


*getWeight()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    value: 80}]
    }
It takes in a Json input of {startDate: isoString, endDate: isoString, unit: (kg or pound)} to filter the dates
Default is in “kg”


*getSleepData()* will return a promise which will either contain an error or a json in the format of 
{“source”: [{
    value: INBED, 
    startDate: isoString,
    endDate: isoString},
    {value: ASLEEP, 
    startDate: isoString, 
    endDate: isoString}]
    }
It takes in a Json input of {startDate: isoString, endDate: isoString, } to filter the dates
