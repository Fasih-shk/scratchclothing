'use client';

import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Swal from 'sweetalert2';

export default function MyPayPalButton({ totalPrice }) {
  // Format the price securely
  const formattedPrice = Number(totalPrice).toFixed(2).toString();

  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
  };

  return (
    <div style={{ width: '100%', minHeight: '45px' }}>
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect", color: "gold", label: "paypal" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "GBP",
                    value: formattedPrice,
                  },
                  description: "Scratch Clothing Purchase",
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            try {
              const details = await actions.order.capture();
              const name = details.payer.name.given_name;
              
              Swal.fire({
                title: 'Payment Successful!',
                text: `Thank you for your purchase, ${name}! Your order via PayPal has been processed.`,
                icon: 'success',
                confirmButtonText: 'Great!',
                confirmButtonColor: '#6366f1' // Matches your brand buttons
              });
            } catch (error) {
              console.error("PayPal Capture Error", error);
              Swal.fire({
                title: 'Capture Failed',
                text: 'We could not capture your PayPal payment.',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#ef4444'
              });
            }
          }}
          onError={(err) => {
            console.error("PayPal Error", err);
            Swal.fire({
              title: 'Oops...',
              text: 'An error occurred with PayPal.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#ef4444'
            });
          }}
        />
      </PayPalScriptProvider>
    </div>
  );
}
