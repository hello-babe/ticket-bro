// frontend/src/pages/auth/_authShared.jsx
// Shared primitives used by all 6 auth pages

import React from 'react';
import { Link } from 'react-router-dom';

// Global input style injected once
const INPUT_STYLE = `
  .af-input { width:100%;background:transparent;outline:none;border:none;
    font-size:14px;color:var(--foreground,#111);font-family:inherit; }
  .af-input::placeholder { color:var(--muted-foreground,#9ca3af); }
  .af-field-wrap:focus-within { border-color:#a3e635 !important; }
`;

// ── Field ─────────────────────────────────────────────────────────────────────
export const Field = ({ label, error, left, right, hint, children }) => (
  <div style={{display:'flex',flexDirection:'column',gap:5}}>
    <style>{INPUT_STYLE}</style>
    {label && <label style={{fontSize:12.5,fontWeight:600,color:'var(--foreground,#111)',display:'block'}}>{label}</label>}
    <div className="af-field-wrap" style={{
      display:'flex',alignItems:'center',gap:8,
      padding:'0 12px',height:46,borderRadius:12,
      border:`1.5px solid ${error?'#ef4444':'var(--border,#e5e7eb)'}`,
      background:'var(--card,#fff)',transition:'border-color .15s',
    }}>
      {left  && <span style={{color:'var(--muted-foreground,#9ca3af)',flexShrink:0,display:'flex'}}>{left}</span>}
      <div style={{flex:1,minWidth:0}}>{children}</div>
      {right && <span style={{color:'var(--muted-foreground,#9ca3af)',flexShrink:0,display:'flex'}}>{right}</span>}
    </div>
    {hint && !error && <p style={{fontSize:11,color:'var(--muted-foreground,#9ca3af)',margin:0}}>{hint}</p>}
    {error && <p style={{fontSize:11.5,color:'#ef4444',margin:0}}>{error}</p>}
  </div>
);

// ── Spinner ───────────────────────────────────────────────────────────────────
export const Spinner = () => (
  <>
    <span style={{
      width:16,height:16,borderRadius:'50%',
      border:'2px solid rgba(0,0,0,0.2)',borderTopColor:'#000',
      display:'inline-block',animation:'afSpin .65s linear infinite',
    }}/>
    <style>{`@keyframes afSpin{to{transform:rotate(360deg)}}`}</style>
  </>
);

