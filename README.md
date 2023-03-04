# school
Project Name - CMS API
Introduction
This is a CMS (Content Management System) API built using Express.js and Mongoose ORM for MongoDB. It provides various endpoints to manage content.

Features
Admin authentication using JWT tokens
CRUD operations for content
Prerequisites
To run this project, you need to have the following tools installed on your machine:

Node.js (v12.18.3 or higher)
MongoDB (v4.2.0 or higher)
Installation
Follow the steps given below to run the project on your local machine:

Clone this repository to your local machine.
Navigate to the project directory using a terminal.
Run the following command to install the dependencies:
Copy code
npm install
Create an .env file in the root directory and set the following variables:
makefile
Copy code
```MONGODB_URI=<your-mongodb-connection-string>
ACCESS_TOKEN=<your-access-token>
REFRESH_TOKEN=<your-refresh-token>
MAIL_ID=<your-mail-id>
MAIL_PASSWORD=<your-mail-password>```

Run the following command to start the server:
npm start
Open your web browser and navigate to http://localhost:5000/ to access the API.
To view the Swagger UI documentation, navigate to http://localhost:5000/api-docs


Note: Replace your-mongodb-connection-string, your-access-token, your-refresh-token, your-mail-id, and your-mail-password with the appropriate values in the .env file.



