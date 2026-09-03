# Smart Waste Monitoring System

## Project Overview

The Smart Waste Monitoring System is designed to help authorities monitor dustbins across different areas efficiently.

The system keeps track of dustbin locations, serial numbers, waste fill levels, historical readings, and waste collection records. This allows authorities to identify dustbins that are filling up, understand waste accumulation patterns, and plan waste collection more efficiently.

The current project scope focuses on **waste monitoring only**.

## Main Objectives

- Monitor dustbins area-wise.
- Maintain a unique serial number for each dustbin.
- Track the current fill level of each dustbin.
- Store historical fill-level readings.
- Maintain records of waste collection.
- Calculate overall and area-wise waste monitoring statistics.
- Help authorities identify dustbins that require attention or collection.

## System Architecture

The system follows a flow where dustbin information and sensor readings are processed by the backend and made available to the frontend dashboard.

```text
Dustbin / Sensor
       ↓
   Backend API
       ↓
    MongoDB
       ↓
 React Dashboard
       ↓
Authorities / Waste Collection
```

## Technology Stack

### Frontend

- **React.js** – Used to build the web dashboard and user interface.
- **Axios** – Used by the frontend to communicate with the backend APIs.
- **Recharts** – Used to display monitoring data through charts and visualizations.

### Backend

- **Node.js** – Provides the runtime environment for the backend.
- **Express.js** – Used to build the REST APIs and handle HTTP requests.
- **Mongoose** – Used to connect the backend with MongoDB and work with database data.
- **CORS** – Allows the frontend and backend to communicate when they are running on different origins.
- **dotenv** – Used to load environment variables such as database configuration.

### Database

- **MongoDB** – Used to store dustbin information, sensor readings, and waste collection records.

### Hardware

- **ESP32 / Arduino** – Intended to collect data from sensors installed in or around the dustbins.
- **Ultrasonic Sensor** – Intended to measure the amount of available space/waste fill level inside a dustbin.

## Backend Structure

The backend follows a simple structure that separates API routes, request handling, and data.

```text
backend/
│
├── controllers/
│   ├── dustbinController.js
│   ├── readingController.js
│   ├── collectionController.js
│   └── dashboardController.js
│
├── data/
│   ├── bins.js
│   ├── readings.js
│   └── collections.js
│
├── routes/
│   ├── dustbinRoutes.js
│   ├── readingRoutes.js
│   ├── collectionRoutes.js
│   └── dashboardRoutes.js
│
├── models/
│   ├── Dustbin.js
│   ├── Reading.js
│   └── Collection.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Backend API

The backend provides REST APIs for managing dustbins, sensor readings, waste collections, and dashboard statistics.

### Dustbin APIs

| Method | Endpoint                             | Description                               |
| ------ | ------------------------------------ | ----------------------------------------- |
| GET    | `/api/dustbins`                      | Get all dustbins                          |
| GET    | `/api/dustbins/:id`                  | Get a specific dustbin                    |
| POST   | `/api/dustbins`                      | Add a new dustbin                         |
| PUT    | `/api/dustbins/:id`                  | Update a dustbin                          |
| GET    | `/api/dustbins/areas/:area/dustbins` | Get dustbins belonging to a specific area |

### Reading APIs

| Method | Endpoint                              | Description                           |
| ------ | ------------------------------------- | ------------------------------------- |
| GET    | `/api/readings/dustbins/:id/readings` | Get historical readings for a dustbin |
| POST   | `/api/readings`                       | Add a new fill-level reading          |

### Collection APIs

| Method | Endpoint               | Description                                   |
| ------ | ---------------------- | --------------------------------------------- |
| GET    | `/api/collections`     | Get all waste collection records              |
| GET    | `/api/collections/:id` | Get collection records for a specific dustbin |
| POST   | `/api/collections`     | Add a new waste collection record             |

### Dashboard APIs

| Method | Endpoint               | Description                                    |
| ------ | ---------------------- | ---------------------------------------------- |
| GET    | `/api/dashboard/stats` | Get overall and area-wise dashboard statistics |

## Project Status

### Completed

- [x] Basic Express.js backend setup.
- [x] Dustbin management APIs.
- [x] Area-wise dustbin filtering.
- [x] Dustbin fill-level updates.
- [x] Historical fill-level reading APIs.
- [x] Waste collection management APIs.
- [x] Dashboard statistics API.
- [x] API testing using Postman.
- [x] MongoDB Atlas integration.
- [x] Mongoose database models.
- [x] Migration from temporary JavaScript data to MongoDB.

### In Progress

- [ ] Frontend-backend integration.

### Planned

- [ ] ESP32 / Arduino sensor integration.
- [ ] Real-time or periodic sensor readings.
- [ ] Automated dustbin fill-level monitoring.
- [ ] Alerts for dustbins requiring collection.
- [ ] Waste accumulation pattern analysis.

````md
### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

### Setup

Clone the repository and move into the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
```

Do not commit the `.env` file to GitHub. It is already included in `.gitignore`.

Start the backend:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`
````
