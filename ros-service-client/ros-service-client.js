'use strict';

const path = require('path')
const debug = require('debug')('snappy:ros:service-client')

const ros_server = require(path.join(__dirname, '..', 'ros_server.js'))


module.exports = function(RED)
{
 var = ros_service_client = function(config){
    RED.nodes.createNode(this, config)
    var node = this

    if(node === 'rep'){
      node.ros = nodeHandle
    }

    var req_rep = (req, rep) =>{
      console.log('got req', req)
      node.send(req)
    } 

    ros_server(RED, node)
      .then(function(nodeHandle) {
        node.ros = nodeHandle
        node.sub = node.ros.advertiseService(config.topicname, config.typepackage + '/' + config.typename,  req_rep)
      })
      .catch(function(e) {
        debug('Er', e)
      })
  }
  RED.nodes.registerType("ros-service-client", ros-service-client)
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
