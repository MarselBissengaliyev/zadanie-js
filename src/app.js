const express = require('express');
const dotenv = require('dotenv');
const amoRoutes = require('./routes/amoRoutes');

dotenv.config();

const app = express();

// Подключение маршрутов
app.use('/api/amo', amoRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
