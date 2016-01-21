# aws-iot-rpi-sense-hat

This is a demo using the AWS IoT Service.
(Awesome service by the way !).

# pre-requisites
Based off of the Jessie build for raspberry.
Sense Hat is already installed.
Using Raspberry Pi 2

First make sure everything is up-to-date:

	sudo apt-get update
	sudo apt-get upgrade
	
Second, install zerorpc (requires python-dev)

	sudo apt-get install python-dev
	sudo pip install zerorpc
	
Third, install node on your Pi2:

	wget https://nodejs.org/dist/v4.2.5/node-v4.2.5-linux-armv7l.tar.gz
	tar -xvf node-v4.2.5-linux-armv7l.tar.gz
	cd node-v4.2.5-linux-armv7l
	sudo cp -R * /usr/local/

# configuration
The certificates required to communicate to the AWS IoT Service are referenced in the config.json file.
{
  keyPath: '/boot/aws/certs/private.pem',
  certPath: '/boot/aws/certs/cert.pem',
  caPath: '/boot/aws/certs/root-CA.pem',
  region: 'us-east-1',
  reconnectPeriod: 5000
}

see [/boot note](#bootnotes) about /boot
	
# optimizations

## wifi - hw
If you are doing your demo over wifi, with the standard EDUP wifi dongle, here are some improvements you can make to the wifi settings

	sudo sh -c 'echo "options 8192cu rtw_power_mgnt=0 rtw_enusbss=0" > /etc/modprobe.d/8192cu.conf'
	
## wifi - sw
To enable managing different wifi networks while on the go, without having access to a keyboard/mouse/screen to edit the files on the Pi itself, I have successfully done the following:

* move the /etc/wpa_supplicant/wpa_supplicant.conf file to /boot/aws/wpa_supplicant.conf
* edit the /etc/network/interfaces file to reflect that change

## <a name="bootnotes"></a> notes on /boot
The /boot folder is accessible from MAC or PC by putting the PIs SD card on your computer, and thus allows you to easily change it's wifi configuration to whatever network you want.
