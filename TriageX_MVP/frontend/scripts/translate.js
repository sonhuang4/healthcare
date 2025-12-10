/**
 * AI Translation Script for TriageX i18n
 * 
 * This script translates messages/en.json to all other languages using OpenAI API.
 * 
 * Usage:
 *   1. Install: npm install openai
 *   2. Set API key: export OPENAI_API_KEY="your-api-key"
 *   3. Run: node scripts/translate.js
 * 
 * Cost: ~$0.10-0.50 per language (one-time)
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Target locales to translate
const locales = ['sv', 'ar', 'zh-CN', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko'];

// Language names for better context
const langNames = {
  sv: 'Swedish',
  ar: 'Arabic',
  'zh-CN': 'Simplified Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ja: 'Japanese',
  ko: 'Korean',
};

const sourceFile = path.join(__dirname, '../messages/en.json');
const messagesDir = path.join(__dirname, '../messages');

/**
 * Recursively translate an object structure
 */
async function translateObject(obj, targetLang, langName) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively translate nested objects
      result[key] = await translateObject(value, targetLang, langName);
    } else if (typeof value === 'string' && value.trim() !== '') {
      // Translate string value
      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // Use 'gpt-4' for better quality (more expensive)
          messages: [
            {
              role: 'system',
              content: `You are a professional medical translator specializing in healthcare applications. Translate medical and healthcare content to ${langName}. Maintain professional medical terminology accuracy. Keep the same tone, style, and formality level. Preserve any HTML tags or special formatting.`,
            },
            {
              role: 'user',
              content: `Translate this text to ${langName}. Only return the translation, nothing else: "${value}"`,
            },
          ],
          temperature: 0.3, // Lower temperature for more consistent translations
        });
        
        result[key] = response.choices[0].message.content.trim();
        console.log(`  ✓ ${key}`);
        
        // Rate limiting - be nice to API (100ms delay between requests)
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`  ✗ Error translating ${key}:`, error.message);
        result[key] = value; // Fallback to English on error
      }
    } else {
      // Keep non-string values as-is (numbers, booleans, arrays, etc.)
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Translate a single locale file
 */
async function translateFile(targetLocale, langName) {
  console.log(`\n🌍 Translating to ${langName} (${targetLocale})...`);
  
  // Check if source file exists
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Source file not found: ${sourceFile}`);
    console.error('   Please create messages/en.json first!');
    return;
  }
  
  // Read source file
  const sourceContent = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));
  
  // Translate
  const translated = await translateObject(sourceContent, targetLocale, langName);
  
  // Ensure messages directory exists
  if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
  }
  
  // Write translated file
  const outputFile = path.join(messagesDir, `${targetLocale}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(translated, null, 2), 'utf8');
  
  console.log(`✅ Saved: ${outputFile}`);
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting AI Translation...\n');
  console.log(`📁 Source: ${sourceFile}`);
  console.log(`📁 Output: ${messagesDir}`);
  console.log(`🌐 Languages: ${locales.join(', ')}\n`);
  
  // Check API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable not set!');
    console.error('   Set it with: export OPENAI_API_KEY="your-api-key"');
    process.exit(1);
  }
  
  // Translate each locale
  for (const locale of locales) {
    await translateFile(locale, langNames[locale]);
  }
  
  console.log('\n🎉 Translation complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Review translations, especially medical terminology');
  console.log('   2. Have native speakers review critical content');
  console.log('   3. Test translations in the app');
  console.log('   4. Update translations as needed');
}

// Run if called directly
if (require.main === module) {
  main().catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { translateFile, translateObject };

