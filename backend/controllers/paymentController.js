const { message } = require('statuses');
const db = require('../config/db');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-checkout-session
exports.createCheckoutSession = async (req, res) => {
    console.log("BODY PLAN ID:", req.body.plan_id);

    const memberUserId = req.user.id;
    const { plan_id } = req.body;

    if (!plan_id) {
        return res.status(400).json({
            message: "plan_id is required"
        });
    }

    try {
        // Validate Plan
        const [planRows] = await db.execute(
            `SELECT id, price, plan_name
            FROM plans
            WHERE id = ? AND status = 'active'`,
            [plan_id]
        );

        if (planRows.length === 0) {
            return res.status(404).json({
                message: "Selected plan not found or inactive."
            });
        }

        const { price, plan_name } = planRows[0];

        // Insert pending payment
        const [paymentResult] = await db.execute(
            `INSERT INTO payments
            (member_id, enrollment_id, plan_id, amount, payment_method, status)
            VALUES (?, NULL, ?, ?, 'Stripe', 'pending')`,
            [memberUserId, plan_id, price]
        );

        const paymentId = paymentResult.insertId;

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: plan_name
                        },
                        unit_amount: price * 100 // Stripe uses paise
                    },
                    quantity: 1
                }
            ], 
            metadata: {
                payment_id: paymentId,
                member_id: memberUserId,
                plan_id: plan_id
            },
            success_url: "http://gym-management-frontend-anuja.s3-website.eu-north-1.amazonaws.com/payment-success",
            cancel_url: "http://gym-management-frontend-anuja.s3-website.eu-north-1.amazonaws.com/payment-cancel"
        });

        res.status(200).json({
            checkoutUrl: session.url
        });
    } catch (error) {
        console.error("Create checkout session error:", error);
        res.status(500).json({
            message: "Server error while creating checkout session",
            error: error.message
        });
    }
};

exports.handleStripeWebhook = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const paymentId = session.metadata.payment_id;
    const memberId = session.metadata.member_id;
    const planId = session.metadata.plan_id;
    const stripePaymentIntentId = session.payment_intent;

    try {
      // 1️⃣ Update payments table
      await db.execute(
        `UPDATE payments
         SET status = 'success',
             stripe_payment_id = ?
         WHERE id = ?`,
        [stripePaymentIntentId, paymentId]
      );

      // 2️⃣ Get plan duration + amount
      const [planRows] = await db.execute(
        `SELECT duration_months, price
         FROM plans
         WHERE id = ?`,
        [planId]
      );

      if (planRows.length === 0) {
        throw new Error("Plan not found");
      }

      const { duration_months, price } = planRows[0];

      // 3️⃣ Calculate start & end dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + duration_months);

      const formattedStart = startDate.toISOString().split("T")[0];
      const formattedEnd = endDate.toISOString().split("T")[0];

      // 4️⃣ Insert new enrollment
      await db.execute(
        `INSERT INTO member_plan_enrollment
         (member_id, plan_id, start_date, end_date, total_amount, payment_status)
         VALUES (?, ?, ?, ?, ?, 'paid')`,
        [memberId, planId, formattedStart, formattedEnd, price]
      );

      console.log(
        `Payment ${paymentId} successful & enrollment created for member ${memberId}`
      );

    } catch (error) {
      console.error("Webhook DB error:", error);
      return res.status(500).json({ error: "Database update failed" });
    }
  }

  res.status(200).json({ received: true });
};

