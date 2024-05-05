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

const accountService = {
    createAccount,
};

export default accountService;
