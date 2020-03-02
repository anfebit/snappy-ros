'use strict';

const path = require('path')
const debug = require('debug')('snappy:ros:service-client')

const ros_server = require(path.join(__dirname, '..', 'ros_server.js'))


module.exports = function(RED) {
  var ros_service_client = function(config) {
    RED.nodes.createNode(this, config)
    var node = this

    const req_res = (req, res) =>{
      console.log('got req', req)
      return new Promise((resolve, reject) => node.send({resolve, reject, req, res}));
    }

    console.log('Node set as  :  ' + config.intype )
  
    if(config.intype === 'req'){
      const rosPromise = ros_server(RED, node)
      console.log("promise   ", rosPromise)
      rosPromise.then(nodeHandle =>{
        node.ros = nodeHandle
<<<<<<< HEAD
        node.service = node.ros.advertiseService(config.topicname, 'std_srvs/Empty', req_res)
=======
        console.log('topic ' + config.topicname)
        console.log('data type   ' + config.typepackage + '/' + config.typename)
        node.service = node.ros.advertiseService(config.topicname, config.typepackage + '/' + config.typename, req_res)
>>>>>>> 2c58cccfa46a0b33eaec654fae78b9f47da2704c
        console.log("node.service   ", node.service)
      })
      rosPromise.catch(e => {
         debug('Er', e)
      })
  }
    else{
          node.on('input', function(msg) {
          console.log(msg);
          msg.payload = res
          msg.res.str = JSON.stringify(msg.payload);
          msg.resolve();
          });
          }
    }
    RED.nodes.registerType("ros-service-client", ros_service_client)
}
<<<<<<< HEAD
=======

>>>>>>> 2c58cccfa46a0b33eaec654fae78b9f47da2704c
