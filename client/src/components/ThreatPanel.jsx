import { useState } from 'react'

function ThreatPanel({ report, findingsCount, eventsCount }) {
  const [activeTab, setActiveTab] = useState('summary')

  const tabs = [
    { id: 'summary', label: 'Threat Summary' },
    { id: 'threats', label: 'Active Threats' },
    { id: 'suspicious', label: 'Suspicious Activity' },
    { id: 'actions', label: 'Immediate Actions' },
    { id: 'compliance', label: 'Compliance' },
  ]

  const extractSection = (text, sectionName, nextNum) => {
    if (!text) return ''
    const pattern = new RegExp(
      `${sectionName}[\\s\\S]*?(?=${nextNum}\\.|$)`, 'i'
    )
    const match = text.match(pattern)
    return match ? match[0].trim() : ''
  }

  const getSectionContent = (id) => {
    if (!report) return ''
    switch (id) {
      case 'summary': return extractSection(report, 'THREAT SUMMARY', '2') || ''
      case 'threats': return extractSection(report, 'ACTIVE THREATS', '3') || ''
      case 'suspicious': return extractSection(report, 'SUSPICIOUS ACTIVITY', '4') || ''
      case 'actions': return extractSection(report, 'IMMEDIATE ACTIONS', '6') || ''
      case 'compliance': return extractSection(report, 'COMPLIANCE', '999') || ''
      default: return ''
    }
  }

  const formatLines = (text) => {
    if (!text) return []
    return text.split('\n').map((line, i) => {
      const t = line.trim()
      if (!t) return { type: 'spacer', content: '', key: i }
      if (t.match(/^[0-9]+\.\s+[A-Z\s]+$/)) return { type: 'heading', content: t, key: i }
      if (t.match(/^-\s+\d+\./)) return { type: 'subheading', content: t.replace(/^-\s+/, ''), key: i }
      if (t.startsWith('- ') || t.startsWith('* ')) return { type: 'bullet', content: t.replace(/^[-*]\s*/, ''), key: i }
      if (t.match(/^(PASS|PARTIAL|FAIL)/i)) {
        const isPass = t.match(/^PASS/i)
        const isPartial = t.match(/^PARTIAL/i)
        return { type: isPass ? 'pass' : isPartial ? 'partial' : 'fail', content: t, key: i }
      }
      return { type: 'text', content: t, key: i }
    })
  }

  const renderLine = (line) => {
    switch (line.type) {
      case 'spacer': return <div key={line.key} className="h-2" />
      case 'heading':
        return (
          <h3 key={line.key} className="text-sm font-bold mt-4 mb-2"
            style={{ color: '#1e293b', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
            {line.content.replace(/^\d+\.\s*/, '')}
          </h3>
        )
      case 'subheading':
        return (
          <p key={line.key} className="text-sm font-semibold mt-3 mb-1"
            style={{ color: '#dc2626' }}>
            {line.content}
          </p>
        )
      case 'bullet':
        return (
          <div key={line.key} className="flex gap-2 mb-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: '#dc2626' }} />
            <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
              {line.content}
            </p>
          </div>
        )
      case 'pass':
        return (
          <div key={line.key} className="flex items-center gap-2 py-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: '#f0fdf4', color: '#16a34a' }}>PASS</span>
            <p className="text-sm" style={{ color: '#475569' }}>
              {line.content.replace(/^PASS\s*/i, '')}
            </p>
          </div>
        )
      case 'partial':
        return (
          <div key={line.key} className="flex items-center gap-2 py-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: '#fffbeb', color: '#d97706' }}>PARTIAL</span>
            <p className="text-sm" style={{ color: '#475569' }}>
              {line.content.replace(/^PARTIAL\s*/i, '')}
            </p>
          </div>
        )
      case 'fail':
        return (
          <div key={line.key} className="flex items-center gap-2 py-1.5">
            <span className="px-2 py-0.5 rounded text-xs font-bold"
              style={{ background: '#fef2f2', color: '#dc2626' }}>FAIL</span>
            <p className="text-sm" style={{ color: '#475569' }}>
              {line.content.replace(/^FAIL\s*/i, '')}
            </p>
          </div>
        )
      default:
        return (
          <p key={line.key} className="text-sm leading-relaxed mb-1"
            style={{ color: '#475569' }}>
            {line.content}
          </p>
        )
    }
  }

  const content = getSectionContent(activeTab)
  const lines = formatLines(content)

  return (
    <div className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid #e2e8f0' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid #e2e8f0' }}>
        <div>
          <h2 className="text-base font-semibold" style={{ color: '#1e293b' }}>
            AI Threat Analysis
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            {findingsCount} GuardDuty findings · {eventsCount} CloudTrail events analysed
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-3 text-xs font-medium whitespace-nowrap transition-all"
            style={{
              color: activeTab === tab.id ? '#dc2626' : '#64748b',
              borderBottom: activeTab === tab.id ? '2px solid #dc2626' : '2px solid transparent',
              background: activeTab === tab.id ? '#fef2f2' : 'transparent'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
        {lines.length > 0 ? (
          lines.map(line => renderLine(line))
        ) : (
          <p className="text-sm" style={{ color: '#94a3b8' }}>No content available.</p>
        )}
      </div>
    </div>
  )
}

export default ThreatPanel