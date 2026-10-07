async function runTests() {
  try {
    console.log('Triggering Ingestion API...');
    const ingestRes = await fetch('http://localhost:3000/api/ingest/json', { method: 'POST' });
    const ingestData = await ingestRes.json();
    console.log('Ingest Response:', ingestData.success);

    console.log('\nFetching Analytics Summary API...');
    const analyticsRes = await fetch('http://localhost:3000/api/analytics/summary');
    const analyticsData = await analyticsRes.json();
    console.log('Analytics Response:', JSON.stringify(analyticsData, null, 2));

  } catch (e) {
    console.error('Test failed:', e);
  }
}

runTests();
