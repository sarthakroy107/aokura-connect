FROM node:22.2-alpine3.19 AS base

RUN apk add --no-cache libc6-compat
RUN apk update

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Accept build arguments
ARG DB_URL
ARG JWT_SECRET
ARG PRIVATE_IP

# Set additional environment variables
ENV DB_URL=$DB_URL \
    JWT_SECRET=$JWT_SECRET \
    PRIVATE_IP=$PRIVATE_IP

FROM base AS builder

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm add -g turbo

WORKDIR /app

COPY . .

RUN turbo prune socket-server --docker

#install dependencies
FROM base AS installer

WORKDIR /apps

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --frozen-lockfile

#build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=socket-server

EXPOSE 6700

ENTRYPOINT [ "node" ]

CMD [ "apps/socket-server/dist/apps/socket-server/src/index.js" ]