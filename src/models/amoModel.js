const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const AMOCRM_API_URL = 'https://marselbisengaliev1.amocrm.ru'; // Замени на URL своего аккаунта AmoCRM

// Функция для аутентификации и получения токена
const authenticate = async () => {
    try {
        const response = await axios.post(
            `${AMOCRM_API_URL}/oauth2/access_token`,
            {
                client_id: process.env.AMOCRM_CLIENT_ID,
                client_secret: process.env.AMOCRM_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: process.env.AMOCRM_AUTHORIZATION_CODE,
                redirect_uri: process.env.AMOCRM_REDIRECT_URI,
            }
        );

        return response.data.access_token;
    } catch (error) {
        console.error('AmoCRM authentication error:', error.message);
        throw error;
    }
};

// Функция для поиска контакта по email и/или телефону
const findContact = async (email, phone, accessToken) => {
    try {
        const response = await axios.get(
            `${AMOCRM_API_URL}/api/v4/contacts`,
            {
                params: {
                    query: email ? `email:${email}` : phone ? `phone:${phone}` : null,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (response.data._embedded && response.data._embedded.contacts.length > 0) {
            return response.data._embedded.contacts[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('AmoCRM findContact error:', error.message);
        throw error;
    }
};

// Функция для создания контакта
const createContact = async (name, email, phone, accessToken) => {
    try {
        const response = await axios.post(
            `${AMOCRM_API_URL}/api/v4/contacts`,
            {
                name,
                custom_fields_values: [
                    {
                        field_id: process.env.AMOCRM_PHONE_FIELD_ID, // Замени на ID поля телефона в AmoCRM
                        values: [{ value: phone }],
                    },
                    {
                        field_id: process.env.AMOCRM_EMAIL_FIELD_ID, // Замени на ID поля email в AmoCRM
                        values: [{ value: email }],
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('AmoCRM createContact error:', error.message);
        throw error;
    }
};

const createDeal = async (contactId, accessToken) => {
    try {
        const response = await axios.post(
            `${AMOCRM_API_URL}/api/v4/leads`,
            {
                name: ['Название сделки'],
                contacts_id: [contactId]
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data._embedded.leads[0];
    } catch (error) {
        console.error('AmoCRM createDeal error:', error.message);
        throw error;
    }
};

// Функция для обновления статуса сделки
const updateDealStatus = async (dealId, newStatus, accessToken) => {
    try {
        const response = await axios.patch(
            `${AMOCRM_API_URL}/api/v4/leads/${dealId}`,
            {
                status_id: 1, // Замени на ID нового статуса воронки
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('AmoCRM updateDealStatus error:', error.message);
        throw error;
    }
};

module.exports = { authenticate, findContact, createContact, createDeal, updateDealStatus };
