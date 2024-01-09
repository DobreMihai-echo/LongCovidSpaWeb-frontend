FROM node:16 as builder
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app/
RUN npm run build:production -- --output-path=./dist/out --configuration=production


#NGINX
FROM nginx
COPY --from=builder /app/dist/out/ /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf 
EXPOSE 4200
ENTRYPOINT ["nginx","-g","daemon off;"]