# here iam using production ready file to show the difference that how prodcution is little different not much, but for dev environment fo the sake of running project we can lossely write our files. But here also i would follow strict approach


# ================================
# Stage 1 → Builder Stage
# ================================

FROM node:22-alpine AS stage1builder 

WORKDIR /app

COPY package*.json ./

RUN npm install
# Install ALL dependencies
# including devDependencies
# because build needs TypeScript, Nest CLI etc and all other dev dependencies. Not all like prettier eslint but yeah some, you get it what i mean.

COPY . .
#Remember that left dot is always for your current machine and righ is for Docker

RUN npm run build


# ================================
# Stage 2 → Runner Stage
# ================================

FROM node:22-alpine AS finalRunner

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev
# Install ONLY production dependencies
# skips devDependencies like:
# typescript, eslint, jest etc.

# Copy compiled application from builder stage
COPY --from=stage1builder /app/dist ./dist
COPY --from=stage1builder /app/prisma ./prisma
# Copy prisma schema and migrations
# useful for migrations and runtime metadata

EXPOSE 8000
# Start compiled NestJS app
CMD ["node", "dist/main"]


#ENTRYPOINT ["node"]
#CMD ["dist/main"]
# these both will make "node dist/main""