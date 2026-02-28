import React, { useState } from 'react';
import Popup, {
  PopupType,
  Position,
  DisplayMode,
  AppearAnimation,
} from '../src';

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: '#f0f0f0',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  button: {
    padding: '14px 28px',
    fontSize: '16px',
    background: '#007AFF',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    margin: '8px',
    boxShadow: '0 2px 8px rgba(0,122,255,0.3)',
    pointerEvents: 'auto',
  },
  toastTop: {
    padding: '60px 32px 16px',
    background: '#FF3B30',
    color: 'white',
    width: '100%',
    fontSize: '16px',
    fontWeight: '500',
  },
  toastBottom: {
    padding: '20px 16px',
    background: 'white',
    color: 'black',
    width: '100%',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
  },
  popup: {
    padding: '32px',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    textAlign: 'center',
    maxWidth: '320px',
  },
  floater: {
    padding: '16px 24px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    fontSize: '16px',
    fontWeight: '500',
  },
  sheet: {
    width: '100%',
    background: 'white',
    borderRadius: '24px 24px 0 0',
    padding: '24px',
    boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#333',
  },
};

const ToastTopExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Toast Top (3s)
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          type: PopupType.Toast,
          position: Position.Top,
          autohideIn: 3,
          backgroundColor: 'transparent',
          appearFrom: AppearAnimation.TopSlide,
        })}
      >
        <div style={styles.toastTop}>
          Unable to add to bag - item unavailable
        </div>
      </Popup>
    </>
  );
};

const ToastBottomExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Toast Bottom
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          type: PopupType.Toast,
          position: Position.Bottom,
          dragToDismiss: true,
          backgroundColor: 'transparent',
        })}
      >
        <div style={styles.toastBottom}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#34C759' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', fontSize: 16 }}>Log In Required</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                Sign in to continue
              </div>
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
};

const PopupScaleExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Popup Scale
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          type: PopupType.Default,
          position: Position.Center,
          appearFrom: AppearAnimation.CenterScale,
          closeOnTapOutside: true,
          backgroundColor: 'rgba(0,0,0,0.5)',
          blurBackground: true,
          roundCorners: 20,
        })}
      >
        <div style={styles.popup}>
          <div style={{ fontSize: 48, marginBottom: '16px' }}>🎉</div>
          <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>Payment Success!</h3>
          <p style={{ color: '#666', margin: '0 0 24px' }}>Your order has been placed</p>
          <button
            style={{ ...styles.button, width: '100%', margin: 0 }}
            onClick={() => setShow(false)}
          >
            Done
          </button>
        </div>
      </Popup>
    </>
  );
};

const FloaterTopExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Floater Top
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          type: PopupType.Floater,
          position: Position.Top,
          backgroundColor: 'transparent',
          closeOnTap: false,
        })}
      >
        <div style={styles.floater}>
          🔔 New message received
        </div>
      </Popup>
    </>
  );
};

const FloaterBottomExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Floater Bottom
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          type: PopupType.Floater,
          position: Position.Bottom,
          backgroundColor: 'transparent',
        })}
      >
        <div style={styles.floater}>
          ✅ Added to cart
        </div>
      </Popup>
    </>
  );
};

const SheetExample: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button style={styles.button} onClick={() => setShow(true)}>
        Bottom Sheet
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          displayMode: DisplayMode.Sheet,
          position: Position.Bottom,
          dragToDismiss: true,
          backgroundColor: 'rgba(0,0,0,0.4)',
          allowTapThroughBG: false,
        })}
      >
        <div style={styles.sheet}>
          <div style={{ width: 40, height: 4, background: '#ddd', borderRadius: 2, margin: '0 auto 20px' }} />
          <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>Share</h3>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            {['📱', '💬', '✉️', '📎'].map((emoji, i) => (
              <button
                key={i}
                style={{
                  ...styles.button,
                  fontSize: 24,
                  padding: '16px',
                  background: '#f5f5f5',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            style={{ ...styles.button, marginTop: '24px', width: '100%', background: '#ff3b30' }}
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
        </div>
      </Popup>
    </>
  );
};

const SideExample: React.FC = () => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  return (
    <div>
      <button style={styles.button} onClick={() => setShowLeft(true)}>
        ← Slide Left
      </button>
      <Popup
        isPresented={showLeft}
        onDismiss={() => setShowLeft(false)}
        customize={(params) => ({
          ...params,
          position: Position.Leading,
          backgroundColor: 'transparent',
          closeOnTapOutside: true,
        })}
      >
        <div style={{ ...styles.floater, marginLeft: 16 }}>
          ← Slide from left
        </div>
      </Popup>

      <button style={styles.button} onClick={() => setShowRight(true)}>
        Slide Right →
      </button>
      <Popup
        isPresented={showRight}
        onDismiss={() => setShowRight(false)}
        customize={(params) => ({
          ...params,
          position: Position.Trailing,
          backgroundColor: 'transparent',
          closeOnTapOutside: true,
        })}
      >
        <div style={{ ...styles.floater, marginRight: 16 }}>
          Slide from right →
        </div>
      </Popup>
    </div>
  );
};

const AllPositionsExample: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      <PositionButton position={Position.TopLeading} label="↖ Top" />
      <PositionButton position={Position.Top} label="↑ Top" />
      <PositionButton position={Position.TopTrailing} label="Top ↗" />
      <PositionButton position={Position.Center} label="● Center" />
      <PositionButton position={Position.BottomLeading} label="↙ Bottom" />
      <PositionButton position={Position.Bottom} label="↓ Bottom" />
      <PositionButton position={Position.BottomTrailing} label="Bottom ↘" />
    </div>
  );
};

const PositionButton: React.FC<{ position: Position; label: string }> = ({ position, label }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button 
        style={styles.button} 
        onClick={() => setShow(true)}
      >
        {label}
      </button>
      <Popup
        isPresented={show}
        onDismiss={() => setShow(false)}
        customize={(params) => ({
          ...params,
          position,
          backgroundColor: 'rgba(0,0,0,0.4)',
          closeOnTapOutside: true,
        })}
      >
        <div style={styles.floater}>
          {position === Position.Center ? 'Center Popup' : String(position) + ' position'}
        </div>
      </Popup>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={{ marginBottom: 32, fontSize: 28 }}>React PopupView</h1>
      
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Toast - Full width notifications</div>
        <ToastTopExample />
        <ToastBottomExample />
      </div>
      
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Popup - Center modal with scale</div>
        <PopupScaleExample />
      </div>
      
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Floater - Floating notifications</div>
        <FloaterTopExample />
        <FloaterBottomExample />
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Sheet - Bottom sheet (drag to dismiss)</div>
        <SheetExample />
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>Side - Slide from sides</div>
        <SideExample />
      </div>

      <div style={styles.section}>
        <div style={styles.sectionTitle}>All Positions</div>
        <AllPositionsExample />
      </div>
    </div>
  );
};

export default App;
