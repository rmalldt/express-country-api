# Country API (Node.js and Express)

## Overview

A Country API that allows to perform view, add, update and delete countries.

## Getting Started

### Prerequisites

- Node.js
- NPM
- A cloud-based database hosting platform such as [Supabase](https://supabase.com) or [Neon](https://console.neon.tech).

### Installation

1. Clone the repository.

   - Run `git clone [repo]`.

2. Install dependencies.

   - Run `npm install` to install all dependencies for the project.

3. Setup database.

   - Create a database instance on [Supabase](https://supabase.com) (or other cloud-based database hosting platform such as [Neon](https://console.neon.tech))

   - Retrieve the database URL connection string & copy it.

   - Create a `.env` file in the root directory with the following:

   ```
   DB_URL=<YOUR_DB_URL>
   ```

   - Replace `<YOUR_DB_URL>` with the database URL you copied.

   - Run `npm run setup-db` to setup the database.

4. Setup your port.

   - Add a `PORT` key assigned to the port of your choice in `.env` file.

   ```
   PORT=<YOUR_PORT>
   ```

5. Run the server.

   - Run `npm run dev` to run the server in development mode.

   - Run `npm start` to run the server in production mode.

### Database Schema

`Country Table`

```postgres
country_id INT GENERATED ALWAYS AS IDENTITY,
name VARCHAR(100) NOT NULL,
capital VARCHAR(100) NOT NULL,
population INT NOT NULL,
languages VARCHAR(100) NOT NULL,
fun_facts VARCHAR(255),
map_image_url VARCHAR(255),
PRIMARY KEY (country_id)
```

## Running the app using Docker

### Provide the environment variables

In order to run the app using Docker, provide the ENV variables (ENV PORT and ENV DB_URL) in the existing Dockerfile so they are accessible inside the application.

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
ENV PORT=<CONTAINER_PORT>
ENV DB_URL=<YOUR_DB_URL>
EXPOSE <CONTAINER_PORT>
RUN npm run setup-db
CMD ["node", "server/index.js"]
```

### Build Docker Image and run the Container

1. Build the Image off of the Country API: `docker build -t <YOUR_DOCKER_USERNAME>/country-api:0.0.1.RELEASE .`

2. Run a container: `docker run -d -p <HOST_PORT>:<CONTAINER_PORT> --name country-api <YOUR_DOCKER_USERNAME>/country-api:0.0.1.RELEASE`

   - Choose your <HOST_PORT> value of your choice in order to access the container using the browser.
   - The <CONTAINER_PORT> value must match the `ENV PORT=<CONTAINER_PORT>` defined in the Dockerfile.

## API Endpoints

### BASE URL

`http://localhost:<PORT>/countries`

### API Endpoints

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | /countries       | Retrieves all countries    |
| GET    | /countries/:name | Retrieves a single country |
| POST   | /countries       | Creates a new country      |
| PATCH  | /countries/:name | Updates a country          |
| DELETE | /countries/:name | Deletes a country          |

### Example Request

To retrieve all countries, use the following GET request - `GET /countries`

`curl -X GET http://localhost:[port]/countries`

A successful response will return a JSON array of countries objects, similar to the following:

```json
{
  "success": true,
  "data": [
    {
      "name": "Brazil"
    },
    {
      "name": "Mexico"
    },
    {
      "name": "United States"
    }
  ]
}
```
