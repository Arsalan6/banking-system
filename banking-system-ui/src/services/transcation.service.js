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

const transcationService = {
    generateTranscation,
};

export default transcationService;
