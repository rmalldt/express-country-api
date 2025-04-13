# Country API (Node.js and Express)

A Country API that allows to perform CRUD operations.

## Getting Started

### Prerequisites

- Node.js
- npm
- A cloud-based database hosting platform such as Supabase, Neon etc.

### Installation

1. Clone the repository.

   - Run git clone [repo].

2. Install dependencies.

   - Run `npm install` to install all dependencies for the project.

3. Setup databases.

   - Create a database instance on [Supabase][https://supabase.com] (or other cloud-based database hosting platfrom such as [Neon][https://console.neon.tech])
   - Retrieve the database URL & copy it.
   - Create a `.env` file in the root directory with the following:

   ```
   DB_URL=<your_database_url>
   ```

   - Replace `<your_database_url>` with the database URL you copied.

   - Run `npm run setup-db` to setup the database.

4. Setup your port.

   - Add a `PORT` key assigned to the port of your choice in `.env` file.

5. Run the server.

   - Run `npm run dev` to run the server in development mode.
   - Run `npm start` to run the server in production mode.

### Database Schema

`Country Table`

```
country_id INT GENERATED ALWAYS AS IDENTITY,
name VARCHAR(100) NOT NULL,
capital VARCHAR(100) NOT NULL,
population INT NOT NULL,
languages VARCHAR(100) NOT NULL,
fun_facts VARCHAR(255),
map_image_url VARCHAR(255),
PRIMARY KEY (country_id)
```

## API Endpoints

### BASE URL

`http://localhost:[port]/countries`

### API Endpoints

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | /countries       | Retrieves all countries    |
| GET    | /countries/:name | Retrieves a single country |
| POST   | /countries       | Creates a new country      |
| DELETE | /countries/:name | Deletes a country          |

### Example Request

To retrieve all countries, use the following GET request - GET /countries

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
