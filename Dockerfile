
FROM node:latest

WORKDIR /code

COPY . /code

RUN npm install .

EXPOSE 8001:80

CMD ["node", "."] 
