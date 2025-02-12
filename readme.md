# MERNDemo.API-Express

This project is part of a MERN stack demonstration, focusing on building a backend API using Express.js.

## Project Structure

The repository includes the following directories and files:

- `.idea/` - Contains IDE-specific settings.
- `controllers/` - Houses the controller modules that handle business logic.
- `models/` - Contains the data models and schemas.
- `routes/` - Defines the application routes.
- `util/` - Utility functions and helpers.
- `app.js` - The main application file that initializes the server.
- `package.json` - Lists the project dependencies and scripts.
- `package-lock.json` - Records the exact version of each installed package.

## Technologies Used

- **JavaScript** - The primary programming language used in this project.
- **Node.js** - A runtime environment for running JavaScript on the server.
- **Express.js** - A minimal and flexible Node.js web application framework.
- **MongoDB (Optional)** - Can be integrated if database functionality is required.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- MongoDB (if the project requires a database)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/PomiHD/MERNDemo.API-Express.git
   cd MERNDemo.API-Express
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the application**:

   ```bash
   npm start
   ```

### Running in Development Mode

For development purposes, you can use `nodemon` to automatically restart the server when changes are made.

   ```bash
     npm install -g nodemon
     nodemon app.js
   ```

## API Endpoints

### Places

| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| GET    | `/api/places/:pid`      | Get a place by ID.          |
| GET    | `/api/places/user/:uid` | Get places by user ID.      |
| POST   | `/api/places`           | Create a new place.         |
| PATCH  | `/api/places/:pid`      | Update a place by ID.       |
| DELETE | `/api/places/:pid`      | Delete a place by ID.       |

### Users

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | `/api/users`         | Get all users.         |
| POST   | `/api/users/signup`  | Sign up a new user.    |
| POST   | `/api/users/login`   | Log in an existing user. |


## License

This project is licensed under the MIT License.


