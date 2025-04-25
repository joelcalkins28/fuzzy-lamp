# Job Search CRM - Backend

Backend API for the Job Search CRM application (fuzzy-lamp).

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the server directory with the following variables:
   ```
   # MongoDB connection string (local or MongoDB Atlas)
   MONGO_URI=mongodb://localhost:27017/fuzzy-lamp
   # or for MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/fuzzy-lamp
   
   # Server port
   PORT=5001
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Applications

- `GET /api/applications` - Get all applications
- `GET /api/applications/:id` - Get application by ID
- `POST /api/applications` - Create a new application
- `PUT /api/applications/:id` - Update an application
- `DELETE /api/applications/:id` - Delete an application

### Contacts

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact 