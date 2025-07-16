const pl = require('nodejs-polars');
const path = require('path');

async function generateSampleData() {
  try {
    // 创建示例销售数据
    const salesData = pl.DataFrame({
      'id': Array.from({ length: 10000 }, (_, i) => i + 1),
      'product': Array.from({ length: 10000 }, (_, i) => 
        ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headphones'][i % 5]
      ),
      'category': Array.from({ length: 10000 }, (_, i) => 
        ['Electronics', 'Accessories', 'Peripherals'][i % 3]
      ),
      'price': Array.from({ length: 10000 }, () => Math.round(Math.random() * 1000 + 50)),
      'quantity': Array.from({ length: 10000 }, () => Math.floor(Math.random() * 50) + 1),
      'date': Array.from({ length: 10000 }, (_, i) => {
        const date = new Date(2024, 0, 1);
        date.setDate(date.getDate() + (i % 365));
        return date.toISOString().split('T')[0];
      }),
      'sales_rep': Array.from({ length: 10000 }, (_, i) => 
        ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'][i % 5]
      ),
      'region': Array.from({ length: 10000 }, (_, i) => 
        ['North', 'South', 'East', 'West', 'Central'][i % 5]
      )
    });

    // 计算总销售额
    const salesWithRevenue = salesData.withColumn(
      pl.col('price').mul(pl.col('quantity')).alias('revenue')
    );

    // 保存为parquet文件
    const outputPath = path.join(__dirname, '..', 'data', 'sales-data.parquet');
    await salesWithRevenue.writeParquet(outputPath);
    
    console.log('Sample sales data generated successfully!');
    console.log(`File saved to: ${outputPath}`);
    console.log(`Records: ${salesData.height}`);
    console.log(`Columns: ${salesData.columns}`);
    
    // 创建用户数据
    const userData = pl.DataFrame({
      'user_id': Array.from({ length: 5000 }, (_, i) => i + 1),
      'name': Array.from({ length: 5000 }, (_, i) => `User_${i + 1}`),
      'email': Array.from({ length: 5000 }, (_, i) => `user${i + 1}@example.com`),
      'age': Array.from({ length: 5000 }, () => Math.floor(Math.random() * 60) + 18),
      'signup_date': Array.from({ length: 5000 }, (_, i) => {
        const date = new Date(2023, 0, 1);
        date.setDate(date.getDate() + (i % 365));
        return date.toISOString().split('T')[0];
      }),
      'subscription_type': Array.from({ length: 5000 }, (_, i) => 
        ['Free', 'Premium', 'Enterprise'][i % 3]
      ),
      'monthly_spend': Array.from({ length: 5000 }, () => Math.round(Math.random() * 200)),
      'country': Array.from({ length: 5000 }, (_, i) => 
        ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan'][i % 6]
      )
    });

    const userOutputPath = path.join(__dirname, '..', 'data', 'user-data.parquet');
    await userData.writeParquet(userOutputPath);
    
    console.log('Sample user data generated successfully!');
    console.log(`File saved to: ${userOutputPath}`);
    console.log(`Records: ${userData.height}`);
    
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
}

generateSampleData();