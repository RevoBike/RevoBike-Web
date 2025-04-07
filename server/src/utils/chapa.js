const axios = require("axios");

const CHAPA_BASE_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;

exports.initiateChapaPayment = async (payload) => {
  const config = {
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET}`,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(
    `${CHAPA_BASE_URL}/transaction/initialize`,
    payload,
    config
  );

  return response.data.data.checkout_url;
};

exports.verifyChapaPayment = async (tx_ref) => {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
            Authorization: `Bearer ${process.env.CHAPA_SECRET}`,
        },
    });

    return response.data;
};
