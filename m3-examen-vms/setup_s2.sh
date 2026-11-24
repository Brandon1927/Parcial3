curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
DEBIAN_FRONTEND=noninteractive apt install -y nodejs apache2 git mysql-client ufw
useradd -r -s /bin/false nodeapps
a2enmod proxy proxy_http
systemctl restart apache2
ufw allow 22/tcp
ufw allow 80/tcp
ufw --force enable