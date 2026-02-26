import http.server
import socketserver
from http import HTTPStatus
import os

STATIC_DIR = "/boot/firmware/signage/www"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def do_GET(self):
        if self.path == '/on':
            os.system("sh /boot/firmware/signage/turnon.sh")
            self.send_response(HTTPStatus.OK)
            self.end_headers()
            self.wfile.write(b'OK')
        elif self.path == '/off':
            os.system("sh /boot/firmware/signage/turnoff.sh")
            self.send_response(HTTPStatus.OK)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            super().do_GET()

PORT = 8000
httpd = socketserver.TCPServer(('', PORT), Handler)
print(f"Serving on port {PORT}...")
httpd.serve_forever()
