const { google } = require('googleapis');

let connectionSettings;

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
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

async function getGoogleSheetClient() {
  const accessToken = await getAccessToken();
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

async function setupGoogleSheet() {
  try {
    const sheets = await getGoogleSheetClient();
    
    const spreadsheet = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: 'Maktoub Interest Registrations'
        },
        sheets: [{
          properties: {
            title: 'Sheet1'
          },
          data: [{
            startRow: 0,
            startColumn: 0,
            rowData: [{
              values: [
                { userEnteredValue: { stringValue: 'Timestamp' } },
                { userEnteredValue: { stringValue: 'Name' } },
                { userEnteredValue: { stringValue: 'Email' } },
                { userEnteredValue: { stringValue: 'Phone' } },
                { userEnteredValue: { stringValue: 'Interest Type' } },
                { userEnteredValue: { stringValue: 'Other Details' } },
                { userEnteredValue: { stringValue: 'IP Address' } }
              ]
            }]
          }]
        }]
      }
    });

    console.log('\n✅ Google Sheet created successfully!');
    console.log('\n📋 Sheet Details:');
    console.log(`   Title: ${spreadsheet.data.properties.title}`);
    console.log(`   URL: ${spreadsheet.data.spreadsheetUrl}`);
    console.log(`   ID: ${spreadsheet.data.spreadsheetId}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Add this secret to your Replit Secrets:');
    console.log(`      GOOGLE_SHEET_ID = ${spreadsheet.data.spreadsheetId}`);
    console.log('   2. Restart your server');
    console.log('\n');
    
    return spreadsheet.data;
  } catch (error) {
    console.error('Error creating Google Sheet:', error.message);
    throw error;
  }
}

setupGoogleSheet().catch(console.error);
