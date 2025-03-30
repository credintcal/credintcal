import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_39QG2VCC5qc2Wp',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'GgcoqvoGxKzGqCAYbSnIZhdV',
});

export default razorpay; 