FROM node:17.1.0-bullseye-slim

RUN \
    apt-get update && \
    apt-get install -y ca-certificates && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g hasura-cli@^2.0.9

USER node

CMD ["sh", "entrypoint.sh"]
