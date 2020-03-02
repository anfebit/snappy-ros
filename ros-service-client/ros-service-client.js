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

    console.log('intype  ', config.intype)
   
   
    if(config.intype === 'req'){
      const rosPromise = ros_server(RED, node)
      console.log("promise   ", rosPromise)
      rosPromise.then(nodeHandle =>{
        node.ros = nodeHandle
        console.log('topic ' + config.topicname)
        console.log('data type   ' + config.typepackage + '/' + config.typename)
        node.service = node.ros.advertiseService(config.topicname, config.typepackage + '/' + config.typename, req_res)
        console.log("node.service   ", node.service)
      })
      rosPromise.catch(e => {
         debug('Er', e)
      })
  }
    else{
          node.on('input', function(msg) {
          msg.payload = res
          console.log('HERE IS THE Input   ', res)
          msg.res.str = JSON.stringify(msg.payload);
          msg.resolve();
          });
         }
    }
    RED.nodes.registerType("ros-service-client", ros_service_client)
}

