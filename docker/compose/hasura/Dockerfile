FROM hasura/graphql-engine:v2.0.9

RUN \
    apt-get update && \
    apt-get install -y wget netcat && \
    wget https://raw.githubusercontent.com/eficode/wait-for/v2.1.3/wait-for && \
    chmod +x wait-for && \
    apt-get -y remove wget && \
    apt-get -y auto-remove && \
    apt-get -y clean && \
    rm -rf /var/lib/apt/lists/*
