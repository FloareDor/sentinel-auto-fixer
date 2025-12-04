async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        errorLogs: 'TypeError: Cannot read property foo of undefined',
        sourceCode: 'console.log(data.foo)'
      })
    });

    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
