FROM mcr.microsoft.com/playwright:v1.37.1-jammy
WORKDIR /automation
COPY . .
RUN apt-get update && apt-get install -y zip
RUN yarn
RUN chmod +x .docker/entry.sh

CMD ["sh", "-c", ".docker/entry.sh"]