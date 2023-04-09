# News Application Backend

This is the backend of a News Application that allows users to check the latest news and articles using newsapi. Users can also manage their subscription to certain sources of news to get the latest feed from them only.

## User Journey

The user journey consists of the following steps:

1. User registers in the application using the following data:
   - fullName
   - email
   - password

2. Users can login using email and password.

3. There are two pages: home and sources.

4. Users can log out.

5. The user can see a list of all the news & articles from the subscribed sources.

6. The user can see a list of sources where he can subscribe or unsubscribe to any of them.

7. Login history page to view who logged to this account and when (only latest 10 logins) track success and failed logins.

8. Page to view most subscribed sources list by all users (e.g. top 5).

## Tools

- Node.js
- MongoDB
- Redis caching
- Logger (use pino)
- News API

## Getting Started

To run the application, follow these steps:

1. Install Node.js, MongoDB and Redis on your machine.

2. Clone this repository to your local machine.

3. Install the dependencies using the following command:

npm install


4. Start the application using the following command:

npm start


5. The application should now be running on `http://localhost:3000`.

## API Endpoints

- `POST /api/users/signup`: Register a new user.
- `POST /api/users/login`: Login a user.
- `POST /api/users/logout`: Logout a user.
- `GET /api/news`: Get the latest news & articles from the subscribed sources.
- `GET /api/sources`: Get a list of sources where the user can subscribe or unsubscribe.
- `GET /api/users/loginHistory`: Get the login history for the current user.
- `GET /api/sources/mostsubscribed`: Get the most subscribed sources list by all users.

## Docker Compose

A Docker Compose file has been included in the project that includes all the services required to run the stack. To run the application using Docker Compose, follow these steps:

1. Install Docker and Docker Compose on your machine.

2. Clone this repository to your local machine.

3. Navigate to the project directory and run the following command:

docker-compose up


4. The application should now be running on `http://localhost:8000`.

## Conclusion

This backend provides the functionalities required for the News Application. The RESTful APIs have been designed according to the user journey and integrated with the newsapi from the backend of the application. Redis caching and logger have been used to improve performance and maintainability. A Docker Compose file has been included to simplify the deployment of the application.
