rm -rf /opt/examen
git clone https://github.com/Brandon1927/Parcial3.git /opt/examen

echo "=== ESTRUCTURA DEL REPO ==="
ls -la /opt/examen
head -n 30 /opt/examen/*/.env.example /opt/examen/*/package.json

# Cargar esquemas SQL en servidor1
for db in usuarios viajes conductores; do
  SQL_FILE=$(find /opt/examen/ms-$db -name "*.sql" | head -n 1)
  if [ -n "$SQL_FILE" ]; then
    echo "Cargando $SQL_FILE en ${db}_db..."
    mysql -h 192.168.56.10 -u ${db}_user -p"${db^}2026*" ${db}_db < "$SQL_FILE"
  fi
done

# Configurar Apache examen.conf y Frontend
mkdir -p /var/www/examen
cp /opt/examen/ms-conductores/frontend/index.html /var/www/examen/index.html

cat << 'EOF' > /etc/apache2/sites-available/examen.conf
<VirtualHost *:80>
    ServerName montilla-salazar-f10.m3examen.com
    DocumentRoot /var/www/examen

    <Directory /var/www/examen>
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /api/usuarios http://127.0.0.1:3001/usuarios
    ProxyPassReverse /api/usuarios http://127.0.0.1:3001/usuarios

    ProxyPass /api/viajes http://127.0.0.1:3011/viajes
    ProxyPassReverse /api/viajes http://127.0.0.1:3011/viajes

    ProxyPass /api/conductores http://127.0.0.1:3012/conductores
    ProxyPassReverse /api/conductores http://127.0.0.1:3012/conductores

    ErrorLog ${APACHE_LOG_DIR}/examen_error.log
    CustomLog ${APACHE_LOG_DIR}/examen_access.log combined
</VirtualHost>
EOF

a2ensite examen.conf
apache2ctl configtest
systemctl reload apache2