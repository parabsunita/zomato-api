const Razorpay = require("razorpay");
const knex = require("../../config/knex");
const Payment = require("../../../models/payment.model");

async function razorpayWebhook(req, res) {
  let body = req.body;
  let received_signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  console.log(body.payload.payment.entity);
  console.log(secret);
  var isValid = Razorpay.validateWebhookSignature(
    JSON.stringify(body),
    received_signature,
    secret
  );

  if (!isValid) {
    console.log("Invalid signature");
    res.json({ status: "ok" });
    return;
  }

  let orderId = body.payload.payment.entity.notes.order_id;

  await knex("orders").update({ status: "confirmed" }).where("id", orderId);
  await Payment;

  console.log(orderId);

  res.json();
}

module.exports = razorpayWebhook;
