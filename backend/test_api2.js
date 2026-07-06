const http = require('http');

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
        let res = await request('POST', '/api/auth/login', {email: 'test3@test.com', password: 'password123'});
        let token = res.data && res.data.data ? res.data.data.token : null;

        console.log('\n--- 6. Create Booking ---');
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

        console.log('\n--- 7. Get Booking ---');
        res = await request('GET', '/api/bookings/' + bookingId, null, token);
        console.log('Get Booking Res:', JSON.stringify(res));

        console.log('\n--- 8. Create Payment ---');
        res = await request('POST', '/api/payments/create', {bookingId: bookingId, amount: 1000.0, paymentMethod: 'VNPAY'}, token);
        console.log('Create Payment Res:', JSON.stringify(res));

        console.log('\n--- 9. Payment Callback ---');
        res = await request('GET', '/api/payments/callback?vnp_TxnRef=' + bookingId + '&vnp_ResponseCode=00');
        console.log('Payment Callback Res:', JSON.stringify(res));

        console.log('\n--- 10. Unauthorized request ---');
        res = await request('GET', '/api/bookings/my-bookings');
        console.log('Unauthorized Res:', JSON.stringify(res));

    } catch(e) {
        console.error(e);
    }
})();
