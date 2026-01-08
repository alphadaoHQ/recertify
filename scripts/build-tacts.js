(async () => {
  try {
    const { buildAllTact } = require('@ton/blueprint');
    console.log('Starting buildAllTact...');
    await buildAllTact();
    console.log('buildAllTact finished');
  } catch (e) {
    console.error('buildAllTact error:', e);
    process.exit(1);
  }
})();