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
      // do the req
      // advertiseService with (req, res)
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
      // do the resp  
      // node.on('input')
      // callback using res
      // assing res 
      // resolve the promise 
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
// module.exports = function(RED) {
//   var ros_service_client = function(config) {
//     RED.nodes.createNode(this, config)
//     var node = this

//     node.status({
//       fill: 'yellow',
//       shape: 'ring',
//       text: 'connecting to ros master..'
//     })

//     node.on('connected to ros', function() {
//       node.status({
//         fill: 'green',
//         shape: 'dot',
//         text: 'connected'
//       })
//     })

//   //  node.on('input', function(msg) {
//   //     var msgType = rosnodejs.require(config.typepackage)
//   //     	.msg[config.typename]
      
//   //     var x = new msgType()
//   //     x = msg.payload
       
//   //     node.service.publish(x)
       
//   //  })

//      var req_rep = (req, resp) => {
//        console.log('DEBUG:  got req  ' + req)
//        node.send(resp)
//        // send response set by the input 

       

//      }

//     node.on('close', function(done) {
//        debug('Unsubscribing node on topic :', config.topicname)
//        if (node.ros) {
//          node.ros.unsubscribe(config.topicname)
//            .then(function() {
//              debug('unsubscribed')
//              done()
//            })
//        } else {
//       done()
//      }
//     })

//     ros_server(RED, node)
//       .then(function(nodeHandle) {
//         node.ros = nodeHandle
//         node.service = node.ros.advertiseService(config.topicname, config.typepackage + '/' + config.typename, rep_req)
//       })
//       .catch(function(e) {
//         debug('Er', e)
//       })
//   }
//   RED.nodes.registerType("ros-service-client", ros_service_client)
// }
