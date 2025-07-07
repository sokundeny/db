# 📊 SQL Query Performance Testing

## 🖥️ Environment Setup

- **Database**: `sms`
- **MySQL Server**: Installed locally on PC
- **Access Methods**:
  - `localhost`: Direct connection to MySQL server on local machine
  - `ngrok`: Tunnel connection to expose local MySQL server to the internet

---

## ⚡ Performance Comparison (Approximate Execution Time)

| Query No. | Description                                | Localhost (sec) | Ngrok (sec) |
|-----------|--------------------------------------------|------------------|-------------|
| 1         | List software with developer & category    | 0.2              | 1.1         |
| 2         | Top 3 highest-rated software               | 0.3              | 1.3         |
| 3         | Transactions by specific customer          | 0.2              | 1.0         |
| 4         | Software never reviewed                    | 0.2              | 1.0         |
| 5         | Total revenue per software                 | 0.3              | 1.2         |
| 6         | Customers spending > $100                  | 0.3              | 1.1         |
| 7         | Most recent review per software            | 0.4              | 1.4         |
| 8         | Developers with > 2 software products      | 0.2              | 1.0         |
| 9         | Average rating per category                | 0.3              | 1.2         |
| 10        | Customers and software reviewed            | 0.4              | 1.3         |

---
