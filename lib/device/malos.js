module.exports = {
  info : function(cb){
    var DriverInfo = Matrix.service.protobuf.malos.driver.build('matrix_io.malos.v1.driver');
    Matrix.service.zeromq.deviceInfo(function(response){
      var re = DriverInfo.MalosDriverInfo.decode(response);
      cb(re);
    });
  }
}
