# 🌍 CauseSphere

CauseSphere is a transparent fundraising platform built using the MERN stack (MongoDB, Express, React, Node.js). It connects donors directly with individuals or NGOs in need, ensuring trust, traceability, and real-time insights into every campaign.

---

## 🚀 Features

### 👤 Authentication
- JWT-based login/signup
- Google OAuth integration (optional)
- Single user can act as both donor and fundraiser

---

### 📢 Campaign Management
- Multi-step fundraiser creation form:
  1. Basic Info
  2. Campaign Details
  3. Bank Details
  4. Document Upload
- Campaign lifecycle:
  - Draft → Pending → Approved → Active

---

### ✅ Verification System
- Admin approval before campaign goes live
- Document validation (ID, medical proof, etc.)
- Verified badge for trusted campaigns

---

### 💳 Donation System
- Payment gateway integration (Razorpay test mode)
- Secure transaction tracking (no fake receipts)
- Each donation linked with:
  - Payment ID
  - Order ID
  - Campaign ID

---

### 📊 Dashboard & Analytics
#### Fundraiser Dashboard:
- Total funds raised
- Daily donation graph
- Recent donors list
- Campaign updates

#### Donor Dashboard:
- Donation history
- Downloadable receipts

---

### 📄 Receipt Generation
- Auto-generated PDF receipts
- Includes donor info, campaign details, and transaction ID

---

### 🔍 Campaign Browsing
- Filter by category (Hunger, Medical, Climate, Disaster, Animals)
- Search functionality
- Featured campaigns

---

### 🔔 Notifications (Optional)
- Donation confirmation
- Campaign updates

---

## 🧠 MongoDB Concepts Used

- **CRUD Operations**
- **Indexing**
  - email
  - category
  - campaignId
  - createdAt
- **Aggregation Pipelines**
  - Total donations per campaign
  - Daily donation trends
  - Top campaigns
- **Array Operations**
  - `$push` (add updates/donors)
  - `$pop` (remove last update)
  - `$pull` (remove specific donor)
- **Sharding (Conceptual)**
  - Partition by `campaignId`

---

## 🏗️ Tech Stack

### Frontend
- React.js
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB

### Payment
- Razorpay (Test Mode)

---

## 📂 Project Structure
