var mongoUri = process.env.MONGOLAB_URI ||
  'mongodb://localhost/mydb';

module.exports = {
  db: {
    name: "db",
    defaultForType: "mongodb",
    connector: "mongodb",
    url: mongoUri
  }
};
