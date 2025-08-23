// Simple server test
console.log('Testing if server can start...');

try {
  // Test if we can load the server module
  const path = './server/index.js';
  console.log('Attempting to load:', path);
  
  import(path).then(() => {
    console.log('✅ Server module loaded successfully!');
  }).catch(err => {
    console.error('❌ Failed to load server module:', err.message);
  });
} catch (error) {
  console.error('❌ Error during server test:', error.message);
}
