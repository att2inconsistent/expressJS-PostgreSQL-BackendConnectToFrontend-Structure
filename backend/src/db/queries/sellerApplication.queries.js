const pool = require('../../config/db')

async function createApplication(userId) {
    const query ={
        text: 'INSERT INTO seller_applications(user_id) VALUES ($1) RETURNING *',
        values: [userId],
    }

    const res =await pool.query(query)
    return res.rows[0]
}

async function findApplicationByUserId(userId) {
    const query={
        text:'SELECT * FROM seller_applications WHERE user_id = $1',
        values: [userId],
    }
    
    const res = await pool.query(query)
    return res.rows[0] 
}

async function getPendingApplications(){
    const res=await pool.query(`
            SELECT 
                seller_applications.*,
                users.username,
                users.email
            FROM seller_applications
            JOIN users ON seller_applications.user_id = users.id
            WHERE seller_applications.status = 'pending'
        `)
    return res.rows
}

async function updateApplicationStatus(applicationId, status, reviewedBy) {
    const query={
        text:'UPDATE seller_applications SET status = $1, reviewed_by = $2, reviewed_at = NOW() WHERE id = $3 RETURNING *',
        values:[status, reviewedBy, applicationId],
    }
    const res= await pool.query(query)
    return res.rows[0]
}

module.exports={createApplication, findApplicationByUserId, getPendingApplications, updateApplicationStatus}