const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // 引入cors
const connectDB = require('./config/db'); // 引入数据库连接函数

const documentRoutes = require('./routes/documentRoutes');
const toolRoutes = require('./routes/toolRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors()); // 使用cors中间件

// Routes

app.use('/api/documents', documentRoutes);
app.use('/api/tools', toolRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));