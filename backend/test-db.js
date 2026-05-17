const dns = require('dns'); dns.setServers(['8.8.8.8', '8.8.4.4']); const mongoose = require('mongoose');

const uri = 'mongodb+srv://mnchandrakala23_db_user:xe7fSfNt4U70OXRB@cluster0.zu5l3ti.mongodb.net/?appName=Cluster0';

async function test() {
  try {
    console.log('Connecting...');
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to', conn.connection.host);
    
    console.log('Executing test query...');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    console.log('SUCCESS');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err);
    process.exit(1);
  }
}

test();
