const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to get client IP
function getClientIp(req) {
  return req.headers['x-forwarded-for'] || 
         req.connection.remoteAddress || 
         req.socket.remoteAddress ||
         (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
         'N/A';
}

// API endpoint for form submission
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, interestType, otherDetails } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !interestType) {
      return res.status(400).json({ 
        success: false, 
        message: 'حدث خطأ: جميع الحقول المطلوبة يجب ملؤها'
      });
    }
    
    // Get client IP
    const ipAddress = getClientIp(req);
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('interest_registrations')
      .insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          interest_type: interestType,
          other_details: otherDetails ? otherDetails.trim() : null,
          ip_address: ipAddress,
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'حدث خطأ في حفظ البيانات: ' + error.message 
      });
    }
    
    // Success response
    res.json({ 
      success: true, 
      message: 'شكرًا لتسجيل اهتمامك بـ «مكتوب». سنقوم بالتواصل معك فور توفر النسخة التجريبية.' 
    });
    
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ: ' + error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Maktoub Form API is running' });
});

// Serve the main form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access your form at: http://localhost:${PORT}`);
});

module.exports = app;