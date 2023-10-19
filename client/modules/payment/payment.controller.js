const Razorpay = require("razorpay");
const Payment = require("../../../models/payment.model");
const razorpay = new Razorpay({
  key_id: "rzp_test_B9Kp1l2gfycDVq",
  key_secret: "KzcI3MkqmPeeK7mJkbsMaGuF",
});

// const options = {
//   amount: 50000, // Amount in paise
//   currency: "INR",
//   receipt: "order_rcptid_11",
//   payment_capture: 1,
// };

async function createpayment(req, res) {
  // const { amount } = req.body;

  const options = {
    amount: 20 * 100, // Razorpay expects amount in paise
    currency: "INR",
  };

  try {
    const response = await razorpay.orders.create(options);
    const payments = new Payment({
      razorpay_order_id: response.id,
      amount: response.amount,
      status: response.status,
    });
    await payments.save();
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
}
async function details(req, res) {
  const payment = await Payment.find();
  res.send({
    payment,
  });
}
module.exports = {
  createpayment,
  details,
};
