# Instalar dependencias de ambos microservicios
cd /opt/examen/ms-viajes && npm ci --omit=dev
cd /opt/examen/ms-conductores && npm ci --omit=dev

# Crear .env de ms-viajes (puerto 3011)
cat << 'EOF' > /opt/examen/ms-viajes/.env
PORT=3011
HOST=127.0.0.1
DB_HOST=192.168.56.10
DB_PORT=3306
DB_NAME=viajes_db
DB_USER=viajes_user
DB_PASSWORD=Viajes2026*
JWT_SECRET=cambie-esta-frase-por-una-larga-y-secreta
EOF

# Crear .env de ms-conductores (puerto 3012)
cat << 'EOF' > /opt/examen/ms-conductores/.env
PORT=3012
HOST=127.0.0.1
DB_HOST=192.168.56.10
DB_PORT=3306
DB_NAME=conductores_db
DB_USER=conductores_user
DB_PASSWORD=Conductores2026*
JWT_SECRET=cambie-esta-frase-por-una-larga-y-secreta
EOF

# Permisos exigidos: usuario nodeapps y .env en 640
chown -R nodeapps:nodeapps /opt/examen
chmod 640 /opt/examen/ms-viajes/.env /opt/examen/ms-conductores/.env

# Detectar archivo principal de arranque (main en package.json)
MAIN_VIAJES=$(node -p "require('/opt/examen/ms-viajes/package.json').main || 'src/app.js'")
MAIN_CONDUCTORES=$(node -p "require('/opt/examen/ms-conductores/package.json').main || 'index.js'")

# Servicio systemd ms-viajes
cat << EOF > /etc/systemd/system/ms-viajes.service
[Unit]
Description=Microservicio ms-viajes
After=network.target

[Service]
Type=simple
User=nodeapps
WorkingDirectory=/opt/examen/ms-viajes
EnvironmentFile=/opt/examen/ms-viajes/.env
ExecStart=/usr/bin/node $MAIN_VIAJES
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Servicio systemd ms-conductores
cat << EOF > /etc/systemd/system/ms-conductores.service
[Unit]
Description=Microservicio ms-conductores
After=network.target

[Service]
Type=simple
User=nodeapps
WorkingDirectory=/opt/examen/ms-conductores
EnvironmentFile=/opt/examen/ms-conductores/.env
ExecStart=/usr/bin/node $MAIN_CONDUCTORES
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now ms-viajes ms-conductores
sleep 2
systemctl status ms-viajes ms-conductores --no-pager
ls -l /opt/examen/ms-viajes/.env /opt/examen/ms-conductores/.env