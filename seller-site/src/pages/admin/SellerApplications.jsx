import {useState, useEffect} from 'react';
import api from '../../utils/api';

const STATUS_OPTIONS = ['accepted','rejected'];

function SellerApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchApplications() {
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
        fetchApplications();
    }, []);

    async function handleStatusChange(applicationId, newStatus) {
        try{
            await api.patch(`/admin/seller-applications/${applicationId}`, { status: newStatus });
            fetchApplications();
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
            {applications.length === 0 && <p>No applications yet.</p>}
            {applications.map((application) => (
                <div key={application.id}>
                    <p>{application.username} ({application.email}) — {application.status}</p>
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