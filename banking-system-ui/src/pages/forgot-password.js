import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";
import customerService from '../services/customer.service';

const forgotPasswordValidationSchema = Yup.object().shape({
  email: Yup.string().email("Please enter a valid email").required("This field is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordValidationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      setLoading(true);
      customerService.sendResetPasswordEmail(values)
        .then(() => {
          toast.success("Forgot password email sent successfully");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div class="flex flex-col items-center justify-center px-6 pt-8 mx-auto md:h-screen pt:mt-0 dark:bg-gray-900">
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
        <div class="w-full p-6 sm:p-8">
          <h2 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Forgot your password?
          </h2>
          <p class="text-base font-normal text-gray-500 dark:text-gray-400">
            Don't panic! Simply enter your email address, and we'll send you a link to reset your password.
          </p>
          <form class="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="name@company.com" required />
              {formik.errors.email ? (
                <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.email}</p>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={loading}
              class="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
              {loading ? "Loading..." : "Reset password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword;

