var debug = debugLog('accelerometer')

module.exports = {
  commands: ['accelerometer'],
  // init runs automatically, wait for app to request component creation
  init: function () {},
  read: function(buffer) {
    var a = new Matrix.service.protobuf.malos.v1.driver.Imu.decode(buffer)
    return { x: a.accel_x, y: a.accel_y, z: a.accel_z };
  },
  prepare: function(options, cb) {
    if (_.isFunction(options)) {
      cb = options;
      options = {};
    }
    if (_.isUndefined(options)) {
      options = {};
    }

    if (!_.has(options, 'refresh')) {
      options.refresh = 1.0;
    } else if (parseFloat(options.refresh) === options.refresh) {
      options.refresh = options.refresh / 1000
    }
    if (!_.has(options, 'timeout')) {
      options.timeout = 15.0;
    } else if (parseFloat(options.timeout) === options.timeout) {
      options.timeout = options.timeout / 1000
    }

    // map options to protobuf config
    var driverConfigProto = new Matrix.service.protobuf.malos.v1.driver.DriverConfig
      // 2 seconds between updates.
    driverConfigProto.delay_between_updates = options.refresh;
    // Stop sending updates 6 seconds after pings.
    driverConfigProto.timeout_after_last_ping = options.timeout;
    debug('gyro start')
    cb(driverConfigProto.encode().finish());
  },
  ping: function() {
    if (_.has(Matrix.components, 'accelerometer')) {
      Matrix.components.accelerometer.ping();
    } else {
      console.log('Accelerometer available, not activated.');
    }
  }
}