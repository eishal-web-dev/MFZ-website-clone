FROM node:20-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

# Frontend dependencies
COPY package*.json ./
RUN npm ci

# Backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci

COPY . ./

# Production browser requests should use the API on the same Railway domain.
# This fixes mobile auth/CORS issues and removes dependence on an old API URL.
ENV VITE_API_BASE_URL=/api
ENV VITE_API_URL=""

RUN npm run build
RUN cd server && npm run build

FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY --from=build /app/server/dist ./server/dist

EXPOSE 3000

CMD ["node", "server/dist/index.js"]
