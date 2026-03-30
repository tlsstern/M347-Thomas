const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const ACCOUNT_SERVICE_URL = process.env.ACCOUNT_URL || 'http://localhost:8080';

// Format: POST /send {"id": 1, "receiverId": 2, "amount": 21}
app.post('/send', async (req, res) => {
    const { id, receiverId, amount } = req.body;
    if (!id || !receiverId || !amount) return res.status(400).send(false);

    try {
        // 1. Check if receiver is a friend
        const friendsRes = await fetch(`${ACCOUNT_SERVICE_URL}/Account/Friends?userId=${id}`);
        if (!friendsRes.ok) return res.json(false);
        const friends = await friendsRes.json();
        
        const isFriend = friends.some(f => f.id === parseInt(receiverId));
        if (!isFriend) return res.json(false); // receiver is not a friend

        // 2. Check sender balance
        const balanceRes = await fetch(`${ACCOUNT_SERVICE_URL}/Account/Cryptos?userId=${id}`);
        if (!balanceRes.ok) return res.json(false);
        const balance = await balanceRes.json();
        
        if (balance < amount) return res.json(false); // insufficient funds
        
        // 3. Deduct from sender
        const deductRes = await fetch(`${ACCOUNT_SERVICE_URL}/Account/RemoveCrypto?userId=${id}&amount=${amount}`, { method: 'POST' });
        if (!deductRes.ok) return res.json(false);
        
        // 4. Add to receiver
        const addRes = await fetch(`${ACCOUNT_SERVICE_URL}/Account/AddCrypto?userId=${receiverId}&amount=${amount}`, { method: 'POST' });
        if (!addRes.ok) return res.json(false);
        
        res.json(true);
    } catch (error) {
        console.error("Send error:", error);
        res.status(500).json(false);
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`SendReceive service listening on port ${PORT}`);
});
