apt install -y unzip
rm -rf /opt/examen/ms-usuarios
unzip -q /tmp/ms-usuarios.zip -d /opt/examen/

# Por si el zip creó una subcarpeta doble
if [ -d "/opt/examen/ms-usuarios/ms-usuarios" ]; then
  mv /opt/examen/ms-usuarios/ms-usuarios/* /opt/examen/ms-usuarios/
  rmdir /opt/examen/ms-usuarios/ms-usuarios
fi

# Cargar esquema SQL de usuarios en servidor1
SQL_U=$(find /opt/examen/ms-usuarios -name "*.sql" | head -n 1)
if [ -n "$SQL_U" ]; then
  mysql -h 192.168.56.10 -u usuarios_user -p'Usuarios2026*' usuarios_db < "$SQL_U"
fi

# Unificar el mismo JWT_SECRET en los 3 microservicios
SECRET="clave_secreta_super_segura_m3_2026"
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" /opt/examen/ms-viajes/.env
sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" /opt/examen/ms-conductores/.env

cat << EOF > /opt/examen/ms-usuarios/.env
PORT=3001
HOST=127.0.0.1
DB_HOST=192.168.56.10
DB_PORT=3306
DB_NAME=usuarios_db
DB_USER=usuarios_user
DB_PASSWORD=Usuarios2026*
JWT_SECRET=$SECRET
EOF

cd /opt/examen/ms-usuarios && npm install --omit=dev
chown -R nodeapps:nodeapps /opt/examen
chmod 640 /opt/examen/ms-usuarios/.env

MAIN_U=$(node -p "require('/opt/examen/ms-usuarios/package.json').main || 'src/index.js'")

cat << EOF > /etc/systemd/system/ms-usuarios.service
[Unit]
Description=Microservicio ms-usuarios
After=network.target

[Service]
Type=simple
User=nodeapps
WorkingDirectory=/opt/examen/ms-usuarios
EnvironmentFile=/opt/examen/ms-usuarios/.env
ExecStart=/usr/bin/node $MAIN_U
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now ms-usuarios
systemctl restart ms-viajes ms-conductores
sleep 2
systemctl status ms-usuarios ms-viajes ms-conductores --no-pager
ls -l /opt/examen/ms-viajes/.env /opt/examen/ms-conductores/.env