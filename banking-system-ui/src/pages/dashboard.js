import React, { useState, useEffect } from 'react';
import accountService from '../services/account.service';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import transcationService from '../services/transcation.service';
import { constants } from '../constants/constants';

const depositAmountValidationSchema = Yup.object().shape({
  depositAmount: Yup.number()
    .min(1, "Must be more than 0")
    .required("This field is required"),
});

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showCloseAccModal, setShowCloseAccModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({});
  const [totalDepositedAmount, setTotalDepositedAmount] = useState(0);
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const navigate = useNavigate();

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

  const handleShowDepositModal = (selectedAccIdx) => {
    setShowDepositModal(true);
    setSelectedAccount(customerAccounts[selectedAccIdx]);
  }

  const handleShowCloseAccModal = (selectedAccountIdx) => {
    setShowCloseAccModal(true);
  }

  const formik = useFormik({
    initialValues: {
      depositAmount: 0,
    },
    validationSchema: depositAmountValidationSchema,
    onSubmit: (values, { setErrors }) => {
      setLoading(true);
      transcationService.generateTranscation({
        accountId: selectedAccount.id,
        transactionType: constants.transcationType.credit,
        transactionAmount: values.depositAmount,
      })
        .then(() => {
          toast.success("Amount deposit successfully");
          setShowDepositModal(false);
          navigate(0);
        })
        .catch((error) => {
          setErrors(error)
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <>
      <div class="items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:flex dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="w-full">
          <h3 class="text-base font-normal text-gray-500 dark:text-gray-400">Total deposited amount</h3>
          <span class="text-2xl font-bold leading-none text-gray-900 sm:text-3xl dark:text-white">{totalDepositedAmount} GBP</span>
        </div>
      </div>

      <div class="mt-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <div class="items-center justify-between lg:flex">
          <div class="mb-4 lg:mb-0">
            <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">Accounts</h3>
            <span class="text-base font-normal text-gray-500 dark:text-gray-400">List of accounts owned by you</span>
          </div>
        </div>

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
                      <th scope="col" class="p-4 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800">
                    {customerAccounts.map((account, index) => {
                      return (
                        <tr key={index} className={`${index % 2 !== 0 ? "bg-gray-50 dark:bg-gray-700" : null}`}>
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
                          <td class="p-4 space-x-2 whitespace-nowrap">
                            <button type="button" onClick={() => handleShowDepositModal(index)} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                              <svg class="w-[18px] h-[18px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                              </svg>
                              <span class="ml-2">Deposit</span>
                            </button>
                            <button type="button" onClick={() => handleShowCloseAccModal(index)} class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900">
                              <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                              Close
                            </button>
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

      {showDepositModal ? (
        <div class="flex justify-center dark:bg-gray-900/70 fixed left-0 right-0 z-50 items-center justify-cente overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full" id="edit-user-modal">
          <div class="relative w-full h-full max-w-2xl px-4 md:h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
              <div class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-700">
                <h3 class="text-xl font-semibold dark:text-white">
                  Deposit Money
                </h3>
                <button type="button" onClick={() => setShowDepositModal(false)} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white" data-modal-toggle="edit-user-modal">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div class="p-6 space-y-6">
                  <div class="grid grid-cols-6 gap-6">
                    <div class="col-span-6">
                      <label for="accountName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Name</label>
                      <input value={selectedAccount.name} disabled type="text" name="accountName" id="accountName" class="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label for="accountNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Number</label>
                      <input type="accountNumber" disabled name="accountNumber" value={selectedAccount.number} id="accountNumber" class="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="example@company.com" />
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label for="accountType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Type</label>
                      <input type="text" disabled name="accountType" value={selectedAccount.type} id="accountType" class="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="e.g. React developer" />
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label for="creditCardIssued" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Credit card Issued</label>
                      <input type="text" disabled name="creditCardIssued" value={selectedAccount.creditCardIssued ? "Yes" : "No"} id="creditCardIssued" class="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="••••••••" required />
                    </div>
                    <div class="col-span-6 sm:col-span-3">
                      <label for="debitCardIssued" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Debit card Issued</label>
                      <input type="text" disabled name="debitCardIssued" value={selectedAccount.debitCardIssued ? "Yes" : "No"} id="debitCardIssued" class="cursor-not-allowed shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="••••••••" required />
                    </div>
                    <div class="col-span-6">
                      <label for="depositAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Deposit Amount</label>
                      <input
                        type="number"
                        name="depositAmount"
                        id="depositAmount"
                        onChange={formik.handleChange}
                        value={formik.values.depositAmount}
                        class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                      {formik.errors.depositAmount ? (
                        <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.depositAmount}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div class="items-center p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
                  <button
                    type="submit"
                    disabled={loading}
                    class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Deposit"}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}


      {showCloseAccModal ? (
        <div class="flex justify-center dark:bg-gray-900/70 fixed left-0 right-0 z-50 items-center justify-cente overflow-x-hidden overflow-y-auto top-4 md:inset-0 h-modal sm:h-full" id="edit-user-modal">
          <div class="relative w-full h-full max-w-2xl px-4 md:h-auto">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
              <div class="flex items-start items-center justify-between p-5 border-b rounded-t dark:border-gray-700">
                <svg class="w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>

                <h3 class="text-xl font-semibold dark:text-white ml-2">
                  Close account permanently
                </h3>
                <button type="button" onClick={() => setShowCloseAccModal(false)} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white" data-modal-toggle="edit-user-modal">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                </button>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div class="p-6 space-y-6">
                  <h3 class="text-lg text-gray-500 dark:text-gray-400">Are you sure you want to close this account permanently?</h3>
                </div>
                <div class="flex items-center justify-between p-6 border-t border-gray-200 rounded-b dark:border-gray-700">
                  <button onClick={() => setShowCloseAccModal(false)} class="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 border border-gray-200 font-medium inline-flex items-center rounded-lg text-sm px-3 py-2.5 text-center dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700" data-drawer-hide="drawer-delete-product-default">
                    No, cancel
                  </button>
                  <button class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-3 py-2.5 text-center mr-2 dark:focus:ring-red-900">
                    Yes, I'm sure
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Dashboard;
