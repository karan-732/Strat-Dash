'use client';

/* Ported from the Sprint Console template by scripts/dc-to-jsx.mjs. */
import { Fragment } from 'react';

export function NextMoves({ v }: { v: any }) {
  return (
    v.sug.show ? (
      <>
      <div style={{ marginTop: '14px', border: '1px solid var(--ln10)', background: 'var(--card)', borderRadius: '10px', boxShadow: '0 1px 2px var(--sh50),0 18px 34px -26px var(--sh90)', padding: '18px 19px 17px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', letterSpacing: '.16em', color: 'var(--fg3)' }}>
              {v.sug.head}
            </div>
            <div style={{ marginTop: '5px', fontSize: '12px', lineHeight: '1.45', color: 'var(--fg3)' }}>
              {v.sug.note}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '7px', flex: '0 0 auto' }}>
            <button type="button" onClick={v.sug.copy} style={{ padding: '6px 11px', border: '1px solid var(--ln38)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.11em' }}>
              COPY
            </button>
            <button type="button" onClick={v.sug.download} style={{ padding: '6px 11px', border: '1px solid var(--ln38)', background: 'transparent', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9.5px', letterSpacing: '.11em' }}>
              DOWNLOAD
            </button>
          </div>
        </div>
        <div style={{ marginTop: '13px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {(v.sug.items ?? []).map((s: any, sIndex: number) => (
            <Fragment key={sIndex}>
              <div style={{ display: 'grid', gridTemplateColumns: '26px minmax(0,1fr)', gap: '11px', alignItems: 'start', borderLeft: '3px solid #D26B51', background: 'var(--bg)', borderRadius: '0 9px 9px 0', padding: '11px 13px 12px' }}>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '11px', color: 'var(--fg3)', paddingTop: '2px' }}>
                  {s.nn}
                </div>
                <div style={{ minWidth: '0' }}>
                  <div style={{ fontSize: '13.5px', fontWeight: '600', lineHeight: '1.4', letterSpacing: '-.01em', textWrap: 'pretty' }}>
                    {s.act}
                  </div>
                  <div style={{ marginTop: '5px', fontSize: '12px', lineHeight: '1.5', color: 'var(--fg2)', textWrap: 'pretty' }}>
                    {s.why}
                  </div>
                  <div style={{ marginTop: '7px', display: 'flex', gap: '8px', flexWrap: 'wrap', fontFamily: "'JetBrains Mono',ui-monospace,SFMono-Regular,monospace", fontSize: '9px', letterSpacing: '.11em', color: 'var(--fg3)' }}>
                    <span>
                      {s.owner}
                    </span>
                    <span style={{ color: 'var(--ln38)' }}>
                      /
                    </span>
                    <span>
                      {s.when}
                    </span>
                  </div>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      </>
    ) : null
  );
}
