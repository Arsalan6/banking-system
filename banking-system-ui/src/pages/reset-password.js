import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from "formik";
import * as Yup from "yup";
import customerService from '../services/customer.service';
import { useNavigate, useSearchParams } from 'react-router-dom';

const resetPasswordValidationSchema = Yup.object().shape({
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: resetPasswordValidationSchema,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log(values);
      setLoading(true);
      customerService.resetPassword({ ...values, id: searchParams.get("id") })
        .then(() => {
          toast.success("Password reset successfully");
          navigate('/login');
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
      <div class="w-full max-w-xl p-6 space-y-8 bg-white rounded-lg shadow sm:p-8 dark:bg-gray-800">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
          Reset your password
        </h2>
        <form class="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div>
            <label for="newPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New password</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              placeholder="••••••••"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
            {formik.errors.newPassword ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.newPassword}</p>
            ) : null}
          </div>
          <div>
            <label for="confirmNewPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              id="confirmNewPassword"
              placeholder="••••••••"
              onChange={formik.handleChange}
              value={formik.values.confirmNewPassword}
              class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" required />
            {formik.errors.confirmNewPassword ? (
              <p id="outlined_error_help" className="mt-2 text-xs text-red-600 dark:text-red-400">{formik.errors.confirmNewPassword}</p>
            ) : null}
          </div>
          <button
            type="submit"
            disabled={loading}
            class="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">{loading ? "Loading..." : "Reset Password"}</button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword;

