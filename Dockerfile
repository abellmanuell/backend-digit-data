FROM node:alpine
WORKDIR /app
COPY ./package.json .
COPY ./pnpm-lock.yaml .
RUN command -v pnpm || npm install -g pnpm
RUN pnpm install
COPY ./app.js .
COPY ./config/ ./config
COPY ./routes/ ./routes
COPY ./utils/ ./utils
COPY ./.env/ .
CMD [ "pnpm", "run", "dev:backend" ]