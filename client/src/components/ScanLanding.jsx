function ScanLanding({ onScan, scanning, error, user, onLogout }) {
    return (
      <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
        <header className="bg-white border-b" style={{ borderColor: '#e2e8f0' }}>
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#dc2626' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-sm" style={{ color: '#1e293b' }}>PierreGuard</span>
                <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-medium"
                  style={{ background: '#fee2e2', color: '#dc2626' }}>Ops</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: '#1e293b' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{user?.role} · {user?.id}</p>
              </div>
              <button onClick={onLogout}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
                Sign out
              </button>
            </div>
          </div>
        </header>
  
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#1e293b' }}>
              Security Operations Centre
            </h1>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Review the monitored environment below and start your security scan.
            </p>
          </div>
  
          {/* Connected environment card */}
          <div className="bg-white rounded-2xl overflow-hidden mb-6"
            style={{ border: '1px solid #e2e8f0' }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: '#fee2e2' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="#dc2626" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>
                    Monitored AWS Environment
                  </p>
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    Live data from GuardDuty, CloudTrail, and VPC
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#16a34a' }} />
                <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>Live</span>
              </div>
            </div>
  
            <div className="grid grid-cols-3 gap-0">
              {[
                { label: 'Account ID', value: '964308144601' },
                { label: 'Account Name', value: 'PierreGuard Technologies' },
                { label: 'Environment', value: 'Production' },
                { label: 'Region', value: 'us-east-1' },
                { label: 'VPC ID', value: 'vpc-0a4a1cd7d85b9bfb1' },
                { label: 'GuardDuty', value: 'Active' },
              ].map((item, i) => (
                <div key={i} className="px-6 py-4"
                  style={{
                    borderRight: i % 3 !== 2 ? '1px solid #f1f5f9' : 'none',
                    borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none'
                  }}>
                  <p className="text-xs font-medium mb-1" style={{ color: '#94a3b8' }}>{item.label}</p>
                  <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Services monitored */}
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: '#1e293b' }}>Services Monitored</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Amazon GuardDuty', desc: 'Threat detection findings', color: '#dc2626', bg: '#fef2f2' },
                { label: 'AWS CloudTrail', desc: 'API activity last 24 hours', color: '#d97706', bg: '#fffbeb' },
                { label: 'VPC Architecture', desc: 'Network security assessment', color: '#1e40af', bg: '#eff6ff' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: item.bg, border: `1px solid ${item.bg}` }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: item.color }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: item.color }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: item.color, opacity: 0.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* VPC Architecture */}
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid #e2e8f0' }}>
            <p className="text-sm font-semibold mb-4" style={{ color: '#1e293b' }}>VPC Security Architecture</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'PierreGuard VPC', detail: '10.0.0.0/16 — us-east-1', color: '#1e40af', bg: '#eff6ff' },
                { name: 'Public Subnet A', detail: '10.0.1.0/24 — us-east-1a', color: '#16a34a', bg: '#f0fdf4' },
                { name: 'Public Subnet B', detail: '10.0.2.0/24 — us-east-1b', color: '#16a34a', bg: '#f0fdf4' },
                { name: 'Security Group', detail: 'HTTPS port 443 inbound only', color: '#7c3aed', bg: '#f5f3ff' },
                { name: 'Network ACL', detail: 'Blocks SSH 22, RDP 3389, Telnet 23', color: '#dc2626', bg: '#fef2f2' },
                { name: 'Internet Gateway', detail: 'Public internet access', color: '#0891b2', bg: '#ecfeff' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: item.bg }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: item.color }}>{item.name}</p>
                    <p className="text-xs" style={{ color: item.color, opacity: 0.7 }}>{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Scan button */}
          <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
            {scanning ? (
              <div className="text-center py-4">
                <div className="relative mx-auto mb-4" style={{ width: '48px', height: '48px' }}>
                  <div className="absolute inset-0 rounded-full" style={{ border: '1px solid #fee2e2' }} />
                  <div className="absolute inset-0 rounded-full animate-spin"
                    style={{ border: '3px solid transparent', borderTopColor: '#dc2626' }} />
                </div>
                <p className="text-sm font-semibold mb-1" style={{ color: '#1e293b' }}>
                  Scanning security environment...
                </p>
                <p className="text-xs" style={{ color: '#64748b' }}>
                  Fetching GuardDuty findings, CloudTrail events, and VPC details...
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {[0, 150, 300].map(d => (
                    <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{ background: '#dc2626', animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#1e293b' }}>Ready to scan</p>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                    Pulls live GuardDuty, CloudTrail, and VPC data. Takes approximately 20 to 40 seconds.
                  </p>
                </div>
                <button onClick={onScan}
                  className="px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                  style={{ background: '#dc2626', color: 'white' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="white" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Start Security Scan
                </button>
              </div>
            )}
          </div>
  
          {error && (
            <div className="mt-4 px-6 py-4 rounded-xl text-sm"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              Scan failed: {error}
            </div>
          )}
        </main>
      </div>
    )
  }
  
  export default ScanLanding