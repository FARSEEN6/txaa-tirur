import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function TestHome() {
    return (
        <div style={{ padding: '40px', background: 'white', minHeight: '100vh' }}>
            <h1 style={{ color: 'black', fontSize: '48px' }}>✅ React is Working!</h1>
            <p style={{ color: '#666', fontSize: '24px' }}>If you see this, the blank screen is fixed.</p>
            <div style={{ marginTop: '20px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
                <h2 style={{ color: 'black' }}>Diagnostic Info:</h2>
                <ul style={{ color: '#333' }}>
                    <li>✅ React is rendering</li>
                    <li>✅ ReactDOM.createRoot is working</li>
                    <li>✅ Router is initialized</li>
                    <li>✅ index.html div#root exists</li>
                </ul>
            </div>
        </div>
    );
}

function TestApp() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TestHome />} />
                <Route path="*" element={<div style={{ padding: '40px', color: 'red', fontSize: '24px' }}>Route not found</div>} />
            </Routes>
        </Router>
    );
}

export default TestApp;
