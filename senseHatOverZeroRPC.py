import zerorpc
from sense_hat import SenseHat
sense = SenseHat()

sense.set_imu_config(True, True, True)

class api(obecjt):

  def __getattr__(self, attr):
    if attr == 'ping':
      return 'pong'
    else
      if hasattr(sense, attr):
        def wrapper(*args, **kw):
            # print('called with %r and %r' % (args, kw))
            return getattr(sense, attr)(*args, **kw)
        return wrapper
      else:
        return None

s = zerorpc.Server(api())
s.bind("tcp://0.0.0.0:4242")
s.run()
