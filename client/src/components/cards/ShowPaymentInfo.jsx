import React from 'react';

export default function ShowPaymentInfo({ order, showStatus = true }) {
  return (
    <div style={{ wordWrap: 'break-word' }}>
      <p style={{ wordWrap: 'break-word' }}>
        <span>Order Id: {order.paymentIntent.id}</span>
        {', '}
        <span>
          Amount:{' '}
          {(order.paymentIntent.amount /= 100).toLocaleString('en-us', {
            style: 'currency',
            currency: 'USD',
          })}
        </span>
        {', '}
        <span>Currency: {order.paymentIntent.currency.toUpperCase()}</span>
        {', '}
        <span>Method: {order.paymentIntent.payment_method_types[0]}</span>
        {', '}
        <span>Payment: {order.paymentIntent.status.toUpperCase()}</span>
        {', '}
        <span>
          Orderd on:{' '}
          {new Date(order.paymentIntent.created * 1000).toLocaleString()}
        </span>
        {', '}
        <br />
        {showStatus && (
          <span className="badge bg-primary text-white">
            STATUS: {order.orderStatus}
          </span>
        )}
      </p>
    </div>
  );
}
