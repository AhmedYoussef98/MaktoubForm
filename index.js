const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const { google } = require('googleapis');

const app = express();
const PORT = 5000;

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || '';

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function appendToGoogleSheet(data) {
  try {
    if (!SPREADSHEET_ID) {
      console.log('Google Sheet ID not configured, skipping Google Sheets sync');
      return { success: false, message: 'Sheet ID not configured' };
    }

    const sheets = await getUncachableGoogleSheetClient();
    
    const values = [[
      new Date().toISOString(),
      data.name,
      data.email,
      data.phone,
      data.interest_type,
      data.other_details || '',
      data.ip_address || ''
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:G',
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });

    return { success: true };
  } catch (error) {
    console.error('Google Sheets error:', error);
    return { success: false, error: error.message };
  }
}

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
    
    // Also save to Google Sheets (non-blocking)
    const sheetData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      interest_type: interestType,
      other_details: otherDetails ? otherDetails.trim() : '',
      ip_address: ipAddress
    };
    
    appendToGoogleSheet(sheetData).catch(err => {
      console.error('Failed to sync to Google Sheets:', err);
    });
    
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