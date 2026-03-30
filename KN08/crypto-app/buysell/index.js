const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const ACCOUNT_SERVICE_URL = process.env.ACCOUNT_URL || 'http://localhost:8080';

// Format: POST /Account/AddCrypto?userId={id}&amount={amount}
app.post('/buy', async (req, res) => {
    const { id, amount } = req.body;
    if (!id || !amount) return res.status(400).send(false);

    try {
        const response = await fetch(`${ACCOUNT_SERVICE_URL}/Account/AddCrypto?userId=${id}&amount=${amount}`, { method: 'POST' });
        if (response.ok) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (error) {
        console.error("Buy error:", error);
        res.status(500).json(false);
    }
});

app.post('/sell', async (req, res) => {
    const { id, amount } = req.body;
    if (!id || !amount) return res.status(400).send(false);

    try {
        // First check balance
        const balanceResponse = await fetch(`${ACCOUNT_SERVICE_URL}/Account/Cryptos?userId=${id}`);
        if (!balanceResponse.ok) return res.json(false);
        const currentBalance = await balanceResponse.json();
        
        const amountToDeduct = Math.min(amount, currentBalance);
        
        if (amountToDeduct > 0) {
            const deductResponse = await fetch(`${ACCOUNT_SERVICE_URL}/Account/RemoveCrypto?userId=${id}&amount=${amountToDeduct}`, { method: 'POST' });
            if (deductResponse.ok) {
                return res.json(true);
            }
        } else if (amountToDeduct === 0) {
           return res.json(true); // Nothing to sell, balance is already 0
        }
        res.json(false);
    } catch (error) {
        console.error("Sell error:", error);
        res.status(500).json(false);
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`BuySell service listening on port ${PORT}`);
});
