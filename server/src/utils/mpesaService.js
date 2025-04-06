const axios = require("axios");
require("dotenv").config();

exports.getMpesaToken = async () => {
    try {
        const { data } = await axios.get(
            `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
            {
                auth: {
                    username: process.env.MPESA_CONSUMER_KEY,
                    password: process.env.MPESA_CONSUMER_SECRET,
                },
            }
        );
        return data.access_token;
    } catch (error) {
        console.error("M-Pesa Token Error:", error.response ? error.response.data : error.message);
        throw new Error("Failed to generate M-Pesa token");
    }
};
