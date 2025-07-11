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
| 1         | List software with developer & category    | 0.33070850             |0.03140200        |
| 2         | Top 3 highest-rated software               | 2.53213975            | 1.20761700        |
| 3         | Transactions by specific customer          | 0.00816775            | 0.00164225        |
| 4         | Software never reviewed                    | 0.01827650            | 0.00622725       |
| 5         | Total revenue per software                 | 0.18746800            | 0.00904400        |
| 6         | Customers spending > $100                  | 0.73573750            | 0.25402650       |
| 7         | Most recent review per software            | 0.00493275          | 0.00130825       |
| 8         | Developers with > 2 software products      | 0.05372300             |0.03268175    |
| 9         | Average rating per category                | 3.89167775         | 2.74425975          |
| 10        | Customers and software reviewed            | 0.10017475             | 0.01069050      |

---
