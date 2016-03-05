# LINAW

Living IN A Web

> At this state the project is mainly a prototype. 

a web technology based controller for my living room.

Planned features

* Remote for webOS (LG smart TV)
* Remote for Phillips hue lights
* Remote for Sonos speakers
* Presets
* Schedules
* 



An example for presets could be

* Movie mode
  * dim lights
  * change sound settings
  * play movie after 1 minute
* Dinner mode
  * dim lights
  * turn down volume
  * play dinner playlist
* Morning mode
  * slowly increase brightness
  * play an alarm
  * start the morning playlist after 3 minutes
  * switch TV to the news channel

This app can be installed on any device that supports node.js.
The client is rendered with React components and can be accesed from any device connected over WIFI.
A remote connction could be created either via VPN or by adding an API.

I have started making single apps for the features and will add them once I feel comfortable with the device communication.

The first step (controlling my TV) was very simple and gave me a good idea about the architecture for this app. 
The choice of using React.js is mainly comfort but I also think it fits the need of my frontend very well. 

I decided to make this a themeable but still mostly inline style based app. This asures the stability of the layout while allowing to change colors, fonts or other small things that people might want to change.