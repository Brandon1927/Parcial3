apt update
DEBIAN_FRONTEND=noninteractive apt install -y bind9 bind9utils dnsutils mysql-server ufw
sed -i 's/^bind-address.*/bind-address = 127.0.0.1,192.168.56.10/' /etc/mysql/mysql.conf.d/mysqld.cnf
systemctl restart mysql
printf 'zone "m3examen.com" {\n    type master;\n    file "/etc/bind/db.m3examen.com";\n};\n' > /etc/bind/named.conf.local
cat << 'EOF' > /etc/bind/db.m3examen.com
$TTL 86400
@   IN  SOA servidor1.m3examen.com. root.m3examen.com. (
            2026112302 ; Serial
            604800     ; Refresh
            86400      ; Retry
            2419200    ; Expire
            86400 )    ; Negative Cache TTL
;
@                     IN  NS  servidor1.m3examen.com.
@                     IN  A   192.168.56.10
servidor1             IN  A   192.168.56.10
servidor2             IN  A   192.168.56.11
montilla-salazar-f10  IN  A   192.168.56.11
EOF
named-checkconf && named-checkzone m3examen.com /etc/bind/db.m3examen.com && systemctl restart bind9
ufw allow 22/tcp
ufw allow 53
ufw allow from 192.168.56.11 to any port 3306 proto tcp
ufw --force enable