// ── Submit button ─────────────────────────────────────────────────────────────
export const SubmitBtn = ({ loading, disabled, children }) => (
  <button type="submit" disabled={loading||disabled} style={{
    width:'100%',height:46,borderRadius:12,
    background:'#a3e635',color:'#000',
    border:'none',fontSize:14,fontWeight:700,
    cursor:loading||disabled?'not-allowed':'pointer',
    opacity:loading||disabled?.6:1,
    display:'flex',alignItems:'center',justifyContent:'center',gap:8,
    transition:'filter .15s,opacity .15s',fontFamily:'inherit',
  }}
    onMouseEnter={e=>{if(!loading&&!disabled)e.currentTarget.style.filter='brightness(1.08)';}}
    onMouseLeave={e=>{e.currentTarget.style.filter='brightness(1)';}}
  >
    {loading ? <Spinner/> : children}
  </button>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const Divider = ({ label }) => (
  <div style={{display:'flex',alignItems:'center',gap:12,margin:'2px 0'}}>
    <div style={{flex:1,height:1,background:'var(--border,#e5e7eb)'}}/>
    <span style={{fontSize:10.5,fontWeight:700,color:'var(--muted-foreground,#9ca3af)',letterSpacing:'1.5px',whiteSpace:'nowrap'}}>{label}</span>
    <div style={{flex:1,height:1,background:'var(--border,#e5e7eb)'}}/>
  </div>
);

// ── Error banner ──────────────────────────────────────────────────────────────
export const ErrorBanner = ({ message }) => message ? (
  <div style={{
    padding:'10px 14px',borderRadius:10,marginBottom:2,
    background:'rgba(239,68,68,0.06)',border:'1px solid rgba(239,68,68,0.25)',
    fontSize:12.5,color:'#ef4444',lineHeight:1.5,
  }}>{message}</div>
) : null;

// ── Unverified warning ────────────────────────────────────────────────────────
export const UnverifiedBanner = () => (
  <div style={{
    padding:'12px 14px',borderRadius:10,marginBottom:2,
    background:'rgba(234,179,8,0.06)',border:'1px solid rgba(234,179,8,0.28)',
    display:'flex',gap:10,alignItems:'flex-start',
  }}>
    <span style={{fontSize:16,flexShrink:0}}>✉️</span>
    <div>
      <p style={{fontSize:12.5,fontWeight:700,color:'#ca8a04',margin:'0 0 3px'}}>Email not verified</p>
      <p style={{fontSize:11.5,color:'var(--muted-foreground,#6b7280)',margin:0,lineHeight:1.55}}>
        A new verification link has been sent to your inbox. Check your email to activate your account.
      </p>
    </div>
  </div>
);

// ── Auth heading ──────────────────────────────────────────────────────────────
export const AuthHeading = ({ title, subtitle }) => (
  <div style={{marginBottom:24}}>
    <h1 style={{
      fontSize:'clamp(1.5rem,2.5vw,1.8rem)',fontWeight:900,
      letterSpacing:'-0.5px',margin:'0 0 6px',color:'var(--foreground,#111)',
    }}>{title}</h1>
    {subtitle && <p style={{fontSize:13.5,color:'var(--muted-foreground,#6b7280)',lineHeight:1.6,margin:0}}>{subtitle}</p>}
  </div>
);

// ── Footer link row ───────────────────────────────────────────────────────────
export const AuthFooter = ({ text, linkText, to }) => (
  <p style={{textAlign:'center',marginTop:24,fontSize:13,color:'var(--muted-foreground,#6b7280)'}}>
    {text}{' '}
    <Link to={to} style={{fontWeight:700,color:'var(--foreground,#111)',textDecoration:'none'}}
      onMouseEnter={e=>e.target.style.color='#a3e635'}
      onMouseLeave={e=>e.target.style.color='var(--foreground,#111)'}
    >{linkText}</Link>
  </p>
);

// ── Status card (verify/reset success or error) ───────────────────────────────
export const StatusCard = ({ icon, iconBg, iconBorder, title, message, children }) => (
  <div style={{textAlign:'center'}}>
    <div style={{
      width:64,height:64,borderRadius:18,
      background:iconBg,border:`1px solid ${iconBorder}`,
      display:'flex',alignItems:'center',justifyContent:'center',
      margin:'0 auto 24px',
    }}>{icon}</div>
    <h1 style={{fontSize:24,fontWeight:800,marginBottom:8,letterSpacing:'-0.5px',color:'var(--foreground,#111)'}}>{title}</h1>
    <p style={{fontSize:13.5,color:'var(--muted-foreground,#6b7280)',lineHeight:1.65,marginBottom:28}}>{message}</p>
    {children}
  </div>
);

// ── Password strength checklist ───────────────────────────────────────────────
const Req = ({ met, label }) => (
  <div style={{display:'flex',alignItems:'center',gap:6}}>
    <div style={{
      width:14,height:14,borderRadius:'50%',flexShrink:0,
      background:met?'#a3e635':'var(--border,#e5e7eb)',
      display:'flex',alignItems:'center',justifyContent:'center',
      transition:'background .2s',
    }}>
      {met && <svg width="8" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
    <span style={{fontSize:11.5,color:met?'var(--foreground,#111)':'var(--muted-foreground,#9ca3af)'}}>{label}</span>
  </div>
);

export const PasswordChecklist = ({ password }) => {
  const reqs = [
    { label:'8+ characters',     met: password.length >= 8 },
    { label:'Uppercase letter',  met: /[A-Z]/.test(password) },
    { label:'Number',            met: /[0-9]/.test(password) },
    { label:'Special character', met: /[@$!%*?&]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div style={{
      display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px 16px',
      padding:'12px 14px',borderRadius:10,
      background:'var(--muted,rgba(0,0,0,0.03))',
      border:'1px solid var(--border,#e5e7eb)',
    }}>
      {reqs.map(r=><Req key={r.label} {...r}/>)}
    </div>
  );
};

// ── Google & Facebook OAuth buttons ──────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const FbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SocialBtn = ({ onClick, icon, label }) => (
  <button onClick={onClick} type="button" style={{
    flex:1,height:44,borderRadius:12,
    border:'1.5px solid var(--border,#e5e7eb)',
    background:'var(--card,#fff)',
    display:'flex',alignItems:'center',justifyContent:'center',gap:8,
    fontSize:13.5,fontWeight:600,color:'var(--foreground,#111)',
    cursor:'pointer',transition:'border-color .15s,background .15s',fontFamily:'inherit',
  }}
    onMouseEnter={e=>{e.currentTarget.style.borderColor='#a3e635';e.currentTarget.style.background='rgba(163,230,53,0.04)';}}
    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border,#e5e7eb)';e.currentTarget.style.background='var(--card,#fff)';}}
  >
    {icon}{label}
  </button>
);

export const SocialLogins = ({ googleFn, facebookFn }) => (
  <div style={{display:'flex',gap:10}}>
    <SocialBtn onClick={googleFn}   icon={<GoogleIcon/>} label="Google"/>
    <SocialBtn onClick={facebookFn} icon={<FbIcon/>}     label="Facebook"/>
  </div>
);
