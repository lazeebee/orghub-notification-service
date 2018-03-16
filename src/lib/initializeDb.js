import mongoose from 'mongoose';

export default function ({ dbAddress }, cb) {
  if (process.env.NODE_ENV !== 'test') {
    mongoose.Promise = global.Promise;
    mongoose.connect(dbAddress);
    mongoose.connection.on('error', error => console.log(error));
    mongoose.connection.once('open', () => console.log('connected to database at mlab.com'));
  }

  return cb();
}
