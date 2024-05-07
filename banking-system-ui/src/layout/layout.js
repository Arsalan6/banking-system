import React from 'react';
import Sidebar from '../layout/sidebar';
import Navbar from '../layout/navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {

  return (
    <>
      <Navbar />
      <div class="flex pt-16 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div id="main-content" class="relative w-full h-screen overflow-y-auto bg-gray-50 lg:ml-64 dark:bg-gray-900">
          <main className=''>
            <div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

export default Layout;
