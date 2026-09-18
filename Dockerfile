FROM nginx:alpine

WORKDIR /usr/share/nginx/html/

RUN rm -rf ./*

COPY . .

RUN rm -rf .git .gitignore README.md *.json *.sh *.toml 2>/dev/null || true

RUN printf 'server {\n  listen 80;\n  server_name _;\n  root /usr/share/nginx/html;\n  index index.html;\n  location / {\n    try_files \ \/ /index.html;\n  }\n  gzip on;\n  gzip_types text/css application/javascript image/svg+xml;\n}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
