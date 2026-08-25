'use client';

const trackerStyles = {
  tracker: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    margin: '30px 0 10px',
  },
  trackerLine: {
    content: '""',
    position: 'absolute',
    top: '14px',
    left: '5%',
    right: '5%',
    height: '2px',
    background: 'var(--line)',
  },
  node: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    flex: 1,
  },
  dotc: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    background: '#fff',
    border: '2px solid var(--sage)',
    margin: '0 auto 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 600,
  },
  dotcDone: {
    background: 'var(--green-700)',
    borderColor: 'var(--green-700)',
    color: '#fff',
  },
  tlabel: {
    fontSize: '11px',
    color: 'var(--charcoal-60)',
  },
  tlabelDone: {
    color: 'var(--green-900)',
    fontWeight: 600,
  },
};

export default function Tracker({
  steps = [],
  currentStep = 0,
  className = '',
}) {
  return (
    <div style={trackerStyles.tracker} className={className}>
      <div style={trackerStyles.trackerLine} />
      {steps.map((step, idx) => {
        const isDone = idx < currentStep;
        return (
          <div key={idx} style={trackerStyles.node}>
            <div
              style={{
                ...trackerStyles.dotc,
                ...(isDone ? trackerStyles.dotcDone : {}),
              }}
            >
              {isDone ? '✓' : idx + 1}
            </div>
            <div
              style={{
                ...trackerStyles.tlabel,
                ...(isDone ? trackerStyles.tlabelDone : {}),
              }}
            >
              {step}
            </div>
          </div>
        );
      })}
    </div>
  );
}
