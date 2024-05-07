import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";
import accountService from '../services/account.service';
import transcationService from '../services/transcation.service';

const fetchAccDetailsValidationSchema = Yup.object().shape({
  donorAccount: Yup.string().required("This field is required"),
  recipientAccountNumber: Yup.number()
    .test('len', 'Must be exactly 8 digits', val => val && val.toString().length === 8)
    .required("This field is required")
});

const transferAmountValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  accountName: Yup.string().required("This field is required"),
  phoneNumber: Yup.string().required("This field is required"),
  transferAmount: Yup.number()
    .min(1, "Must be more than 0")
    .required("This field is required"),
});

const TransferMoney = () => {
  const [customerAccounts, setCustomerAccounts] = useState([]);
  const [transferAmountloading, setTransferAmountloading] = useState(false);
  const [fetchAccLoading, setFetchAccLoading] = useState(false);
  const [recipientAccountDetails, setRecipientAccountDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    accountName: '',
    uuid: '',
  });

  useEffect(() => {
    fetchAllAccounts();
  }, []);
  const fetchAllAccounts = () => {
    accountService.getAllAccounts()
      .then((response) => {
        const accounts = [...response.data];
        setCustomerAccounts(accounts);
      })
      .catch(() => {
        toast.error("Something went wrong");
      });
  }

  const formikFetchAcc = useFormik({
    initialValues: {
      donorAccount: customerAccounts[0]?.uuid,
      recipientAccountNumber: null
    },
    validationSchema: fetchAccDetailsValidationSchema,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      setFetchAccLoading(true);
      accountService.getAccByUuid(values.recipientAccountNumber)
        .then((response) => {
          toast.success("Account details fetched successfully");
          setRecipientAccountDetails({
            firstName: response.data.Customer.firstName,
            lastName: response.data.Customer.lastName,
            phoneNumber: response.data.Customer.phoneNumber,
            accountName: response.data.name,
            uuid: response.data.uuid,
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setFetchAccLoading(false);
        });
    },
  });

  const formikTransferAmount = useFormik({
    initialValues: {
      ...recipientAccountDetails,
      transferAmount: 0,
    },
    validationSchema: transferAmountValidationSchema,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      setTransferAmountloading(true);
      transcationService.transferFunds({
        recipientId: values.uuid,
        donorId: formikFetchAcc.values.donorAccount,
        transactionAmount: values.transferAmount,
      })
        .then(() => {
          toast.success("Amount transferred successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setTransferAmountloading(false);
        });
    },
  });

  return (
    <div class="px-4 pt-6 col-span-2">
      <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">Interbank Transfer</h3>
        <form onSubmit={formikFetchAcc.handleSubmit}>
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6">
              <label for="donorAccount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Donor Account</label>
              <select
                type="text"
                id="donorAccount"
                name='donorAccount'
                onChange={formikFetchAcc.handleChange}
                value={formikFetchAcc.values.donorAccount}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                {customerAccounts.map((account, idx) =>
                  <option key={idx} value={account.uuid}>{account.name}</option>
                )}
              </select>
            </div>
            <div class="col-span-6">
              <label htmlFor="recipientAccountNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipient Account</label>
              <input
                type="number"
                name="recipientAccountNumber"
                id="recipientAccountNumber"
                onChange={formikFetchAcc.handleChange}
                value={formikFetchAcc.values.recipientAccountNumber}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Enter recipient account number" />
              {formikFetchAcc.errors.recipientAccountNumber ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikFetchAcc.errors.recipientAccountNumber}</p>
              ) : null}
            </div>
            <div class="col-span-6 flex ">
              <button
                type="submit"
                disabled={fetchAccLoading}
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-7 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{fetchAccLoading ? "Loading..." : "Fetch account details"}</button>
            </div>
          </div>
        </form>
        <form onSubmit={formikTransferAmount.handleSubmit}>
          <div class="grid grid-cols-6 gap-6 mt-6">
            <div class="col-span-3">
              <label for="Reci" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipient first name</label>
              <input
                value={recipientAccountDetails.firstName}
                onChange={formikTransferAmount.handleChange}
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
              {formikTransferAmount.errors.firstName ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikTransferAmount.errors.firstName}</p>
              ) : null}
            </div>
            <div class="col-span-3">
              <label for="accountNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Recipient first name</label>
              <input
                value={recipientAccountDetails.lastName}
                onChange={formikTransferAmount.handleChange}
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
              {formikTransferAmount.errors.lastName ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikTransferAmount.errors.lastName}</p>
              ) : null}
            </div>
            <div class="col-span-3">
              <label for="Reci" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account name</label>
              <input
                value={recipientAccountDetails.accountName}
                onChange={formikTransferAmount.handleChange}
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
              {formikTransferAmount.errors.accountName ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikTransferAmount.errors.accountName}</p>
              ) : null}
            </div>
            <div class="col-span-3">
              <label for="accountNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
              <input
                value={recipientAccountDetails.phoneNumber}
                onChange={formikTransferAmount.handleChange}
                type="text"
                id="disabled-input"
                aria-label="disabled input"
                class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
              {formikTransferAmount.errors.phoneNumber ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikTransferAmount.errors.phoneNumber}</p>
              ) : null}
            </div>
            <div class="col-span-6">
              <label for="transferAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Transfer Amount</label>
              <input
                type="number"
                name="transferAmount"
                id="transferAmount"
                onChange={formikTransferAmount.handleChange}
                value={formikTransferAmount.values.transferAmount}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
              {formikTransferAmount.errors.transferAmount ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikTransferAmount.errors.transferAmount}</p>
              ) : null}
            </div>
            <div class="col-span-6 sm:col-full">
              <button
                type="submit"
                disabled={transferAmountloading}
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{transferAmountloading ? "Loading..." : "Transfer amount"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferMoney

