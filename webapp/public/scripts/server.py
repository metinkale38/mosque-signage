import http.server
import socketserver
from http import HTTPStatus
import os

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/on':
          os.system("sh /boot/www/scripts/turnon.sh")
          self.send_response(HTTPStatus.OK)
          self.end_headers()
          self.wfile.write(b'OK')
        elif self.path=='/off':
          os.system("sh /boot/www/scripts/turnoff.sh")
          self.send_response(HTTPStatus.OK)
          self.end_headers()
          self.wfile.write(b'OK')
        else:
          self.send_response(HTTPStatus.NOT_FOUND)
          self.end_headers()


httpd = socketserver.TCPServer(('', 8000), Handler)
httpd.serve_forever()

