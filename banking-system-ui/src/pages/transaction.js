import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import transcationService from '../services/transcation.service';

const Transaction = () => {
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [serachParams, setSearchParams] = useState('');

  useEffect(() => {
    fetchAllTransactions(serachParams);
  }, [serachParams]);


  const fetchAllTransactions = (params) => {
    transcationService.getAllTransactions(params)
      .then((response) => {
        const receivedTransaction = response.data.transactions.map((t) => {
          return {
            ...t,
            accountNumber: response.data.accounts.find((acc) => acc.id === t.accountId).number,
          }
        });
        setCustomerTransactions(receivedTransaction)
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
      });
  }

  const handleSearchParamsChange = (e) => {
    setSearchParams(e.target.value);
  }

  return (
    <>
      <div class="rounded-t-lg p-4 bg-white block sm:flex items-center justify-between border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="w-full mb-1">
          <div class="mb-4">
            <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">All transactions</h1>
          </div>
          <div class="sm:flex">
            <div class="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
              <form class="lg:pr-3">
                <label for="searchParams" class="sr-only">Search</label>
                <div class="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    value={serachParams}
                    onChange={(e) => handleSearchParamsChange(e)}
                    name="searchParams"
                    id="searchParams"
                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search for transactions" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden shadow">
              <table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead class="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Account Number
                    </th>
                    <th scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Amount
                    </th>
                    <th scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Type
                    </th>
                    <th scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {customerTransactions.map((transaction) => {
                    return (
                      <tr class="hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">{transaction.accountNumber}</td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          £{transaction.amount}
                        </td>
                        <td class="max-w-sm p-4 overflow-hidden text-base font-normal text-gray-500 truncate xl:max-w-xs dark:text-gray-400">{new Date(transaction.createdAt).toDateString()}</td>
                        <td class="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">{transaction.type}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end rounded-b-lg sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-center mb-4 sm:mb-0">
          <span class="text-sm font-normal text-gray-500 dark:text-gray-400">Showing <span class="font-semibold text-gray-900 dark:text-white">1-20</span> of <span class="font-semibold text-gray-900 dark:text-white">{customerTransactions.length}</span></span>
          <button class="ml-2 inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          </button>
          <button class="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
          </button>
        </div>
      </div >
    </>
  )
}

export default Transaction;

