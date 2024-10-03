"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
   const [response, setResponse] = useState([]);
   const [orders, setOrders] = useState([
      { type: "order", customerName: "Alex Abe", orderId: "1", date: "2023-07-11", product: "Product A", price: 1.23 },
      { type: "order", customerName: "Brian Ben", orderId: "2", date: "2023-08-08", product: "Product B", price: 3.21 },
   ]);
   const [transactions, setTransactions] = useState([
      { type: "txn", customerName: "Alex Abe", orderId: "1", date: "2023-07-11", product: "Product A", price: 1.23, transactionType: "paymentReceived", transactionDate: "2023-07-12", transactionAmount: 1.23 },
      { type: "txn", customerName: "Alex Abe", orderId: "1", date: "2023-07-11", product: "Product A", price: 1.23, transactionType: "refundIssued", transactionDate: "2023-07-13", transactionAmount: -1.23 },
      { type: "txn", customerName: "Brian Ben", orderId: "2", date: "2023-08-08", product: "Product B", price: 3.21, transactionType: "payment-1", transactionDate: "2023-08-11", transactionAmount: 1.21 },
      { type: "txn", customerName: "Brian Ben", orderId: "2", date: "2023-08-08", product: "Product B", price: 3.21, transactionType: "payment-2", transactionDate: "2023-08-13", transactionAmount: 2.0 },
   ]);
   const submitData = async () => {
      try {
         if (!Array.isArray(orders) || !Array.isArray(transactions)) {
            alert("Not Incorrect format");
            return;
         }
         const data = {
            orders: orders,
            transactions: transactions,
         };
         const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/match`, data);
         if (response.data) {
            setResponse(response.data);
         }
      } catch (error) {
         console.error("Failed to submit data:", error);
      }
   };

   const ApproveHandler = async (id) => {
      try {
         const data = {
            status: true,
         };
         const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/status/${id}`, data);
         console.log(response);
         
      } catch (error) {
         console.error("Failed to submit data:", error);
      }
   };
   useEffect(()=> {

   }, [response])
   return (
      <div className="py-10 max-w-[1200px] mx-auto">
         <h2 className="text-center text-lg font-bold pb-10">Match Transactions</h2>

         <div className="flex justify-evenly align-top">
            <div className="min-w-[400px]">
               <p className="text-base font-bold">Orders Input</p>
               <textarea className="bg-slate-100 w-full px-3" rows={10} defaultValue={JSON.stringify(orders, null, 2)} onChange={(e) => setOrders(JSON.parse(e.target.value))}></textarea>
               <p className="text-base font-bold">Transactions Input</p>
               <textarea className="bg-slate-100 w-full px-3" rows={10} defaultValue={JSON.stringify(transactions, null, 2)} onChange={(e) => setTransactions(JSON.parse(e.target.value))}></textarea>
               <button className="px-10 py-3 bg-cyan-400 text-white rounded-lg" onClick={() => submitData()}>
                  Submit
               </button>
            </div>
            <div className="w-full text-center px-10">
               <p className="text-base font-bold">Results {response.length > 0 && response.length} match</p>
               <section className="grid grid-cols-1 gap-y-3 divide-y">
                  {response.length > 0 &&
                     response.map((item, key) => (
                        <details className="group py-1 text-lg" key={key}>
                           <summary className="flex cursor-pointer flex-row items-center justify-between py-1 font-semibold text-gray-800 marker:[font-size:0px]">
                              CustomerName: {item[0].type === "order" && item[0].customerName}
                              <svg className="h-6 w-6 rotate-0 transform text-gray-400 group-open:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                              </svg>
                           </summary>
                           <p className="text-gray-500">
                                 {item.map((data, index) => {
                                    const { _id, ...filteredData } = data;
                                    return (
                                       <div key={index}>
                                          <summary className="flex cursor-pointer flex-row items-center justify-between py-1 font-semibold text-gray-800 marker:[font-size:0px]">
                                             Type: {data.type}, CustomerName: {data.customerName}
                                          </summary>
                                          <p className="text-gray-500">
                                             <textarea
                                                readOnly
                                                value={JSON.stringify(filteredData, null, 2)} // Filtered data without _id
                                                className="w-full"
                                                rows={8}
                                             />
                                          </p>
                                          {typeof _id === "string" && (
                                             <button className="px-10 py-3 bg-cyan-400 text-white rounded-lg" onClick={() => ApproveHandler(_id)}>
                                                Approve
                                             </button>
                                          )}
                                       </div>
                                    );
                                 })}
                           </p>
                        </details>
                     ))}
               </section>
            </div>
         </div>
      </div>
   );
}
