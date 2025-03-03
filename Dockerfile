# this will pull image node versin 22.x
FROM node:22

# this will make directory inside the docker
WORKDIR /app

# this will copy all file to /app
COPY . .

# this will run npm install to make node_modules
RUN npm install

#
EXPOSE 3000

# this will run npm run start:dev
CMD [ "npm", "run", "start:dev" ]