# 📊 SQL Query Performance Testing

## 🖥️ Environment Setup

- **Database**: `sms`
- **Access Methods**:
  - `before using index`
  - `after using index`

---

## ⚡ Performance Comparison (Approximate Execution Time)

| Query No. | Description                                | without index (sec)| with index (sec) |
|-----------|--------------------------------------------|------------------|-------------|
| 1         | List software with developer & category    | 0.33070850             |N/A        |
| 2         | Top 3 highest-rated software               | 2.53213975            | N/A        |
| 3         | Transactions by specific customer          | 0.00816775            | N/A        |
| 4         | Software never reviewed                    | 0.01827650            | N/A         |
| 5         | Total revenue per software                 | 0.18746800            | N/A        |
| 6         | Customers spending > $100                  | 0.18746800            | N/A        |
| 7         | Most recent review per software            | N/A           | 1.4         |
| 8         | Developers with > 2 software products      | 0.05372300             |N/A       |
| 9         | Average rating per category                | 3.89167775         | N/A          |
| 10        | Customers and software reviewed            | 0.03432375             |N/A        |

---
