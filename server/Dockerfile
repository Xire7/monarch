FROM node:18-alpine AS builder
#monarch
WORKDIR /monarch
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

#nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /monarch/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]