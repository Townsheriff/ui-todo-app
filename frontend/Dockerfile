FROM node:18 as development

WORKDIR /frontend
CMD ["npm", "start"]
EXPOSE 5001

FROM node:18 as builder

ARG GRAPHQL_URL
ARG GRAPHQL_WS

ENV GRAPHQL_URL=$GRAPHQL_URL
ENV GRAPHQL_WS=$GRAPHQL_WS

WORKDIR /frontend

COPY package.json package-lock.json ./
RUN npm i

COPY . ./
RUN npm run build