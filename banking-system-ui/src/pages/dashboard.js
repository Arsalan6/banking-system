import React, { useState, useEffect } from 'react';
import accountService from '../services/account.service';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [totalDepositedAmount, setTotalDepositedAmount] = useState(0);
  const [customerAccounts, setCustomerAccounts] = useState([]);

  useEffect(() => {
    accountService.getAllAccounts()
      .then((response) => {
        const accounts = [...response.data];
        setCustomerAccounts(accounts);
        setTotalDepositedAmount(accounts.reduce((n, { currentAmount }) => n + currentAmount, 0))
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }, []);

  return (
    <>
      <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="w-full">
          <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Total deposited amount</h3>
          <span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{totalDepositedAmount} GBP</span>
        </div>
      </div>
      <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        {/* <!-- Card header --> */}
        <div class="items-center justify-between lg:flex">
          <div class="mb-4 lg:mb-0">
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Accounts</h3>
            <span class="text-base font-normal text-gray-500 dark:text-gray-400">List of acconunts owned by you</span>
          </div>
        </div>
        {/* <!-- Table --> */}
        <div class="flex flex-col mt-6">
          <div class="overflow-x-auto rounded-lg">
            <div class="inline-block min-w-full align-middle">
              <div class="overflow-hidden shadow sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                  <thead class="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Account Name
                      </th>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Opened at
                      </th>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Current Amount
                      </th>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Account number
                      </th>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Credit card issued
                      </th>
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Account Type
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800">
                    {customerAccounts.map((account, index) => {
                      return (
                        <tr className={`${index % 2 !== 0 ? "bg-gray-50 dark:bg-gray-700" : null}`}>
                          <td class="p-4 text-sm font-normal text-gray-900 whitespace-nowrap dark:text-white">
                            {account.name}
                          </td>
                          <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {new Date(account.createdAt).toDateString()}
                          </td>
                          <td class="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                            £{account.currentAmount}
                          </td>
                          <td class="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                            {account.number}

                          </td>
                          <td class="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                            {account.creditCardIssued ? 'Yes' : 'No'}
                          </td>
                          <td class="p-4 text-sm font-semibold text-gray-900 whitespace-nowrap dark:text-white">
                            {account.type}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;
