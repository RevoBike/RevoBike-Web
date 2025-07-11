const axios = require("axios");
require("dotenv").config();

const CHAPA_BASE_URL = "https://api.chapa.co/v1";
const CHAPA_SECRET = process.env.CHAPA_SECRET_KEY;

exports.initiateChapaPayment = async (payload) => {
  const config = {
    headers: {
      Authorization: `Bearer ${CHAPA_SECRET}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      payload,
      config
    );

    if (response.data.status !== "success") {
      throw new Error("Failed to initiate payment with Chapa");
    }

    return response.data.data.checkout_url;
  } catch (error) {
    if (error.response) {
      console.error("Chapa API error:", error.response.data);
    }
    throw error;
  }
};

exports.verifyChapaPayment = async (tx_ref) => {
  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET}`,
        },
      }
    );

    if (response.data.status !== "success") {
      throw new Error("Failed to verify payment with Chapa");
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Chapa verify API error:", error.response.data);
    } else {
      console.error("Chapa verify error:", error.message);
    }
    throw error;
  }
};
