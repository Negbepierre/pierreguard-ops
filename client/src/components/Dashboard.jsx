import ThreatPanel from './ThreatPanel'
import VpcPanel from './VpcPanel'
import EventsPanel from './EventsPanel'

function Dashboard({ data, onRescan, user }) {
  const now = new Date().toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const getThreatStyle = (level) => {
    const styles = {
      CRITICAL: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
      HIGH: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
      MEDIUM: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a' },
      LOW: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
    }
    return styles[level] || styles.LOW
  }

  const threatStyle = getThreatStyle(data.threat_level)

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>

      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: '#e2e8f0' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#dc2626' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-sm" style={{ color: '#1e293b' }}>PierreGuard</span>
              <span className="text-xs ml-2 px-2 py-0.5 rounded-full font-medium"
                style={{ background: '#fee2e2', color: '#dc2626' }}>
                Security Operations
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs" style={{ color: '#64748b' }}>Scan completed</p>
              <p className="text-xs font-medium" style={{ color: '#1e293b' }}>{now}</p>
            </div>
            <div className="flex items-center gap-3"
              style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: '#1e293b' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: '#64748b' }}>{user?.role} · {user?.id}</p>
              </div>
              <button onClick={onRescan}
                className="text-xs px-4 py-2 rounded-lg font-medium"
                style={{ background: '#dc2626', color: 'white' }}>
                New Scan
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl p-5 flex items-center justify-between"
            style={{
              background: threatStyle.bg,
              border: `1px solid ${threatStyle.border}`
            }}>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: threatStyle.text }}>
                Threat Level
              </p>
              <p className="text-2xl font-bold" style={{ color: threatStyle.text }}>
                {data.threat_level}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: threatStyle.border }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke={threatStyle.text} strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>

          {[
            { label: 'GuardDuty Findings', value: data.findings_count, color: '#dc2626', bg: '#fef2f2' },
            { label: 'CloudTrail Events', value: data.events_count, color: '#d97706', bg: '#fffbeb' },
            { label: 'VPC Subnets', value: data.vpc?.subnets?.length || 0, color: '#1e40af', bg: '#eff6ff' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 flex items-center justify-between"
              style={{ border: '1px solid #e2e8f0' }}>
              <div>
                <p className="text-xs font-medium mb-1" style={{ color: '#64748b' }}>
                  {stat.label}
                </p>
                <p className="text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.bg }}>
                <div className="w-3 h-3 rounded-full" style={{ background: stat.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Compliance row */}
        <div className="bg-white rounded-2xl px-6 py-4 flex items-center gap-6"
          style={{ border: '1px solid #e2e8f0' }}>
          <p className="text-sm font-semibold flex-shrink-0" style={{ color: '#1e293b' }}>
            Compliance
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { name: 'CIS AWS Benchmark', status: 'PARTIAL' },
              { name: 'SOC 2', status: 'PASS' },
              { name: 'ISO 27001', status: 'PASS' },
              { name: 'PierreGuard Standards', status: 'PARTIAL' },
            ].map((item, i) => {
              const isPass = item.status === 'PASS'
              const isPartial = item.status === 'PARTIAL'
              return (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: isPass ? '#f0fdf4' : isPartial ? '#fffbeb' : '#fef2f2',
                    border: `1px solid ${isPass ? '#bbf7d0' : isPartial ? '#fde68a' : '#fecaca'}`
                  }}>
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isPass ? '#16a34a' : isPartial ? '#d97706' : '#dc2626' }} />
                  <span className="text-xs font-medium"
                    style={{ color: isPass ? '#16a34a' : isPartial ? '#d97706' : '#dc2626' }}>
                    {item.name}
                  </span>
                  <span className="text-xs font-bold"
                    style={{ color: isPass ? '#16a34a' : isPartial ? '#d97706' : '#dc2626' }}>
                    {item.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ThreatPanel
            report={data.report}
            findingsCount={data.findings_count}
            eventsCount={data.events_count}
          />
          <VpcPanel vpc={data.vpc} />
        </div>

        {/* Events table */}
        <EventsPanel events={data.events} />

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            PierreGuard AI Security Operations v1.0 — Powered by AWS GuardDuty,
            CloudTrail, Bedrock, and a CloudFormation-deployed VPC.
            All findings should be reviewed by a qualified security professional.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Dashboard