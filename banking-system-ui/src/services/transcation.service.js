// Third party imports
import axios from 'axios';

// Importing app dependencies
import { constants } from '../constants/constants';

/**
 * Generates new transcation for customer
 * @param transcationObj
 * @returns response
 */
async function generateTranscation(transcationObj) {
    const response = await axios.post(`${constants.API_BASE_URL}/transcation`, transcationObj, { headers: {"Authorization" : localStorage.getItem("customerToken")} });
    return response.data;
}

/**
 * Fetches all transactions for logged in customer
 * @param searchParams
 * @returns response
 */
async function getAllTransactions(searchParams) {
    const response = await axios.get(`${constants.API_BASE_URL}/transcation?q=${searchParams}`, { headers: { "Authorization": localStorage.getItem("customerToken") } });
    return response.data;
}

/**
 * Transfer funds from one account to another
 * @param transferFundsObj
 * @returns response
 */
async function transferFunds(transferFundsObj) {
    const response = await axios.post(`${constants.API_BASE_URL}/transcation/transfer`, transferFundsObj, { headers: { "Authorization": localStorage.getItem("customerToken") } });
    return response.data;
}

const transcationService = {
    generateTranscation,
    getAllTransactions,
    transferFunds,
};

export default transcationService;
