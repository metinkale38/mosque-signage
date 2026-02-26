import sys
import urllib.request
import os.path
import requests
import pathlib
import hashlib

root = "/boot/firmware/signage/www"
remote = "https://metinkale38.github.io/mosque-signage"

if os.path.isfile("/boot/firmware/signage/host"):
    with open("/boot/firmware/signage/host", 'r') as file:
        remote = file.read().rstrip()

mounted = False
def mountrw():
    global mounted
    if mounted == False:
        os.system('mount -o remount,rw /boot/firmware')
        mounted = True

def mountro():
    global mounted
    if mounted:
      os.system('mount -o remount,ro /boot/firmware')



host = os.uname()[1]
lines = requests.get(remote + '/hash.php?hostname='+host).text.splitlines()

remotefiles = {}

for line in lines:
    parts = line.split("=")
    remotefiles[parts[0]] = parts[1]

changed = False
for file, hash in remotefiles.items():
    localPath = root+file
    if os.path.isfile(localPath) == False:
        print("File "+file+" was added")
        mountrw()
        pathlib.Path(localPath).parent.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(remote + file, localPath)
        changed = True
    else:
        hex = hashlib.md5(open(localPath,"rb").read()).hexdigest()
        if hex != remotefiles[file]:
            print("File "+file+" has changed")
            mountrw()
            pathlib.Path(localPath).parent.mkdir(parents=True, exist_ok=True)
            urllib.request.urlretrieve(remote + file, localPath+".tmp")
            os.remove(localPath)
            os.rename(localPath+".tmp", localPath)
            changed = True



for subdir, dirs, files in os.walk(root):
    for file in files:
        path = os.path.join(subdir, file).replace("\\","/").removeprefix(root)
        if path not in remotefiles:
           print("File "+path+" was removed")
           mountrw()
           os.remove(root + path)
           changed = True


mountro()

if changed:
    os.system("killall chromium")