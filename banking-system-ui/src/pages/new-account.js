import React, { useState, useEffect } from 'react';
import customerService from '../services/customer.service';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import accountService from '../services/account.service';

const createAccountValidationSchema = Yup.object().shape({
  accountName: Yup.string().required("This field is required"),
  accountType: Yup.string().required("This field is required"),
});

const NewAccountPage = () => {
  const navigate = useNavigate();
  const [customerDetails, setCustomerDetails] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    customerService.getCustomerDetails()
      .then((response) => {
        setCustomerDetails({ ...response.data })
      })
      .catch((error) => {
        toast.error("Something went wrong");
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      accountName: "",
      accountType: "PERSONAL",
    },
    validationSchema: createAccountValidationSchema,
    validateOnBlur: true,
    onSubmit: (values, { setErrors }) => {
      setLoading(true);
      accountService.createAccount(values)
        .then(() => {
          toast.success("Account created successfully");
          navigate('/dashboard');
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
    <div class="col-span-2">
      <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
        <h3 class="mb-4 text-xl font-semibold dark:text-white">Open new account</h3>
        <form onSubmit={formik.handleSubmit}>

          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
              <input value={customerDetails.firstName} type="text" id="disabled-input" aria-label="disabled input" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
              <input value={customerDetails.lastName} type="text" id="disabled-input" aria-label="disabled input" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input value={customerDetails.email} type="text" id="disabled-input" aria-label="disabled input" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="phoneNumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone number</label>
              <input value={customerDetails.phoneNumber} type="text" id="disabled-input" aria-label="disabled input" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="accountName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account name</label>
              <input
                type="text"
                name="accountName"
                id="accountName"
                onChange={formik.handleChange}
                value={formik.values.accountName}
                class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Account Name" />
              {formik.errors.accountName ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.accountName}</p>
              ) : null}
            </div>
            <div class="col-span-6 sm:col-span-3">
              <label for="accountType" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account type</label>
              <select
                type="text"
                id="accountType"
                name='accountType'
                onChange={formik.handleChange}
                value={formik.values.accountType}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
              </select>
              {formik.errors.accountType ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.accountType}</p>
              ) : null}
            </div>
            <div class="col-span-6 sm:col-full">
              <button
                type="submit"
                disabled={loading}
                class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Open new account"}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewAccountPage

