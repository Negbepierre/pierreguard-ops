import { useState } from 'react'

const DEMO_USERS = [
  { email: 'pierre@pierreguard.ai', password: 'pierre2026', name: 'Pierre Inegbenose', role: 'Chief Security Officer', id: 'PG-001' },
  { email: 'analyst@pierreguard.ai', password: 'analyst2026', name: 'Sarah Chen', role: 'Security Analyst', id: 'PG-002' },
  { email: 'soc@pierreguard.ai', password: 'soc2026', name: 'James Wright', role: 'SOC Engineer', id: 'PG-003' },
]

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 600))
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('pierreguard_ops_user', JSON.stringify(user))
      onLogin(user)
    } else {
      setError('Invalid email or password.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16"
        style={{ background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: '#dc2626' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: '#1e293b' }}>PierreGuard</h1>
              <p className="text-xs" style={{ color: '#64748b' }}>Security Operations</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4 leading-tight" style={{ color: '#1e293b' }}>
              AI-Powered Cloud<br />Security Operations
            </h2>
            <p className="text-base leading-relaxed" style={{ color: '#64748b' }}>
              Real-time threat detection powered by GuardDuty, CloudTrail,
              and Claude AI via AWS Bedrock. Monitor your VPC architecture
              and respond to threats instantly.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: '🛡️', title: 'Live threat detection', desc: 'GuardDuty findings analysed by Claude AI in real time' },
              { icon: '🔍', title: 'CloudTrail monitoring', desc: 'Every API call monitored for suspicious patterns' },
              { icon: '🌐', title: 'VPC security assessment', desc: 'Network architecture assessed against security standards' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#94a3b8' }}>
          PierreGuard AI Security Operations v1.0 — Built on AWS Bedrock, GuardDuty, and CloudTrail
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e293b' }}>Sign in</h2>
              <p className="text-sm" style={{ color: '#64748b' }}>Access the PierreGuard Security Operations Centre</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Email address
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@pierreguard.ai"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ border: '1px solid #d1d5db', background: '#f9fafb', color: '#1e293b', outline: 'none' }} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#374151' }}>
                  Password
                </label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-sm"
                  style={{ border: '1px solid #d1d5db', background: '#f9fafb', color: '#1e293b', outline: 'none' }} />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl text-sm"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ background: loading ? '#fca5a5' : '#dc2626', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: '#dc2626' }}>Demo credentials</p>
              <div className="space-y-1">
                <p className="text-xs" style={{ color: '#64748b' }}>pierre@pierreguard.ai / pierre2026</p>
                <p className="text-xs" style={{ color: '#64748b' }}>analyst@pierreguard.ai / analyst2026</p>
                <p className="text-xs" style={{ color: '#64748b' }}>soc@pierreguard.ai / soc2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login