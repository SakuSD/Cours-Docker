const mongoose = require('mongoose');

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Erreur MongoDB: ${error.message}`);
    process.exit(1);
  }
}

async function closeDB() {
  try {
    await mongoose.connection.close();
    console.log('🔒 Connexion MongoDB fermée');
  } catch (error) {
    console.error(`❌ Erreur lors de la fermeture: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { connectDB, closeDB };
