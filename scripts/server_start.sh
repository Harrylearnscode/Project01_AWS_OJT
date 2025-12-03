#!/bin/bash
cd /home/ec2-user/app
# The JAR is now directly in this folder
sudo nohup java -jar -Dserver.port=80 *.jar > /dev/null 2>&1 &