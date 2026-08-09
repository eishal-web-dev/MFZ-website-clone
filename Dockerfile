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

# The Railway frontend and backend are separate services. Send browser API
# requests to the backend service, where MongoDB and JWT variables are set.
ENV VITE_API_BASE_URL=https://mfz-website-backend-production.up.railway.app/api
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
