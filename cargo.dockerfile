# Build stage
FROM messense/rust-musl-cross:x86_64-musl AS builder
WORKDIR /app
COPY . .
RUN cargo build --release

# Fetcher runtime
FROM alpine:3.18.3 AS fetcher
RUN apk add --no-cache chromium ca-certificates tzdata
ENV TZ=Europe/Paris
COPY .env /.env
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/fetcher /fetcher
CMD ["/fetcher"]

# Rater runtime
FROM alpine:3.18.3 AS rater
RUN apk add --no-cache ca-certificates tzdata
ENV TZ=Europe/Paris
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/rater /rater
COPY .env /.env
CMD ["/rater"]
