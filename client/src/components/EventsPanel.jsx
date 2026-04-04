function EventsPanel({ events }) {
    const getSeverityColor = (eventName) => {
      const critical = ['DeleteBucket', 'DeleteTrail', 'StopLogging', 'DeleteUser',
        'DetachUserPolicy', 'DeleteAccessKey', 'PutBucketPolicy']
      const high = ['CreateUser', 'AttachUserPolicy', 'CreateAccessKey',
        'UpdateAccessKey', 'PutUserPolicy', 'CreateLoginProfile']
      const medium = ['ListUsers', 'ListAccessKeys', 'GetCallerIdentity',
        'AssumeRole', 'ListRoles', 'ListPolicies']
  
      if (critical.some(c => eventName?.includes(c))) return 'critical'
      if (high.some(h => eventName?.includes(h))) return 'high'
      if (medium.some(m => eventName?.includes(m))) return 'medium'
      return 'normal'
    }
  
    const getBadge = (level) => {
      const styles = {
        critical: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca', label: 'Critical' },
        high: { bg: '#fffbeb', text: '#d97706', border: '#fde68a', label: 'High' },
        medium: { bg: '#fefce8', text: '#ca8a04', border: '#fef08a', label: 'Medium' },
        normal: { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0', label: 'Normal' },
      }
      const s = styles[level] || styles.normal
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
          {s.label}
        </span>
      )
    }
  
    const formatTime = (timeStr) => {
      try {
        return new Date(timeStr).toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        })
      } catch {
        return timeStr
      }
    }
  
    const getSourceService = (eventName) => {
      if (!eventName) return 'AWS'
      if (eventName.includes('Bucket') || eventName.includes('Object')) return 'S3'
      if (eventName.includes('User') || eventName.includes('Policy') ||
        eventName.includes('Role') || eventName.includes('Key')) return 'IAM'
      if (eventName.includes('Stack') || eventName.includes('Change')) return 'CloudFormation'
      if (eventName.includes('Session') || eventName.includes('Environment')) return 'CloudShell'
      if (eventName.includes('Caller')) return 'STS'
      return 'AWS'
    }
  
    const serviceColors = {
      IAM: { bg: '#fef2f2', text: '#dc2626' },
      S3: { bg: '#fffbeb', text: '#d97706' },
      CloudFormation: { bg: '#eff6ff', text: '#1e40af' },
      CloudShell: { bg: '#f5f3ff', text: '#7c3aed' },
      STS: { bg: '#ecfeff', text: '#0891b2' },
      AWS: { bg: '#f8fafc', text: '#64748b' },
    }
  
    return (
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <h2 className="text-base font-semibold" style={{ color: '#1e293b' }}>
            CloudTrail Event Feed
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            Last 24 hours · {events?.length || 0} events captured
          </p>
        </div>
  
        <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
          {!events || events.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm" style={{ color: '#94a3b8' }}>No events in the last 24 hours.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Time', 'Event', 'Service', 'User', 'Severity'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: '#64748b' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event, i) => {
                  const level = getSeverityColor(event.event_name)
                  const service = getSourceService(event.event_name)
                  const svcStyle = serviceColors[service] || serviceColors.AWS
                  return (
                    <tr key={i} className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-mono" style={{ color: '#64748b' }}>
                          {formatTime(event.event_time)}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium" style={{ color: '#1e293b' }}>
                          {event.event_name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ background: svcStyle.bg, color: svcStyle.text }}>
                          {service}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs" style={{ color: '#64748b' }}>
                          {event.username || 'unknown'}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {getBadge(level)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    )
  }
  
  export default EventsPanel