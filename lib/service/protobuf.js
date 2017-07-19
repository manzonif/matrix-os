var debug = debugLog('proto')
var protobuf = require('protobufjs');
const fs = require('fs')
const protosPath = __dirname + '/../../proto';
const version = 'v1';
// monkey patch protobuf to add enum strings
var decode = protobuf.Reflect.Message.Field.prototype.decode;
protobuf.Reflect.Message.Field.prototype.decode = function () {
  var value = decode.apply(this, arguments);
  if (protobuf.TYPES["enum"] === this.type) {
    var values = this.resolvedType.children;
    for (var i = 0; i < values.length; i++) {
      if (values[i].id == value) {
        return values[i].name;
      }
    }
    // add nested enums
  } else if (protobuf.TYPES['message'] === this.type) {
    _.each(this.resolvedType.children, function (c) {
      var parent = c.name;
      if (protobuf.TYPES["enum"] === c.type) {
        var values = c.resolvedType.children;
        for (var i = 0; i < values.length; i++) {
          if (values[i].id == value[parent]) {
            value[parent] = values[i].name;
          }
        }
      }
    })
  }
  return value;
}


var files = fs.readdirSync(protosPath + '/matrix_io');
_.each(files, function (division) {
  var versionPath = protosPath + '/matrix_io/' + division + '/' + version;
  if (fs.statSync(protosPath + '/matrix_io/' + division).isDirectory() && fs.statSync(versionPath).isDirectory()) {
    var ps = fs.readdirSync(versionPath);

    _.each(ps, function (protoFile) {
      if (protoFile.indexOf('.proto') > -1) {
        debug(division, ':', protoFile)
        // make sure we don't overwrite
        module.exports[division] = _.merge({}, module.exports[division]);
        // must build later
        module.exports[division][protoFile.slice(0, -6)] = protobuf.loadProtoFile({
          root: protosPath,
          file: 'matrix_io/' + division + '/' + version + '/' + protoFile
        });
      }
    })
  }
})
