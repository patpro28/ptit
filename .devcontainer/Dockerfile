FROM mcr.microsoft.com/devcontainers/javascript-node:1-22

WORKDIR /workspace

ENV PNPM_HOME=/home/node/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN npm install -g pnpm

USER node
SHELL ["/usr/bin/zsh", "-c"]
