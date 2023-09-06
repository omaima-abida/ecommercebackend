const express=require('express');
const router = express.Router();
const stripe = require ('stripe');
const Stripe =
stripe('sk_test_51NnLsxABW8vhFgzVxcW8Zsn6oZqYVq610WTcp1BRjVvxQHz2sVM04nwpBhnJRFsxLV46pBKDohAidOP7IrKwtOU000PCMnuglK');
router.post('/', async (req, res) => {
let status, error;
const { token, amount } = req.body;
try {
await Stripe.charges.create({
source: token.id,
amount,
currency: 'usd',
});
status = 'success';
} catch (error) {
console.log(error);
status = 'Failure';
}
res.json({ error, status });
});
module.exports = router;
