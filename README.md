# aws-iot-rpi-sense-hat

This is a demo using the AWS IoT Service.
(Awesome service by the way !).

# pre-requisites
* Jessie build from Raspberry website
* Raspberry Pi 2
* Sense Hat shield

First make sure everything is up-to-date:

	# sudo apt-get update
	# sudo apt-get upgrade
	
Second, install zerorpc (requires python-dev)

	# sudo apt-get install python-dev
	# sudo apt-get install libzmq3-dev
	# sudo pip install zerorpc
	
Third, install node on your Pi2:

	# wget https://nodejs.org/dist/v4.2.5/node-v4.2.5-linux-armv7l.tar.gz
	# tar -xvf node-v4.2.5-linux-armv7l.tar.gz
	# cd node-v4.2.5-linux-armv7l
	# sudo cp -R * /usr/local/
	
Fourth, use the raspberry configuration tool, to change the hostname to match whatevery thingName you have set at AWS level:

	# sudo raspi-config
	
# installation

	# git clone https://github.com/teuteuguy/aws-iot-rpi-sense-hat
	# cd aws-iot-rpi-sense-hat
	# node index.js

# configuration
The certificates required to communicate to the AWS IoT Service are referenced in the config.json file.

```
{
  keyPath: '/boot/aws/certs/private.pem',
  certPath: '/boot/aws/certs/cert.pem',
  caPath: '/boot/aws/certs/root-CA.pem',
  region: 'us-east-1',
  reconnectPeriod: 5000
}
```

see [note](#bootnotes) about /boot

# what does the demo do?
The code uses the Sense Hat to:

* gather acceleration and orientation data
* display things on the LED matrix

Once a data point of acceleration/orientation is measured, it is published to '*hostname*/sensors' topic.

You can write to the desired thingShadow the following value:

```
{
	desired: {
		tictactoe: "         "
	}
}
```

Where tictactoe is a 9 character string, representing the 9 potential places you can display an X, an O, or nothing.

```
"         " => Displays:   |   | 
                         ---------
                           |   |  
                         ---------
                           |   | 

"X O XOO X" => Displays: X |   | O
                         ---------
                           | X | O
                         ---------
                         O |   | X
```
Note that the X and O are displayed with green and blue, where red is used for incorrect character.

### following needs to be setup separately at AWS level
#### earthquate demo
A rule in the AWS Iot Service, monitors '*hostname*/sensors' and measures the magnitude of the acceleration: abs(x) + abs(y) + abs(z).

If it exceeds a threshold (I've set it to 14), (you need to shake it hard), it triggers an SNS notification.

(WIP. The trigger could display a warning message on the Pi's display).

#### tictactoe
you need to code your tictactoe game algorithm somewhere and use the AWS Iot API to update the thingShadow to reflect the change.
For my demo, I use the Amazon Echo, to play tictactoe against Alexa!

# optimizations

## wifi - hw
If you are doing your demo over wifi, with the standard EDUP wifi dongle, here are some improvements you can make to the wifi settings

	# sudo sh -c 'echo "options 8192cu rtw_power_mgnt=0 rtw_enusbss=0" > /etc/modprobe.d/8192cu.conf'
	
## wifi - sw
To enable managing different wifi networks while on the go, without having access to a keyboard/mouse/screen to edit the files on the Pi itself, I have successfully done the following:

Copy the wpa_supplicant file to the /boot partition ([note](#bootnotes)):

	# cp /etc/wpa_supplicant/wpa_supplicant.conf /boot/aws/wpa_supplicant.conf

Edit the file to configure your chosen wifi network:

	# sudo nano /boot/aws/wpa_supplicant.conf

Add/Edit the file to add the following (note, you can add numerous networks, home, office, on-the-go by simply adding a section for each network):

```
network={
	ssid="your ssid"
	psk="your password"
}
```

Finally, edit the interfaces file to change the configuraiton from /etc/wpa_supplicant/wpa_supplicant.conf to /boot/aws/wpa_supplicant.conf:

	# sudo nano /etc/network/interfaces


# <a name="bootnotes"></a> notes on /boot
The /boot folder is accessible from MAC or PC by putting the PIs SD card on your computer, and thus allows you to easily change it's wifi configuration to whatever network you want.
