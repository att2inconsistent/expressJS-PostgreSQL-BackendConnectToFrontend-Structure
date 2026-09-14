import {useState, useEffect} from 'react';
import api from '../../utils/api';

function ManageMenu() {
    const [menuItems, setMenuItems] = useState([])
    const [standId, setStandId] = useState(null)
    const [loading, setLoading ]= useState(true)

    async function fetchMenu(){
        try {
            const assignmentRes = await api.get('/seller/my-assignment');
            const mystandId = assignmentRes.data.assignment.stand_id;

            const menuRes = await api.get(`/menu/${mystandId}`);
            setMenuItems(menuRes.data.stand);
            setStandId(mystandId);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchMenu();
    }, [])

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1>Manage Menu</h1>
            {menuItems.length === 0 && <p>No menu items yet.</p>}
            {menuItems.map((item) => (
                <div key={item.id}>
                    <p>{item.name} — Rp{item.price} — Qty: {item.quantity}</p>
                </div>
            ))}
        </div>
    );
}

export default ManageMenu;