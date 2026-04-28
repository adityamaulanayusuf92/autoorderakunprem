'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      console.log('Starting login test...');
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@dokz.com',
          password: 'Admin@123'
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setResult('✅ Login berhasil!\n\n' + JSON.stringify(data, null, 2));
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setResult('❌ Login gagal!\n\n' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResult('Testing...');
    try {
      console.log('Starting register test...');
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test' + Date.now() + '@test.com',
          password: 'Password123',
          fullName: 'Test User'
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setResult('✅ Register berhasil!\n\n' + JSON.stringify(data, null, 2));
      } else {
        setResult('❌ Register gagal!\n\n' + JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.error('Test error:', error);
      setResult('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 Test API</h1>

      <div className="space-y-4 mb-8">
        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login (admin)'}
        </button>

        <button
          onClick={testRegister}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Register'}
        </button>
      </div>

      {result && (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded whitespace-pre-wrap text-sm font-mono">
          {result}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-900 border border-blue-700 rounded text-sm">
        <p>💡 Credentials:</p>
        <p>Email: admin@dokz.com</p>
        <p>Password: Admin@123</p>
      </div>
    </div>
  );
}
