// Third party imports
import axios from 'axios';

// Importing app dependencies
import { constants } from '../constants/constants';

/**
 * Creates new account for customer
 * @param accountObj
 * @returns response
 */
async function createAccount(accountObj) {
    const response = await axios.post(`${constants.API_BASE_URL}/account`, accountObj, { headers: {"Authorization" : localStorage.getItem("customerToken")} });
    return response.data;
}

/**
 * Fetches all accounts for logged in customer
 * @returns response
 */
async function getAllAccounts(accountObj) {
    const response = await axios.get(`${constants.API_BASE_URL}/account`, { headers: {"Authorization" : localStorage.getItem("customerToken")} });
    return response.data;
}

/**
 * Delets account by uuid
 * @returns response
 */
async function deleteAccByUuid(accountUuid) {
    const response = await axios.delete(`${constants.API_BASE_URL}/account/${accountUuid}`, { headers: {"Authorization" : localStorage.getItem("customerToken")} });
    return response.data;
}

const accountService = {
    createAccount,
    getAllAccounts,
    deleteAccByUuid,
};

export default accountService;
