import {useState, useEffect} from 'react';
import api from '../../utils/api';

const STATUS_OPTIONS = ['pending', 'accepted','rejected'];

function SellerApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchOrders() {
        try {
            const response = await api.get('/admin/seller-applications');
            setApplications(response.data.application);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    async function handleStatusChange(applicationId, newStatus) {
        try{
            await api.patch(`/admin/seller-applications/${applicationId}/status`, { status: newStatus });
            fetchOrders();
        }catch(err){
            console.error(err);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return(
        <div>
            <h1>Incoming Applications</h1>
            {applications.length === 0 && <p>No orders yet.</p>}
            {applications.map((application) => (
                <div key={application.id}>
                    <p>Order #{application.id} — {application.status}</p>
                    <select value={application.status} onChange={(e) => handleStatusChange(application.id, e.target.value)}>
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    )
}

export default SellerApplications;