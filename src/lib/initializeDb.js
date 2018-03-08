import mongoose from 'mongoose';

export default function ({ dbAddress }, cb) {
  mongoose.Promise = global.Promise;
  mongoose.connect(dbAddress);
  mongoose.connection.on('error', error => console.log(error));
  mongoose.connection.once('open', () => console.log(`connected to database at ${dbAddress}`));

  return cb();
}
