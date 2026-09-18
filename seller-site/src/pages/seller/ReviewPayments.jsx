import { useEffect, useState } from "react";
import api from '../../utils/api'

function buildImgUrl(imageUrl){
    const filename = imageUrl.split(/[/\\]/).pop();
    return `http://localhost:3000/uploads/${filename}`;
}

function ReviewPayments() {
    const [proofs, setProofs]=useState([])
    const [loading, setLoading]=useState(true)

    async function fetchProofs() {
        try {
            const response = await api.get('/payment/stand');
            setProofs(response.data.proofs);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchProofs()
    }, [])

    async function handleReview(proofId, newStatus) {
        try{
            await api.patch(`/payment/${proofId}/review`, {status: newStatus})
            fetchProofs()
        }catch(err){
            console.error(err)
        }
    }
    if (loading){
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Review Payments</h1>
            {proofs.length === 0 && <p>No payment proofs yet.</p>}
            {proofs.map((proof) => (
                <div key={proof.id}>
                    <p>Order #{proof.order_id} — {proof.status}</p>
                    <img
                        src={buildImgUrl(proof.image_url)}
                        alt="Payment proof"
                        style={{ maxWidth: '200px' }}
                    />
                    <select
                        value={proof.status}
                        onChange={(e) => handleReview(proof.id, e.target.value)}
                    >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                    </select>
                </div>
            ))}
        </div>
    )
}

export default ReviewPayments;