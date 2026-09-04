'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function Sidebar({ v }: { v: any }) {
  return (
    <aside className={`app-sidebar-shell ${v.sidebarClass}`} style={{ flex: '0 0 248px', width: '248px', background: 'transparent', display: 'grid', gridTemplateRows: 'auto auto minmax(0,1fr)', overflow: 'hidden', padding: '10px 4px 10px 0' }}>
      <div className="app-brand" style={{ height: '74px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '11px' }}>
        <img className="app-brand-logo" src='/altrd-logo.png' alt="ALTRD" style={{ height: '20px', width: 'auto', display: 'block' }} />
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button onClick={v.goDash} aria-current={v.dashCurrent} style={{ width: '100%', height: '40px', textAlign: 'left', padding: '0 12px', border: '1px solid transparent', background: v.dashBg, borderRadius: '12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.14em', display: 'flex', alignItems: 'center' }}>
          DASHBOARD
        </button>
        <button onClick={v.openNew} style={{ width: '100%', height: '40px', marginTop: '4px', textAlign: 'left', padding: '0 12px', border: '1px solid var(--ln28)', background: 'transparent', color: 'var(--fg)', borderRadius: '12px', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '10px', fontWeight: '700', letterSpacing: '.13em', display: 'flex', alignItems: 'center' }}>
          ONBOARD NEW CLIENT
        </button>
      </div>
      <div style={{ overflow: 'auto', padding: '0 16px 16px' }}>
        <button type="button" onClick={v.toggleEngList} aria-expanded={v.engListExpanded} style={{ width: '100%', height: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px', border: '0', background: 'transparent', color: 'inherit' }}>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
            ENGAGEMENTS
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', color: 'var(--fg4)' }}>
              {v.navCount}
            </span>
            <span style={{ transform: v.engListArrow, transition: 'transform .15s ease', color: 'var(--fg4)', fontSize: '9px' }}>
              ▾
            </span>
          </span>
        </button>
        {v.engListOpen ? (
          <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(v.projects ?? []).map((n: any, nIndex: number) => (
              <Fragment key={nIndex}>
                <button onClick={n.select} aria-current={n.current} style={{ width: '100%', minHeight: '38px', textAlign: 'left', padding: '0 12px', border: '0', background: n.bg, borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: n.navFg }}>
                    {n.name}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
          {v.noMatches ? (
            <>
            <div style={{ padding: '14px 4px', fontSize: '11.5px', lineHeight: '1.45', color: 'var(--fg3)' }}>
              No engagement matches "{v.q}".
            </div>
            </>
          ) : null}
          </>
        ) : null}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--ln10)' }}>
          <div style={{ height: '28px', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
              LIBRARY
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(v.library ?? []).map((l: any, lIndex: number) => (
              <Fragment key={lIndex}>
                <button type="button" onClick={l.open} style={{ width: '100%', minHeight: '38px', textAlign: 'left', padding: '0 12px', border: '0', background: 'transparent', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--fg2)' }} className="hv-1">
                  <span style={{ flex: '0 0 auto', width: '16px', height: '16px', display: 'grid', placeItems: 'center', fontSize: '12px', color: 'var(--fg3)' }}>
                    {l.icon}
                  </span>
                  <span style={{ fontSize: '12.5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {l.label}
                  </span>
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
