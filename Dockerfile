FROM node:10
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm run build:ssr

FROM node:10
RUN apt-get update && apt-get install -y dumb-init && rm -rf /var/lib/apt/lists/*
WORKDIR /opt/app
COPY --from=0 /usr/src/app/dist ./dist
ENV PORT=80
CMD ["dumb-init", "node", "/opt/app/dist/juypterclassroom/server/main.js"]
EXPOSE 80
