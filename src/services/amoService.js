const amoModel = require('../models/amoModel');

const findOrCreateContact = async (name, email, phone) => {
    try {
        // Аутентификация и получение токена
        const accessToken = await amoModel.authenticate();

        // Поиск контакта по email и/или телефону
        let contact = await amoModel.findContact(email, phone, accessToken);

        // Если контакт не найден, создаем новый
        if (!contact) {
            contact = await amoModel.createContact(name, email, phone, accessToken);
        }

        // Логика для создания сделки
        const deal = await amoModel.createDeal(contact.id, accessToken);

        // Возвращение результата
        return { success: true, contact, deal: deal };
    } catch (error) {
        console.log(error);
        console.error('AmoCRM service error:', error.message);
        throw error;
    }
};

module.exports = { findOrCreateContact };
