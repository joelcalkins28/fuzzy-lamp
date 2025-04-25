# Job Search CRM - fuzzy-lamp

A comprehensive CRM (Customer Relationship Management) system for job seekers to track application status, manage professional contacts, and organize their job search.

## Features

* Track job applications with detailed information:
  * Company details
  * Position information
  * Application status tracking
  * Salary and location data
  * Job descriptions and links
  * Application timeline

* Manage professional contacts:
  * Contact information (name, company, position)
  * Contact methods (email, phone, LinkedIn)
  * Relationship categorization
  * Last contact tracking
  * Notes and follow-ups

* Dashboard with analytics:
  * Application statistics 
  * Status breakdown
  * Recent applications

* Intuitive user interface:
  * Responsive design
  * Filtering and sorting
  * Relationship management between applications and contacts

## Technology Stack

* **Frontend**: React, React Router, Bootstrap, Axios
* **Backend**: Node.js, Express, MongoDB (Mongoose)
* **Deployment**: MongoDB Atlas, Heroku

## Local Development Setup

### Prerequisites

* Node.js (v14+ recommended)
* npm or yarn
* MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5001
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

The application will be available at `http://localhost:3000` and will proxy API requests to the backend at `http://localhost:5001`.

## Deployment

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster and database
3. Obtain your connection string from the Atlas dashboard

### Heroku Deployment

1. Create a Heroku account at [https://www.heroku.com](https://www.heroku.com)
2. Install the Heroku CLI
3. Log in to Heroku CLI:
   ```
   heroku login
   ```
4. Create a new Heroku app:
   ```
   heroku create fuzzy-lamp-crm
   ```
5. Set environment variables:
   ```
   heroku config:set MONGO_URI=your_mongodb_atlas_connection_string
   ```
6. Add a `Procfile` in the root directory with:
   ```
   web: cd server && npm start
   ```
7. Push to Heroku:
   ```
   git push heroku main
   ```

### Alternative Deployment Options

The application can also be deployed to other platforms:

* **Frontend**: Netlify, Vercel, GitHub Pages
* **Backend**: DigitalOcean, AWS, Google Cloud Platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License. 