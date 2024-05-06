import React, { useState, useEffect } from 'react';
import customerService from '../services/customer.service';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";

const updateAccountValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
});

const updatePasswordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("This field is required")
    .min(8, "Pasword must be 8 or more characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
    .matches(/\d/, "Password should contain at least one number")
    .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
  newPassword: Yup.string()
    .required("This field is required")
    .min(8, "Pasword must be 8 or more characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
    .matches(/\d/, "Password should contain at least one number")
    .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
  confirmNewPassword: Yup.string().when("newPassword", (newPassword, field) => {
    if (newPassword) {
      return field.required("The passwords do not match").oneOf([Yup.ref("newPassword")], "The passwords do not match");
    }
  }),
});

const EditProfilePage = () => {
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

  const formikProfile = useFormik({
    initialValues: {
      firstName: customerDetails.firstName,
      lastName: customerDetails.lastName,
    },
    validationSchema: updateAccountValidationSchema,
    validateOnBlur: true,
    enableReinitialize: true,
    onSubmit: (values, { setErrors }) => {
    },
  });

  const formikPassword = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: updatePasswordValidationSchema,
    validateOnBlur: true,
    onSubmit: (values, { setErrors }) => {
    },
  });

  return (
    <>
      <div class="col-span-2">
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 class="mb-4 text-xl font-semibold dark:text-white">Edit Profile</h3>
          <form onSubmit={formikProfile.handleSubmit}>
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input
                  onChange={formikProfile.handleChange}
                  value={formikProfile.values.firstName}
                  type="text"
                  name="firstName"
                  id="firstName"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="First name" />
                {formikProfile.errors.firstName ? (
                  <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikProfile.errors.firstName}</p>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                <input
                  onChange={formikProfile.handleChange}
                  value={formikProfile.values.lastName}
                  type="text"
                  name="lastName"
                  id="lastName"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Last name" />
                {formikProfile.errors.lastName ? (
                  <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikProfile.errors.lastName}</p>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input value={customerDetails.email} type="text" id="disabled-input" aria-label="disabled input" class="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" disabled />
              </div>
              <div class="col-span-6 sm:col-full">
                <button
                  type="submit"
                  disabled={loading}
                  class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Update Profile"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="col-span-2 pt-6">
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h3 class="mb-4 text-xl font-semibold dark:text-white">Update password</h3>
          <form onSubmit={formikPassword.handleSubmit}>
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-6 sm:col-span-3">
                <label for="currentPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current password</label>
                <input
                  onChange={formikPassword.handleChange}
                  value={formikPassword.values.currentPassword}
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                {formikPassword.errors.currentPassword ? (
                  <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikPassword.errors.currentPassword}</p>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label for="confirmNewPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
                <input
                  onChange={formikPassword.handleChange}
                  value={formikPassword.values.newPassword}
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                {formikPassword.errors.newPassword ? (
                  <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikPassword.errors.newPassword}</p>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label for="confirmNewPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm new password</label>
                <input
                  onChange={formikPassword.handleChange}
                  value={formikPassword.values.confirmNewPassword}
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
                {formikPassword.errors.confirmNewPassword ? (
                  <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formikPassword.errors.confirmNewPassword}</p>
                ) : null}
              </div>
              <div class="col-span-6 sm:col-full">
                <button
                  type="submit"
                  disabled={loading}
                  class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Update Password"}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditProfilePage;
