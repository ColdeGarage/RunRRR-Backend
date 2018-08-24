FROM node:boron

WORKDIR /coldegarage
COPY . .
RUN npm install && \
    apt-get update && \
    apt-get install -y  vim && \
    mkdir server-log
EXPOSE 8081 3000

ENTRYPOINT ["npm", "start"]
