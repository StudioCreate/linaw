# LInAW

Living In A Web

> At this state the project is mainly a prototype. 

a web technology based controller for my living room.

Planned features

* Remote for TV
  * currently webOS (LG smart TV)
* Remote for light
  * currently Phillips hue lights
* Remote for audio
  * currently Sonos speakers
* modules for anything that has an API
* Presets
* Schedules
* Moods

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

An example for schedules could be

* Saturday
  * morning mode at 9:00 AM
  * weekend playlist at 10:00 AM
  * dinner mode at 8:00 PM
  * night mode at 1:00 AM
* Workday
  * morning mode at 7:30 AM
  * shower mode at 8:00 AM (controls bathroom sound and lights)
  * turn lights off when leaving the house (mobile client disconnects from wifi)
  * turn lights back on when entering house (mobile client connects to wifi)
  * dinner mode at 7:30 PM
  * relax mode at 8:30 PM
  * night mode at 10:00 PM

An example for Moods could be

* Moonlight
  * night mode is lighter on full moon etc.
* Weather
  * cold days have warmer light
  * rainy days have more energizing light
  * play night sounds to imitate the weather
* organic
  * light that feels organic
  * combines moods and modes to imitate the nature


The above listed features are just ideas that came up while brainstorming. 
All features should be easy to implement since services or APIs already exist in a more or less usable manner.


This app can be installed on any device that supports node.js.
Adding a real hardware will add special features like turning the TV on (due to missing communication not available).
A custom signal that can be controlled by thre client should be able to easily add this feature.

The client is rendered with React components and can be accesed from any device connected over WIFI.
A remote connction could be created either via VPN or by adding an API.

I have started making single apps for the features and will add them once I feel comfortable with the device communication.

The first step (controlling my TV) was very simple and gave me a good idea about the architecture for this app. 
The choice of using React.js is mainly comfort but I also think it fits the need of my frontend very well. 

I decided to make this a themeable but still mostly inline style based app. This asures the stability of the layout while allowing to change colors, fonts or other small things that people might want to change.