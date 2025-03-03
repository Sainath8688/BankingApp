import axios from 'axios';
import React, { useState } from 'react'

const UpdateAccount = () => {

  const [account, setaccount] = useState([]);
  const [accountNumber, setAccountNumber] = useState('');

  const handleSearch = async () => {

    if (accountNumber === "") {
      alert("Enter the Account Number first");
    }
    else if (accountNumber.length !== 12) {
      alert("Account Number must be 12 digits");
    }
    else {
      try {
        const response = await axios.get(`http://localhost:8080/api/modifyAccount/${accountNumber}`);
        console("Data: " + response.data);
        setaccount(response.data);
      }
      catch (err) {
        alert("Account not found");
        setaccount([]);
      }
    }
    setAccountNumber('');
  }

  return (
    <>
      <div className='relative text-white'>
        <h1>update account</h1>
        <div>
          <label>
            <input
              type='text'
              placeholder='Enter Account Number'
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              max={length = 12}
              required
              className='text-white outline-none bg-transparent border-b-2'
            />
          </label>
          <button
            onClick={handleSearch}
          >
            Search Account
          </button>
        </div>
        <div>
          {
            account.map((acc, index) => (
              <div key={index}>
                <p>First Name: {acc.firstName}</p>
                <p>Last Name: {acc.lastName}</p>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default UpdateAccount