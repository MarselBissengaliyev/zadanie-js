const amoService = require('../services/amoService');

const findOrCreateContact = async (req, res) => {
    try {
        // Извлечение параметров из запроса
        const { name, email, phone } = req.query;

        // Вызов метода сервиса для поиска или создания контакта
        const result = await amoService.findOrCreateContact(name, email, phone);

        // Отправка ответа
        res.json(result);
    } catch (error) {
        console.error('AmoCRM controller error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { findOrCreateContact };
