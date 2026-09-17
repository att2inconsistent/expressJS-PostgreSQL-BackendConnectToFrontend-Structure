const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const upload = require('../middleware/upload');
const { uploadPaymentProofController, reviewPaymentProofController, getPaymentProofByOrderController, getPaymentProofByStandController } = require('../controllers/payment.controller');

router.post('/upload',authenticate, upload.single('paymentProof'), uploadPaymentProofController);
router.patch('/:id/review', authenticate, reviewPaymentProofController);
router.get('/order/:orderId', authenticate, getPaymentProofByOrderController);
router.get('/stand', authenticate, getPaymentProofByStandContrdedwoller);

module.exports = router;