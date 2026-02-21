# ExpertSync Frontend

A premium, modern React application for booking professional expert sessions.

## Functionalities
- **Global Search**: Search for experts directly from the navigation bar.
- **Real-time Availability**: Instant feedback on booked slots with Socket.IO.
- **Responsive Layout**: Responsive for desktop, tablet, and mobile browsers.
- **Guest Bookings**: Simplified booking flow without forced authentication.

## 🛠 Tech Stack
- **Framework**: Vite
- **Styling**:  CSS3 
- **API Client**: Axios to communicate with the backend

## Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Oguntayo/expert_sync_frontend.git
   cd expert_sync_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   cp .env.example .env
   
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

**Live url** https://expertsyncfrontend.vercel.app/