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
    return response.data;
}

/**
 * Register a new customer
 * @param customerDetailsObj
 * @returns response
 */
async function registerCustomer(customerDetailsObj) {
    const response = await axios.post(`${constants.API_BASE_URL}/customer`, customerDetailsObj);
    return response.data;
}

/**
 * Fetches logged in customer details
 * @param customerDetailsObj
 * @returns response
 */
async function getCustomerDetails() {
    const response = await axios.get(`${constants.API_BASE_URL}/customer`, { headers: { "Authorization": localStorage.getItem("customerToken") } });
    return response.data;
}

/**
 * Updates logged in customer details
 * @param customerDetailsObj
 * @returns response
 */
async function updateCustomerDetails(customerDetailsObj) {
    const response = await axios.patch(`${constants.API_BASE_URL}/customer`, customerDetailsObj, { headers: { "Authorization": localStorage.getItem("customerToken") } });
    return response.data;
}

const customerService = {
    loginCustomer,
    registerCustomer,
    getCustomerDetails,
    updateCustomerDetails,
};

export default customerService;
