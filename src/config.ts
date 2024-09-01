import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

interface Config {
  port: number;
  dbUri: string;
  jwtSecret: string;
  geminiApiKey: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3000', 10),
  dbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase',
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  geminiApiKey: process.env.GEMINI_API_KEY || 'default_gemini_api_key',
};

export default config;
