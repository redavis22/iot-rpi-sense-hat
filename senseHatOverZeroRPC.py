import zerorpc
import json
from sense_hat import SenseHat
sense = SenseHat()

sense.set_imu_config(True, True, True)

class api(object):

  def ping(self):
    return 'pong'

  def get_orientation_radians(self):
    return sense.get_orientation_radians()

  def get_accelerometer_raw(self):
    return sense.get_accelerometer_raw()

  def set_pixels(self, pixel_list_stringified_json):
    return sense.set_pixels(json.loads(pixel_list_stringified_json))

s = zerorpc.Server(api())
s.bind("tcp://0.0.0.0:4242")
s.run()
