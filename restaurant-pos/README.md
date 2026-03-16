# 🍽️ RestoPOS — Restaurant Point of Sale

Full-stack POS system built with **React + Node.js + MongoDB**.

---

## 📁 Project Structure

```
restaurant-pos/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Company.js          # Company info model
│   │   ├── Group.js            # Product groups
│   │   ├── Department.js       # Product departments
│   │   ├── Product.js          # Products/menu items
│   │   ├── TableCustomer.js    # Tables & Customers
│   │   └── Bill.js             # Bills/orders
│   ├── routes/
│   │   ├── auth.js             # Login, seed, me
│   │   ├── users.js            # User CRUD
│   │   ├── master.js           # Company/Group/Dept/Product/Table/Customer
│   │   ├── bills.js            # Bill CRUD
│   │   └── reports.js          # Sales reports
│   ├── .env                    # Environment variables
│   ├── server.js               # Express app entry
│   └── package.json
│
├── frontend/                   # React app
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── UI.jsx      # Shared UI components (Btn, Input, Card, Table, Modal...)
│       │   │   └── Layout.jsx  # App shell with sidebar
│       │   └── master/
│       │       └── MasterList.jsx   # Reusable list+detail layout
│       ├── context/
│       │   └── AuthContext.jsx # Auth state + login/logout
│       ├── hooks/
│       │   └── useFetch.js     # Generic data fetching hook
│       ├── pages/
│       │   ├── LoginPage.jsx   # Login screen
│       │   ├── BillingPage.jsx # Billing/POS screen
│       │   ├── MasterPage.jsx  # Company/Groups/Depts/Products/Tables/Customers
│       │   ├── ReportsPage.jsx # All sales reports
│       │   ├── OptionsPage.jsx # Settings & printer config
│       │   └── UsersPage.jsx   # User management & permissions
│       ├── services/
│       │   └── api.js          # Axios API calls
│       ├── utils/
│       │   └── theme.js        # Design tokens / color palette
│       ├── App.jsx             # Routing
│       └── index.js            # Entry point
└── package.json                # Root scripts with concurrently
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally on port 27017 (or update `.env`)

### 1. Install all dependencies
```bash
npm install          # installs concurrently
npm run install:all  # installs backend + frontend deps
```

### 2. Configure environment
Edit `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/restaurant_pos
JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Start development servers
```bash
npm run dev
```
This starts:
- Backend API at http://localhost:5000
- Frontend at http://localhost:3000

### 4. Create admin user (first time only)
```bash
# While backend is running:
curl -X POST http://localhost:5000/api/auth/seed
```
Or visit: http://localhost:5000/api/auth/seed (POST)

### 5. Login
- Username: `ADMIN`
- Password: `admin123`

---

## 🔑 Key Features

| Screen | Features |
|--------|----------|
| **Billing** | 3 simultaneous bills, table/waiter selection, product grid, KOT save, final bill, discount/reduction |
| **Master** | Company info, Groups, Departments, Products, Tables, Customers |
| **Reports** | Bill-wise, Item-wise, Salesman-wise, Group-wise, Time-wise, Tax report |
| **Options** | Billing display config, bill numbering, round-off, printer setup, templates |
| **Users** | Create users, set menu permissions, bill-level permissions |

## 🎨 Design Choices
- **Clean blue + white palette** — easy to read in bright kitchen/restaurant environments
- **Dark sidebar** with clearly active states
- **Color-coded actions**: blue = primary, green = success/save, red = danger/delete, orange = warning
- Non-veg items marked with red left-border on product cards, veg with teal

## 🛠 Tech Stack
- **Frontend**: React 18, React Router 6, Axios
- **Backend**: Node.js, Express 4, JWT auth, bcryptjs
- **Database**: MongoDB with Mongoose ODM
- **Design**: Pure inline CSS with a centralized theme system (no CSS framework)
