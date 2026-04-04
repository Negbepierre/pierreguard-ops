function VpcPanel({ vpc }) {
    if (!vpc || !vpc.vpc_id) {
      return (
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0' }}>
          <p className="text-sm" style={{ color: '#94a3b8' }}>No VPC data available.</p>
        </div>
      )
    }
  
    return (
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #e2e8f0' }}>
          <h2 className="text-base font-semibold" style={{ color: '#1e293b' }}>
            VPC Security Architecture
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
            {vpc.vpc_id} · {vpc.cidr} · Deployed via CloudFormation
          </p>
        </div>
  
        <div className="p-6 space-y-4">
  
          {/* VPC Status */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: '#dcfce7' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="#16a34a" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>
                  PierreGuard VPC
                </p>
                <p className="text-xs" style={{ color: '#16a34a', opacity: 0.8 }}>
                  {vpc.cidr} · {vpc.state}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {vpc.internet_gateway && (
                <span className="px-2 py-1 rounded text-xs font-medium"
                  style={{ background: '#dcfce7', color: '#16a34a' }}>
                  IGW Attached
                </span>
              )}
            </div>
          </div>
  
          {/* Subnets */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#94a3b8' }}>
              Subnets ({vpc.subnets?.length || 0})
            </p>
            <div className="space-y-2">
              {vpc.subnets?.map((subnet, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: '#eff6ff', border: '1px solid #dbeafe' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: '#1e40af' }} />
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#1e40af' }}>
                        {subnet.name}
                      </p>
                      <p className="text-xs" style={{ color: '#1e40af', opacity: 0.7 }}>
                        {subnet.cidr}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: '#dbeafe', color: '#1e40af' }}>
                    {subnet.az}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Security Groups */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: '#94a3b8' }}>
              Security Groups ({vpc.security_groups?.length || 0})
            </p>
            <div className="space-y-2">
              {vpc.security_groups?.map((sg, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{ background: '#f5f3ff', border: '1px solid #ede9fe' }}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold" style={{ color: '#7c3aed' }}>
                      {sg.name}
                    </p>
                    <span className="text-xs font-mono" style={{ color: '#7c3aed', opacity: 0.7 }}>
                      {sg.id}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: '#ede9fe', color: '#7c3aed' }}>
                      {sg.inbound_rules} inbound rule{sg.inbound_rules !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded"
                      style={{ background: '#ede9fe', color: '#7c3aed' }}>
                      {sg.outbound_rules} outbound rule{sg.outbound_rules !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* NACL */}
          <div className="p-4 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ background: '#dc2626' }} />
              <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>
                Network ACL — {vpc.nacls} NACL{vpc.nacls !== 1 ? 's' : ''} configured
              </p>
            </div>
            <div className="space-y-1.5">
              {[
                { rule: 'DENY', port: 'SSH port 22', reason: 'Prevents unauthorised remote access' },
                { rule: 'DENY', port: 'RDP port 3389', reason: 'Blocks Windows remote desktop attacks' },
                { rule: 'DENY', port: 'Telnet port 23', reason: 'Eliminates unencrypted protocol exposure' },
                { rule: 'ALLOW', port: 'HTTPS port 443', reason: 'Encrypted web traffic only' },
                { rule: 'ALLOW', port: 'Ephemeral 1024-65535', reason: 'Return traffic for outbound connections' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      background: item.rule === 'DENY' ? '#fee2e2' : '#dcfce7',
                      color: item.rule === 'DENY' ? '#dc2626' : '#16a34a'
                    }}>
                    {item.rule}
                  </span>
                  <span className="text-xs font-medium" style={{ color: '#374151' }}>
                    {item.port}
                  </span>
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    — {item.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
  
          {/* Architecture note */}
          <div className="p-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#1e293b' }}>
              Defence in Depth
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#64748b' }}>
              Two layers of network security protect this VPC. The Security Group
              is stateful and operates at the instance level — it automatically
              allows return traffic. The NACL is stateless and operates at the
              subnet level — both inbound and outbound rules must be explicitly
              defined. Together they implement defence in depth, a core principle
              of the CIS AWS Benchmark and ISO 27001.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  export default VpcPanel