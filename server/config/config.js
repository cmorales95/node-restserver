/**
 * PORT
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * ENVIRONMENT
 */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Token expired time 
 */

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

/**
 * Authentication seed 
 */

process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";


/**
 * DATABASE
 */

let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else { // PROD
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

process.env.CLIENT_ID = process.env.CLIENT_ID || '363147606418-jt8sh08epcqk0l72hvmlhlrpcce4vsc4.apps.googleusercontent.com';

/**
 * 
  CREATE VAR ENVIRONMENS
  heroku config - view the var env
  heroku config:set SEED ='value' - creating the var in heroku
 * 
 */


