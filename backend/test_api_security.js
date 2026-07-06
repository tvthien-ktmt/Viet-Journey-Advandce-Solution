const http = require('http');
const crypto = require('crypto');

const secret = 'MockPaymentSecretKey1234567890';

function calculateChecksum(data) {
    return crypto.createHmac('sha256', secret).update(data, 'utf8').digest('hex');
}

const request = (method, path, body = null, token = null) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (token) options.headers['Authorization'] = 'Bearer ' + token;
        
        const req = http.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = data;
                try { parsed = JSON.parse(data); } catch(e){}
                resolve({ status: res.statusCode, data: parsed });
            });
        });
        
        req.on('error', error => reject(error));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
};

(async () => {
    try {
        console.log('--- 1. Login ---');
        let res = await request('POST', '/api/auth/login', {email: 'test3@test.com', password: 'password123'});
        let token = res.data && res.data.data ? res.data.data.token : null;
        console.log('Token extracted:', !!token);

        console.log('\n--- 2. Create Booking ---');
        let bookBody = {
            bookingType: 'TOUR',
            referenceId: 1,
            bookingDate: '2026-07-01',
            numberOfPeople: 2,
            totalPrice: 1000.0,
            specialRequests: 'None'
        };
        res = await request('POST', '/api/bookings', bookBody, token);
        console.log('Create Booking Res:', JSON.stringify(res));
        let bookingId = res.data && res.data.data && res.data.data.id ? res.data.data.id : 1;

        console.log('\n--- 3. Create Payment ---');
        res = await request('POST', '/api/payments/create', {bookingId: bookingId, amount: 1000.0, paymentMethod: 'VNPAY'}, token);
        console.log('Create Payment Res:', JSON.stringify(res));
        let paymentUrl = res.data.data.paymentUrl;
        let txnRefMatch = paymentUrl.match(/vnp_TxnRef=([^&]+)/);
        let txnRef = txnRefMatch ? txnRefMatch[1] : ('TXN-1234');
        
        // 4. VALID CHECKSUM
        console.log('\n--- 4. Payment Callback (VALID CHECKSUM) ---');
        let validPayload = 'vnp_TxnRef=' + txnRef + '&vnp_ResponseCode=00';
        let validHash = calculateChecksum(validPayload);
        res = await request('GET', '/api/payments/callback?vnp_TxnRef=' + txnRef + '&vnp_ResponseCode=00&vnp_SecureHash=' + validHash);
        console.log('Valid Callback Res:', JSON.stringify(res));

        console.log('\n--- 5. Get Booking (Should be confirmed) ---');
        res = await request('GET', '/api/bookings/' + bookingId, null, token);
        console.log('Get Booking Res:', JSON.stringify(res));

        // 6. INVALID CHECKSUM
        console.log('\n--- 6. Payment Callback (INVALID CHECKSUM) ---');
        let invalidHash = 'badhash123456';
        res = await request('GET', '/api/payments/callback?vnp_TxnRef=' + txnRef + '&vnp_ResponseCode=00&vnp_SecureHash=' + invalidHash);
        console.log('Invalid Callback Res:', JSON.stringify(res));

    } catch(e) {
        console.error(e);
    }
})();
