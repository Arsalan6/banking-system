// Third party imports
import axios from 'axios';

// Importing app dependencies
import { constants } from '../constants/constants';

/**
 * Logs in a customer
 * @param customerCredentails
 * @returns response
 */
async function loginCustomer(customerCredentails) {
    const response = await axios.post(`${constants.API_BASE_URL}/customer/login`, customerCredentails);
    return response.data.data;
}

const customerService = {
    loginCustomer,
};

export default customerService;
