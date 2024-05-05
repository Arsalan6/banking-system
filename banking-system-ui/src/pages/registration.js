import React, { useState, useEffect } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import customerService from '../services/customer.service';
import { isAuthenticated } from '../config/protectedRoute';

const ukPhoneRegex = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?#(\d{4}|\d{3}))?$/;

const registrationValidateSchema = Yup.object().shape({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  email: Yup.string().email("Please enter a valid email").required("This field is required"),
  phoneNumber: Yup.string().matches(ukPhoneRegex, 'Invalid Phone number'),
  password: Yup.string()
    .required("This field is required")
    .min(8, "Pasword must be 8 or more characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
    .matches(/\d/, "Password should contain at least one number")
    .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
  confirmPassword: Yup.string().when("password", (password, field) => {
    if (password) {
      return field.required("The passwords do not match").oneOf([Yup.ref("password")], "The passwords do not match");
    }
  }),
  termsAndConditions: Yup.boolean().oneOf([true], 'This field is required'),
});

const Registration = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated()) {
      return navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      termsAndConditions: false
    },
    validationSchema: registrationValidateSchema,
    validateOnBlur: true,
    onSubmit: (values, { setErrors }) => {
      setLoading(true);
      customerService.registerCustomer(values)
        .then(() => {
          toast.success("Customer registered successfully");
          navigate('/login');
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

    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create your new account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your first name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="First name" />
            {formik.errors.firstName ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.firstName}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your last name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Last name" />
            {formik.errors.lastName ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.lastName}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="name@company.com" />
            {formik.errors.email ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.email}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your phone number</label>
            <input
              type="phoneNumber"
              name="phoneNumber"
              id="phoneNumber"
              onChange={formik.handleChange}
              value={formik.values.phoneNumber}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="+44 117 2345678" />
            {formik.errors.phoneNumber ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.phoneNumber}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            {formik.errors.password ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.password}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            {formik.errors.confirmPassword ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.confirmPassword}</p>
            ) : null}
          </div>
          <div className="items-start">
            <div className='flex'>
              <div className="flex items-center h-5">
                <input
                  id="termsAndConditions"
                  aria-describedby="termsAndConditions"
                  name="termsAndConditions"
                  type="checkbox"
                  onChange={formik.handleChange}
                  value={formik.values.termsAndConditions}
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />

              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAndConditions" className="font-medium text-gray-900 dark:text-white">I accept the <Link to="/terms-and-conditions" className="text-primary-700 hover:underline dark:text-primary-500">Terms and Conditions</Link></label>
              </div>
            </div>
            <div>
              {formik.errors.termsAndConditions ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.termsAndConditions}</p>
              ) : null}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Register account"}</button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Already have an account? <Link to="/login" className="text-primary-700 hover:underline dark:text-primary-500">Login here</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registration
