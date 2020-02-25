'use strict';

const path = require('path')
const debug = require('debug')('snappy:ros:service-client')

const ros_server = require(path.join(__dirname, '..', 'ros_server.js'))

module.exports = function(RED) {
  var ros_service_client = function(config) {
    RED.nodes.createNode(this, config)
    var node = this

    node.status({
      fill: 'yellow',
      shape: 'ring',
      text: 'connecting to ros master..'
    })

    node.on('connected to ros', function() {
      node.status({
        fill: 'green',
        shape: 'dot',
        text: 'connected'
      })
    })

    node.on('input', function(msg) {
       var msgType = rosnodejs.require(config.typepackage)
       	.msg[config.typename]
      
       var x = new msgType()
       x = msg.payload
       
       node.pub.publish(x)
    })

     var sub_callback = function(msg) {
       var o = JSON.parse(JSON.stringify(msg))
    
       node.send({
         payload: o
       })
     }

    node.on('close', function(done) {
       debug('Unsubscribing node on topic :', config.topicname)
       if (node.ros) {
         node.ros.unsubscribe(config.topicname)
           .then(function() {
             debug('unsubscribed')
             done()
           })
       } else {
      done()
     }
    })

    ros_server(RED, node)
      .then(function(nodeHandle) {
        node.ros = nodeHandle
        node.pub = node.ros.advertiseService(config.topicname, config.typepackage + '/' + config.typename)
      })
      .catch(function(e) {
        debug('Er', e)
      })
  }
  RED.nodes.registerType("ros-service-client", ros_service_client)
}



}