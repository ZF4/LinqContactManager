# LinqContactManager

Contact Manager app built for Linq, providing efficient management of contacts with search functionality.

My first step was to decide which storage option I wanted to go with. Being familiar with SQL made PostgreSQL an easy choice.
I then broke the app up into chunks and began with setting up my folders and files, followed by connecting the backend to my database.
I created my table and a few contacts in the database and starting to work on getting them to the front end.
From there I began implimenting the features I'd like to have in a contact manager such as adding, updating, and deleting contacts.
A search bar was added to search by name or email.
Lastly I added checks to make sure duplicate entries (emails) would be accounted for.

The biggest improvement I would look to make is the UI. Primarily the home page.
I would also add more alerts to let the user know their request was accomplished such as making an edit.

## Demo
https://github.com/user-attachments/assets/cee686a8-baa6-4c4a-9d32-d731a1e039b9



## Features
- Add new contacts with name and email.
- View all contacts.
- Search contacts by name or email.
- Built with Node.js, Express, PostgreSQL, and Vite.

---

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/)
- [Vite](https://vitejs.dev/) (installed via npm)
- [Postman](https://www.postman.com/downloads/) for API testing (optional)

---

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/ZF4/LinqContactManager.git
    cd LinqContactManager
    ```

2. **Install Backend Dependencies:**
    ```bash
    cd server
    npm install
    ```

3. **Install Frontend Dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4. **Configure Environment Variables:**
    Create a `.env` file in the backend directory with the following variables:
    ```env
    DB_USER=your_pg_username
    DB_PASSWORD=your_pg_password
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=contact_list_manager
    ```

---

## Database Setup

1. **Start PostgreSQL:**
    Ensure PostgreSQL is running using pgAdmin or CLI:
    ```bash
    sudo service postgresql start
    ```

2. **Create Database and Table:**
    ```sql
    CREATE DATABASE contact_list_manager;
    
    CREATE TABLE contacts (
      id SERIAL PRIMARY KEY,




      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL
    );
    ```

---

## Running the Application

1. **Start the Backend Server:**
    ```bash
    cd server
    npm run dev
    ```
    The server will run at `http://localhost:8080`

2. **Start the Frontend with Vite:**
    ```bash
    cd ../client
    npm run dev
    ```
    By default, Vite will run on `http://localhost:5173`

---

## API Endpoints

- **Add Contact:**
  - `POST /contacts`
  - Body: `{ "name": "John Doe", "email": "john.doe@example.com" }`
- **Get All Contacts:**
  - `GET /contacts`
- **Search Contacts:**
  - `GET /contacts/search?query=john`

---

## Contact
For any questions, reach out via email.

