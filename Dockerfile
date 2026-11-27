FROM node:22-bookworm-slim
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev --no-audit --no-fund
COPY index.html app.js style.css showcase.html ./
COPY pages ./pages
COPY services ./services
COPY data ./data
COPY styles ./styles
COPY backend/server.js backend/access.js ./backend/
COPY backend/sql ./backend/sql
ENV NODE_ENV=production PORT=8080
USER node
EXPOSE 8080
CMD ["node","backend/server.js"]
