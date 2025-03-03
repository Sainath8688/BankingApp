import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import axios from 'axios';

const Transactions = () => {
  const defaultTransferValues = {
    FromAccountNumber: '',
    ToAccountNumber: '',
  };

  const defaultTransferAmount = {
    Amount: '',
  };

  const [transferAccountNumbers, setTransferAccountNumbers] = useState(defaultTransferValues);
  const [TransferAmount, setTransferAmount] = useState(defaultTransferAmount);
  const [visible, setVisible] = useState(false);
  const [fromAccount, setFromAccount] = useState(null);
  const [toAccount, setToAccount] = useState(null);

  const handleTransfer = async (e) => {
    e.preventDefault();

    const fromAccountNum = transferAccountNumbers.FromAccountNumber.trim();
    const toAccountNum = transferAccountNumbers.ToAccountNumber.trim();

    if (!fromAccountNum || !toAccountNum) {
      alert("enter the fields first!...");
      return;
    }
    else if (fromAccountNum === toAccountNum) {
      alert('From and To Account Numbers are the same. Transfer is not allowed.');
      return;
    }
    else if (fromAccountNum.length !== 12) {
      alert(`${fromAccountNum} InValid Number. Please check the number once!...`);
      return;
    }
    else if (toAccountNum.length !== 12) {
      alert(`${toAccountNum} InValid Number. Please check the number once!...`);
      return;
    }

    try {
      const responeFromAccount = await axios.get(`http://localhost:8080/api/account_history/${fromAccountNum}`);
      console.log("From Account Number is Founded: ", responeFromAccount.data);
      const responseToAccount = await axios.get(`http://localhost:8080/api/account_history/${toAccountNum}`);
      console.log("To Account Number is Founded: ", responseToAccount.data);
      alert('Accounts validated. You can proceed with the transfer.');
      if (responeFromAccount.data && responseToAccount.data) {
        setFromAccount(responeFromAccount.data);
        setToAccount(responseToAccount.data);
      }
      setVisible(true);
    }

    catch (err) {
      alert("Account Numbers are not Founded Please check the number's again! ...")
    }
  };

  const handleAmount = async (e) => {
    e.preventDefault();

    if (!TransferAmount.Amount || isNaN(TransferAmount.Amount) || TransferAmount.Amount <= 0) {
      alert('Enter a valid transfer amount!');
      return;
    }

    if (fromAccount && toAccount) {
      if (parseFloat(fromAccount.accountBalance) >= parseFloat(TransferAmount.Amount)) {
        try {
          await axios.post(`http://localhost:8080/api/transfer/${fromAccount.AccountNumber}`, {
            accountBalance: parseFloat(fromAccount.accountBalance) - parseFloat(TransferAmount.Amount),
          });

          await axios.post(`http://localhost:8080/api/transfer/${toAccount.AccountNumber}`, {
            accountBalance: parseFloat(toAccount.accountBalance) + parseFloat(TransferAmount.Amount),
          });

          const transactionTime = new Date().toLocaleString();

          const fromTransactionDetails = {
            accountNumber: fromAccount.AccountNumber,
            DateTime: transactionTime,
            Amount: TransferAmount.Amount,
            Type: "Debit",
          };

          const toTransactionDetails = {
            accountNumber: toAccount.AccountNumber,
            DateTime: transactionTime,
            Amount: TransferAmount.Amount,
            Type: "Credit",
          };

          await axios.post("http://localhost:8080/api/transactions", fromTransactionDetails);
          await axios.post("http://localhost:8080/api/transactions", toTransactionDetails);
          alert("Transfer Successful!");

          setTransferAccountNumbers(defaultTransferValues);
          setTransferAmount(defaultTransferAmount);
          setFromAccount(null);
          setToAccount(null);
        } catch (error) {
          console.error("Error during transaction:", error);
          alert("Transaction failed. Please try again.");
        }
      } else {
        alert("Insufficient balance in From Account!");
      }
    } else {
      alert("Search accounts before transferring the amount.");
    }
  };

  const SwapAccountNumber = () => {
    setTransferAccountNumbers({
      FromAccountNumber: transferAccountNumbers.ToAccountNumber,
      ToAccountNumber: transferAccountNumbers.FromAccountNumber,
    });
  };

  return (
    <>
      <div className="relative text-white flex flex-col items-center justify-center top-14 w-screen">
        <h1 className="text-3xl font-semibold tracking-wide">Money Transfer</h1>
        <div className="flex flex-row justify-center relative top-16 space-x-20 w-full">
          <motion.input
            type="text"
            value={transferAccountNumbers.FromAccountNumber}
            onChange={(e) =>
              setTransferAccountNumbers({
                ...transferAccountNumbers,
                FromAccountNumber: e.target.value,
              })
            }
            placeholder="From Account Number"
            maxLength={12}
            className="text-xl px-4 py-2 w-1/4 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <SwapHorizRoundedIcon
            className="relative top-1 text-6xl border-4 border-white rounded-full px-2 cursor-pointer"
            fontSize=''
            onClick={SwapAccountNumber}
          />
          <motion.input
            type="text"
            value={transferAccountNumbers.ToAccountNumber}
            onChange={(e) =>
              setTransferAccountNumbers({
                ...transferAccountNumbers,
                ToAccountNumber: e.target.value,
              })
            }
            placeholder="To Account Number"
            maxLength={12}
            className="text-xl px-4 py-2 w-1/4 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider"
            whileFocus={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <motion.button
          type="button"
          onClick={handleTransfer}
          className="relative top-32 h-14 border-white border-2 w-1/6 cursor-pointer text-xl font-bold tracking-wider rounded-xl px-6 py-2 bg-blue-700 text-white hover:bg-blue-500 hover:text-black hover:border-black transition duration-300"
          whileHover={{ scale: 1.1 }}
        >
          Search Account
        </motion.button>
        {visible && (
          <motion.div
            className="flex flex-col relative items-center top-44 py-2 w-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.input
              type="text"
              value={TransferAmount.Amount}
              onChange={(e) =>
                setTransferAmount({ ...TransferAmount, Amount: e.target.value })
              }
              placeholder="Enter the Amount ₹ 1 /-"
              className="text-xl px-4 py-2 w-1/4 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider"
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.button
              type="button"
              onClick={handleAmount}
              className="h-14 relative top-10 bg-green-600 w-1/6 text-xl font-bold text-black tracking-wider rounded-xl hover:bg-green-900 cursor-pointer transition duration-500"
              whileHover={{ scale: 1.1 }}
            >
              Transfer Amount
            </motion.button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default Transactions;