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
| 1         | List software with developer & category    | 0.00191600              | 0.02362550         |
| 2         | Top 3 highest-rated software               | 1.27821425              | 1.29301925         |
| 3         | Transactions by specific customer          | 0.00065200              | 0.00073750         |
| 4         | Software never reviewed                    | 0.00939575              | 0.01421875         |
| 5         | Total revenue per software                 | 0.17798775              | 0.28466825         |
| 6         | Customers spending > $100                  | 0.77100850              | 1.27042275         |
| 7         | Most recent review per software            | 0.00105025              | 0.00721425         |
| 8         | Developers with > 2 software products      | 0.02367650              | 0.02975025         |
| 9         | Average rating per category                | 1.33978420           | 1.44254300          |
| 10        | Customers and software reviewed            | 0.01018125              | 0.02597625         |

---
