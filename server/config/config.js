/**
 * PORT
 */

process.env.PORT = process.env.PORT || 3000;

/**
 * ENVIRONMENT
 */

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * DATABASE
 */

let urlDB;
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/cafe";
} else {
  urlDB =
    "mongodb+srv://cmorales:hLYHTBy7xb7OL672@cluster0.j46ue.mongodb.net/cafe";
}

process.env.urlDB = urlDB;
