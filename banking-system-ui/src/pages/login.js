import React, { useState } from 'react';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

import customerService from '../services/customer.service';

const loginValidateSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email").required("This field is required"),
  password: Yup.string()
    .required("This field is required")
    .min(8, "Pasword must be 8 or more characters")
    .matches(/(?=.*[a-z])(?=.*[A-Z])\w+/, "Password ahould contain at least one uppercase and lowercase character")
    .matches(/\d/, "Password should contain at least one number")
    .matches(/[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/, "Password should contain at least one special character"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidateSchema,
    onSubmit: (values, { setErrors }) => {
      setLoading(true);
      customerService.loginCustomer(values)
        .then(() => {
          toast.success("Customer logged in successfully");
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
    <div className="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <div className="w-full max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in to platform
        </h2>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input type="email"
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
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input type="password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" />
            {formik.errors.password ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.password}</p>
            ) : null}
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="remember" aria-describedby="remember" name="remember" type="checkbox" className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="font-medium text-gray-900 dark:text-white">Remember me</label>
            </div>
            <Link to="/forgot-password" className="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500">Lost Password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 text-base font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
            {loading ? "Loading..." : "Login to your account"}</button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Not registered? <Link to="/registration" className="text-primary-700 hover:underline dark:text-primary-500 cursor-pointer">Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login