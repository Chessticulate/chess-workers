FROM node:20.9-alpine

WORKDIR /code

COPY . /code

RUN npm install .
RUN npm update shallowpink

EXPOSE 8001:80

CMD ["node", "."] 
