This document explains the IOT app that uses WebRTC and Sockets for
real-time streaming of random numbers from an IOT Interface to a remote
client.

Links: 
-------

[*The Simulated IOT Interface*](http://iot-apps.herokuapp.com)

[*The Remote Client*](http://iot-apps.herokuapp.com/remote)

Note: Hosted on free tier of Heroku Cloud Platform.

Usage:
------
Please follow this flow:
1.  Open IOT Interface
2.  Open Remote Client(s) from the link in the page or entering URL.
3.  Press 'Start' to start streaming
4.  When done, press 'Stop' to stop streaming

Part - 1:
---------

### Requirement:

To create or simulate an IOT device interface with a trigger to start
streaming of random numbers to a server.

### Approach:

I used regular HTML and JavaScript to build a web page. Also used
Bootstrap and jQuery for easier styling and DOM manipulation.

Another important thing that this page does is keep checking for remote
peer connections. This is important in WebRTC as the only obstacle is
finding peers. A WebSocket connection is established between the server
and the client (IOT interface) and any new Remote Client connections are
shared. This information is stored in an array and is also displayed.

### Third Party Libraries:

1.  Socket IO - for handling Sockets connections

2.  PeerJS - for handling and sending data to WebRTC peers

3.  jQuery - DOM Manipulation

4.  Bootstrap - CSS styling

Part - 2:
---------

### Requirement:

Creating a server that accepts the random number stream from the IOT
interface and passing it down to the Remote Client.

### Approach:

As I used WebRTC, the server is only used for proper WebRTC peers
handling. I chose **Node JS** as a server for it’s excellent support for
sockets and real-time communications.

The following are done by the server:

1.  Initiating Socket Connection as soon as an IOT interface connects.

2.  Initiating Socket Connection with Remote Clients as they connect.

3.  Noting down the Remote Client WebRTC identity.

4.  Sending this identity over sockets to IOT Interface.

5.  Notifying of Remote Client ‘disconnections’ to the IOT device.

6.  Also initiating a WebRTC server to handle all the connections

### Third Party Libraries:

1.  ExpressJS - for handling all the basic routing stuff

2.  Socket IO - for handling sockets at client

3.  PeerJS-server - for handling PeerJS connections and identity generation

Part - 3:
---------

### Requirement:

Creating an interface for Remote Client to plot all the data streamed in
real-time from the IOT device.

### Approach:

This interface had to receive the data from the IOT device and plot a
graph.

The data is collected as a peer though WebRTC. This collected data is
then plotted on a graph.

### Third Party Libraries:

1.  SmoothieCharts - for real-time plotting of a TimeSeries graph

2.  PeerJS - for receiving data from IOT device in real-time

3.  jQuery and Bootstrap - DOM manipulations and styling


