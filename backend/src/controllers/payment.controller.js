const { createPaymentProof, updatePaymentProofStatus, findPaymentProofById, getPaymentProofByOrder, getPaymentProofByStand } = require('../db/queries/paymentProof.queries');
const { findOrderById, markOrderAsPaid} = require('../db/queries/order.queries');
const { getActiveAssignmentBySeller } = require('../db/queries/standAssignment.queries');

async function uploadPaymentProofController(req,res, next) {
    try{
        const { orderId} = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const customerId = req.user.id;
        const order = await findOrderById(orderId);
        if(!order || order.user_id !== customerId){
            return res.status(403).json({ error: 'Order does not belong to the customer' });
        }
        const imgUrl = req.file.path
        const paymentProof = await createPaymentProof(orderId, imgUrl);
        return res.status(201).json({ message: 'Payment proof uploaded successfully', paymentProof });
    }catch(error){
        next(error);
    }
}
async function reviewPaymentProofController(req,res,next) {
    try{
        const proofId = req.params.id;
        const { status } = req.body;
        if (!['pending','approved','rejected'].includes(req.body.status)){
                return res.status(400).json({error: status})
        }
        const paymentProof = await findPaymentProofById(proofId);
        if(!paymentProof){
            return res.status(404).json({ error: 'Payment proof not found' });
        }
        const order = await findOrderById(paymentProof.order_id);
        if(!order){
            return res.status(404).json({ error: 'Order not found' });
        }
        const sellerActvAssgnmnt= await getActiveAssignmentBySeller(req.user.id)
        const hasNoAssignment= !sellerActvAssgnmnt
        const isDiffStand= sellerActvAssgnmnt && order.stand_id !== sellerActvAssgnmnt.stand_id
        if (hasNoAssignment || isDiffStand){
                return res.status(403).json({stand: 'order and stand do not match'})
        }else{
            const updatedProof = await updatePaymentProofStatus(status, req.user.id, proofId);
            if (status === 'approved') {
                await markOrderAsPaid(order.id);
            }
            return res.status(200).json({ message: 'Payment proof reviewed successfully', paymentProof: updatedProof });
        }
    }catch(error){
        next(error);
    }
}
async function getPaymentProofByOrderController(req,res,next) {
        try{
            const orderId = req.params.orderId
            const order = await findOrderById(orderId)
            if(!order){
                return res.status(404).json({ message: 'Order not found' });
            }

            const sellerActvAssgnmnt = await getActiveAssignmentBySeller(req.user.id);
            const hasNoAssignment = !sellerActvAssgnmnt;
            const isDiffStand = sellerActvAssgnmnt && order.stand_id !== sellerActvAssgnmnt.stand_id;
            if(hasNoAssignment || isDiffStand){
                return res.status(403).json({ message: 'order and stand do not match' });
            }
            const proof = await getPaymentProofByOrder(orderId)
            return res.status(200).json({ proof });
        }catch(error){
            next(error)
        }
    }
    async function getPaymentProofByStandController(req,res,next) {
        try{
            const sellerActvAssignment = await getActiveAssignmentBySeller(req.user.id)
            if(!sellerActvAssignment){
                return res.status(403).json({ message: 'user is not assigned to any stand' });
            }
            const proofs = await getPaymentProofByStand(sellerActvAssignment.stand_id)
            return res.status(200).json({proofs})
        }catch(error){
            next(error)
        }
    }
module.exports = { uploadPaymentProofController, reviewPaymentProofController, getPaymentProofByOrderController}