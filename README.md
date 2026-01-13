# 📚 Library Management System – Client–Server Architecture

## 📋 Project Information
- **Student Name:** นายศุภโชค แสงจันทร์  
- **Student ID:** 67543210066-6  
- **Course:** ENGSE207 Software Architecture  

---

## 🖥️ Architecture Style
**Client–Server Architecture**  
(Backend API + Frontend Web Client)

---

## 🧩 System Overview

ระบบนี้ถูกออกแบบตามสถาปัตยกรรม **Client–Server** โดยแยกความรับผิดชอบของระบบออกเป็น 2 ส่วนหลัก:

- **Client (Frontend):**  
  เว็บแอปพลิเคชันสำหรับผู้ใช้งาน ทำหน้าที่แสดงผล UI และเรียกใช้งาน API
- **Server (Backend):**  
  RESTful API ทำหน้าที่ประมวลผล Business Logic และจัดการฐานข้อมูล

การสื่อสารระหว่าง Client และ Server ใช้ **HTTP + JSON** ผ่าน REST API

---

## 📂 Project Structure
```text
midterm-individual-67543210066-6/
├── src/ # Backend (Server)
│ ├── presentation/ # HTTP Layer
│ │ ├── routes/
│ │ │ └── bookRoutes.js
│ │ ├── controllers/
│ │ │ └── bookController.js
│ │ └── middlewares/
│ │ └── errorHandler.js
│ │
│ ├── business/ # Business Logic Layer
│ │ ├── services/
│ │ │ └── bookService.js
│ │ └── validators/
│ │ └── bookValidator.js
│ │
│ └── data/ # Data Access Layer
│ ├── repositories/
│ │ └── bookRepository.js
│ └── database/
│ └── connection.js
│
├── public/ # Frontend (Client)
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ ├── api.js # API Client (Fetch Wrapper)
│ │ └── app.js # UI & Application Logic
│ └── index.html
│
├── server.js # Server Entry Point
├── package.json
├── package-lock.json
├── library.db # SQLite Database
└── README.md
```


---

## 🔄 Client–Server Interaction Flow

1. ผู้ใช้โต้ตอบกับ **Frontend (Browser)**
2. Frontend ส่ง HTTP Request ไปยัง Backend API  
   - `GET /api/books`
   - `POST /api/books`
   - `PUT /api/books/:id`
   - `PATCH /api/books/:id/borrow`
   - `DELETE /api/books/:id`
3. Backend ประมวลผล Request ผ่าน:
   - Routes → Controllers → Services → Repository
4. Backend ส่ง Response (JSON) กลับไปยัง Client
5. Frontend อัปเดต UI ตามข้อมูลที่ได้รับ

---

## 🎯 Refactoring Summary

### ปัญหาก่อน Refactoring
1. Frontend และ Backend ผูกกันแน่น (Coupling สูง)
2. Business Logic ปนกับ HTTP Handling
3. โค้ดขยายยาก และดูแลรักษาลำบาก
4. ไม่รองรับการแยก Client ไปอยู่คนละเครื่อง

---

### แนวทางแก้ไขด้วย Client–Server Architecture

1. แยก **Frontend (Client)** ออกจาก **Backend (Server)** อย่างชัดเจน  
2. Backend ทำหน้าที่เป็น **REST API Provider**  
3. Frontend ติดต่อ Backend ผ่าน **Fetch API**  
4. เพิ่ม **CORS Middleware** เพื่อรองรับ Client จากหลาย origin  
5. Backend รองรับการรันบน VM / Server จริง (`0.0.0.0`)

---

### ประโยชน์ที่ได้รับ

1. Frontend และ Backend พัฒนาแยกกันได้  
2. รองรับการขยายระบบในอนาคต (Mobile App / Other Client)  
3. โค้ดอ่านง่าย มีโครงสร้างชัดเจน  
4. ทดสอบ API ได้อิสระด้วย Postman / curl  
5. สอดคล้องกับสถาปัตยกรรมระบบจริงในอุตสาหกรรม

---
## 🚀 How to Run
```bash
# 1. Clone repository
git clone https://github.com/Jta003/midterm-BONUS-67543210066.git

# 2. Install dependencies
npm install

# 3. Run server
npm start
```

## 📡 API Endpoints

| Method | Endpoint                |Description            | Request Body (JSON) |
|--------|-------------------------|-----------------------|-------------------|
| GET    | `/api/books`            | Get all books         | -                 |
| GET    | `/api/books/:id`        | Get book by ID        | -                 |
| POST   | `/api/books`            | Create a new book     | `{"title":"Book 1","author":"Author 1","isbn":"1234567890","status":"available"}` |
| PUT    | `/api/books/:id`        | Update book info      | `{"title":"Updated Title","author":"New Author","isbn":"0987654321","status":"borrowed"}` |
| PATCH  | `/api/books/:id/status` | Update book status    | `{"status":"available"}` |
| DELETE | `/api/books/:id`        | Delete a book         | -                 |

