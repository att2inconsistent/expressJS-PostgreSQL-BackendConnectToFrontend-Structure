import {useState, useEffect} from 'react';
import api from '../../utils/api';

function ManageMenu() {
    const [menuItems, setMenuItems] = useState([])
    const [standId, setStandId] = useState(null)
    const [loading, setLoading ]= useState(true)
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [qty, setQty] = useState('')
    const [price, setPrice] = useState('')

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

    async function handleCreate(e) {
        e.preventDefault()
        try{
            await api.post('/menu',{
                name: name,
                desc: desc,
                qty: qty,
                price: price
            })

            setName('')
            setDesc('')
            setQty('')
            setPrice('')

            fetchMenu()
        }catch(err){
            console.error(err)
        }
    }

    async function handleDelete(itemId) {
        try{
            await api.delete(`/menu/${itemId}`)
            fetchMenu()
        }catch(err){
            console.error(err)
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
            <form onSubmit={handleCreate}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                    />
                </div>
                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                <button type="submit">Add Item</button>
            </form>

            {menuItems.length === 0 && <p>No menu items yet.</p>}
            {menuItems.map((item) => (
                <div key={item.id}>
                    <p>{item.name} — Rp{item.price} — Qty: {item.quantity}</p>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
            ))}
        </div>
        
    );
}

export default ManageMenu;