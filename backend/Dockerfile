FROM node:18 as development

WORKDIR /backend
CMD ["npm", "start"]
EXPOSE 5000


FROM node:18 as builder
WORKDIR /backend

COPY package.json package-lock.json ./
RUN npm i

COPY . ./
RUN npm run build

FROM node:18 as streamHandler
WORKDIR /backend
COPY --from=builder /backend/dist/streamHandler.js /backend/dist/streamHandler.js

FROM node:18 as apolloHandler
WORKDIR /backend
COPY --from=builder /backend/dist/apolloHandler.js /backend/dist/apolloHandler.js

FROM node:18 as messageHandler
WORKDIR /backend
COPY --from=builder /backend/dist/messageHandler.js /backend/dist/messageHandler.js