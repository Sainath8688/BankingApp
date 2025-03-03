import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios';

const CreateAccount = () => {

    const DefaultValues = {
        firstName: '',
        lastName:'',
        phoneNumber:'',
        email:'',
        accountBalance:'',
        accountNumber:'',
        accountType:'',
    }

    const [ userDetails, setUserDetails ] = useState(DefaultValues);
    const [ visible, setVisible ] = useState(true);
    const [ success, setSuccess ] = useState(false);

    const handleGenerateAccountNumber = () => {

        let account_Number = "";

        const nums = "0123456789";

        while( account_Number.length < 12 ){
            account_Number += Math.floor(Math.random() * nums.length);
        }

        if ( account_Number.toString().length === 12 ){
            setUserDetails({ ...userDetails, accountNumber: account_Number});
            setVisible(false);
        }
    }

    const handleUserFormSubmit = async (e) =>{

        e.preventDefault();

        if ( userDetails.firstName === " " || userDetails.accountNumber === "" || userDetails.accountBalance === "" || userDetails.email === "" || userDetails.lastName === "" || userDetails.phoneNumber === ""  ){
            alert(" Please Fill the required Fields !... "); 
            return;
        }
        else if( Number(userDetails.Balance) < 500){
            alert("Initial Deposit must be 500 and Please check the deposit value once what you entered!... ");
            return;
        }
        else if( userDetails.accountType === "" ){
            alert("Type of Account Must be Required");
            return;
        }
        else{
            const CheckNumber = /^\d{10}$/.test(userDetails.phoneNumber);
            const CheckFirstName = /^[A-Za-z\s]+$/.test(userDetails.firstName);
            const CheckLastName = /^[A-Za-z\s]+$/.test(userDetails.lastName);
            const CheckEmailID = /^[A-Za-z0-9._%+-]+@gmail\.com$/.test(userDetails.email);
            const CheckDeposit = /^\d+$/.test(userDetails.accountBalance);

            if ( !CheckNumber || !CheckFirstName || !CheckLastName || !CheckEmailID || !CheckDeposit){
                alert("Invalid input! Please check your details.");
                return;
            }
            console.log("success! works");
        }

        try{
            const response = await axios.post("http://localhost:8080/api/users", userDetails);
            if(response.status === 201){
                setSuccess(true);
                setUserDetails(DefaultValues);
                setVisible(true);
            }
        }
        catch(err){
            alert("Failed to create account. Please try again!....");
        }

    }

    useEffect(() => {
        if (success){
            const Timer = setTimeout(() => setSuccess(false), 4000);
            return () => clearTimeout(Timer)
        }
    }, [success]);

    return (
        <>  
            <div className='relative min-h-screen'>
                <motion.div 
                    className='relative top-24 text-white flex flex-col items-center justify-center'
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    <motion.h1 
                        className='font-semibold text-3xl tracking-wide'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay:0.5, ease: "easeOut" }}
                    >
                        Welcome New User
                    </motion.h1>
                    <label className="relative top-10 w-1/2 text-black">
                        <select
                            name="AccountType"
                            className="w-full px-4 py-2 border rounded-lg bg-white text-center text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent hover:cursor-pointer tracking-wide font-bold uppercase text-lg"
                            value={userDetails.accountType}
                            onChange={(e) => {setUserDetails({ ...userDetails, accountType: e.target.value})}}
                        >
                            <option value="" className='text-lg font-semibold' >-- Select Type of Account --</option>
                            <option value="savings" className='text-lg font-semibold'>Savings</option>
                            <option value="current" className='text-lg font-semibold'>Current</option>
                        </select>
                    </label>
                    <motion.form 
                        className='grid grid-cols-2 gap-14 relative top-20 w-1/2'
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay:1, ease: "easeOut" }}
                    >
                        <input 
                            type="text"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider'
                            placeholder='First Name'
                            value={userDetails.firstName}
                            onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value})}
                            required
                        />
                        <input 
                            type="text"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider'
                            placeholder='Last Name'
                            value={userDetails.lastName}
                            onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value})}
                            required
                        />
                        <input 
                            type="text"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider'
                            placeholder='Phone Number'
                            value={userDetails.phoneNumber}
                            onChange={(e) => setUserDetails({ ...userDetails, phoneNumber: e.target.value})}
                            required
                            maxLength={10}
                        />
                        <input 
                            type="email"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider'
                            placeholder='E-Mail'
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value})}
                            required
                        />
                        <input 
                            type="text"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none font-semibold focus:border-green-600 tracking-wider'
                            placeholder='Intial Deposit ( Min ₹500/-) '
                            value={userDetails.accountBalance}
                            onChange={(e) => setUserDetails({ ...userDetails, accountBalance: e.target.value})}
                            required
                        />
                        <input 
                            type="text"
                            className='text-xl px-2 py-2 border-b-2 bg-transparent focus:outline-none cursor-not-allowed font-semibold tracking-wider'
                            placeholder='Account Number'
                            readOnly
                            value={userDetails.accountNumber}
                            onChange={(e) => setUserDetails({ ...userDetails, accountNumber: e.target.value})}
                            required
                        />
                    </motion.form>
                    <motion.button 
                        type='submit' 
                        className='relative top-36 bg-green-500 w-1/6 h-12 text-xl cursor-pointer text-black font-semibold tracking-wider rounded-lg hover:bg-green-700 transition-all duration-100 transform'
                        initial={{ translateY: 10 }}
                        animate={{ translateX: 0 }}
                        transition={{ duration: 2, delay:2, ease: "easeInOut" }}
                        onClick={handleUserFormSubmit}
                    >
                        Create Account
                    </motion.button>
                    {
                        visible && (
                            <motion.button 
                                type='button'
                                className='relative left-1/3 bottom-6 bg-yellow-500 w-1/12 h-12 text-xl font-semibold text-black rounded-lg cursor-pointer tracking-widest hover:bg-yellow-700 transition-all duration-100 transform'
                                initial={{ translateX: -20 }}
                                animate={{ translateY: 0 }}
                                transition={{ duration: 2, delay:2, ease: "easeInOut" }}
                                onClick={handleGenerateAccountNumber}
                            >
                                G.A.N
                            </motion.button>
                        )
                    }
                    {
                        success && (
                            <motion.p
                                className='text-green-400 relative top-3 text-sm font-semibold tracking-wider'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {`your account is created successfully!`}
                            </motion.p>
                        )
                    }
                </motion.div>
            </div>
        </>
    );
}

export default CreateAccount;