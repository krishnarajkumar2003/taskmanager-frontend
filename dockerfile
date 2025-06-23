# Use a Node.js image, not React 
FROM node:22.16-alpine

# set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# copy app files
COPY . .

# Set environment variabl(optional)
ENV PORT=8090

# Expose the port React will run on
Expose 8090

# Start React dev server
CMD ["npm","Start"]


# FROM react:19.1.0

# WORKDIR /app

# COPY package.json ./

# RUN npm install

# COPY . .

#ENV PORT=8090

# EXPOSE 8090

# CMD ["npm","start"]