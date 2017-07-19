var protobuf = require('matrix-protos');

var toExport = protobuf.matrix_io;
/*
toExport.build = {
  driver = toExport.lookup('matrix_io.malos.v1.driver')

  driverConfig: toExport.lookup('matrix_io.malos.v1.driver.DriverConfig',
  io = root.lookup('matrix_io.malos.v1.io.EverloopImage',
    +var LedValueProto = root.lookup('matrix_io.malos.v1.io.LedValue')
      +var WakeWordParamsProto = root.lookup('matrix_io.malos.v1.io.WakeWordParams')
}*/
module.exports = toExport;