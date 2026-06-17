FROM nginx:alpine

# Copia a configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia o site para o diretório servido pelo nginx
COPY playbook.html /usr/share/nginx/html/index.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
