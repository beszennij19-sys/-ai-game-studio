FROM node:22-alpine
WORKDIR /app
COPY . .
RUN cd Studio/backend && npm install --omit=dev
RUN mkdir -p /app/Studio/data /app/Studio/generated
ENV NODE_ENV=production
EXPOSE 8787
CMD ["node","Studio/backend/server-4.7.mjs"]
