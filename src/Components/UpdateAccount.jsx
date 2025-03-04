import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const UpdateAccount = ({}) => {
  const [searchAccountNumber, setSearchAccountNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [edit, setEdit] = useState(false);
  const [updatedAccount, setUpdatedAccount] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    accountNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false); // Add a state variable for loading
  const [isUpdating, setIsUpdating] = useState(false);


  const handleSearchAccountNumber = async (e) => {
    e.preventDefault();

    if (!searchAccountNumber) {
      alert('enter the fields first!...');
      return;
    }
    setIsLoading(true);
    
    try {
      const response = await axios.get(
        `http://localhost:8080/api/modifyAccount/${searchAccountNumber}`
      );
      console.log('Response.data', response.data);
      setSearchResult(response.data[0]);
      setUpdatedAccount(response.data[0]);
      console.log('UpdatedAccount after update:', updatedAccount); // Debugging
      console.log('UpdatedAccount:', updatedAccount);
      setEdit(false);
    } catch (err) {
      setSearchResult('Account Not Found');
    } finally {
      setIsLoading(false); // Set loading to false regardless of success or failure
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAccount((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateAccount = async (e) => {
    e.preventDefault();

    const updatedData = {
      firstName: updatedAccount.firstName,
      lastName: updatedAccount.lastName,
      phoneNumber: updatedAccount.phoneNumber,
      email: updatedAccount.email,
    };

    setIsUpdating(true);
    try {
      await axios.put(
        `http://localhost:8080/api/updateAccount/${updatedAccount.accountNumber}`,
        updatedData
      );
      alert('Account Updated Successfully!');
      setSearchResult(updatedAccount);
      setEdit(false);
    } catch (err) {
      alert('Failed to Update Account!...');
      setSearchResult(null);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className='text-white relative top-14 flex flex-col items-center w-full'>
      <motion.h1
        className="text-3xl font-semibold tracking-wide"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Update Details
      </motion.h1>

      <motion.form
        onSubmit={handleSearchAccountNumber}
        className='flex flex-col w-full items-center justify-center mt-14 space-y-6'
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type='text'
          placeholder='Enter Account Number'
          value={searchAccountNumber}
          onChange={(e) => setSearchAccountNumber(e.target.value)}
          minLength={12}
          className="text-xl px-4 py-2 w-1/4 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider text-center"
        />
        <button
          type="submit"
          className='border-2 border-white w-1/6 h-12 text-2xl font-semibold tracking-wide rounded-xl backdrop-blur-lg transition-all duration-200 ease-linear cursor-pointer'
          disabled={isLoading}
        >
        {isLoading ? 'Searching...' : 'Search'} 
        </button>
      </motion.form>

      {searchResult && (
        <>
          {edit ? (
            <>
              <motion.form
                className="grid grid-cols-2 mt-16 gap-x-11 gap-y-10"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <label className='flex flex-col'>
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={updatedAccount.firstName || ''}
                    onChange={handleUpdateChange}
                    required
                    className="text-xl px-4 py-2 w-full border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider text-center"
                  />
                </label>
                <label className='flex flex-col'>
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={updatedAccount.lastName || ''}
                    onChange={handleUpdateChange}
                    required
                    className="text-xl px-4 py-2 w-full border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider text-center"
                  />
                </label>
                <label className='flex flex-col'>
                  Phone Number
                  <input
                    type="text"
                    name="phoneNumber"
                    value={updatedAccount.phoneNumber || ''}
                    onChange={handleUpdateChange}
                    required
                    className="text-xl px-4 py-2 w-full border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider text-center"
                  />
                </label>
                <label className='flex flex-col'>
                  Email
                  <input
                    type="email"
                    name="email"
                    value={updatedAccount.email || ''}
                    onChange={handleUpdateChange}
                    required
                    className="text-xl px-4 py-2 w-full border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider text-center"
                  />
                </label>
              </motion.form>
              <motion.button
                type="submit"
                onClick={handleUpdateAccount}
                disabled={
                  !updatedAccount.firstName ||
                  !updatedAccount.lastName ||
                  !updatedAccount.phoneNumber ||
                  !updatedAccount.email
                }
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
              {isUpdating ? 'Updating...' : 'Update'}
              </motion.button>
            </>
          ) : (
            <motion.div
              className="grid grid-cols-2 mt-16 gap-y-4 backdrop-blur-lg p-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className='text-base'>First Name: <span className="font-semibold text-2xl tracking-wide">{searchResult.firstName}</span></p>
              <p className='text-base'>Last Name: <span className="font-semibold text-2xl tracking-wide">{searchResult.lastName}</span></p>
              <p className='text-base'>Phone Number: <span className="font-semibold text-2xl tracking-wide">{searchResult.phoneNumber}</span></p>
              <p className='text-base'>E-Mail ID: <span className="font-semibold text-2xl tracking-wide">{searchResult.email}</span></p>
              <motion.button
                onClick={() => setEdit(true)}
                disabled={!searchResult}
                className={`px-4 py-2 rounded-lg w-1/12 text-xl font-semibold transition-all duration-200
                  ${searchResult ? 'bg-blue-400 text-black hover:bg-blue-700 hover:text-white' : 'bg-gray-500 cursor-not-allowed'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Edit
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdateAccount;