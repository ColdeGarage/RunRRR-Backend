FROM node:boron

WORKDIR /coldegarage
COPY . .
RUN npm install && \
    apt-get update && \
    apt-get install -y  vim
EXPOSE 8081 3000
CMD ["/bin/bash"]

