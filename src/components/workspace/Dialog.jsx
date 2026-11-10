import { useEffect, useRef } from 'react';
import { Icon } from './Primitives';
export default function Dialog({ title, children, close, eyebrow = 'BUILDING TOGETHER' }) {
  const ref=useRef(null), previous=useRef(document.activeElement);
  useEffect(()=>{const el=ref.current;el.showModal();return()=>{el.close();if(previous.current?.isConnected)previous.current.focus();};},[]);
  return <dialog className="inspector app-dialog" ref={ref} onCancel={close} onClick={e=>{if(e.target===ref.current)close();}} aria-labelledby="dialog-title"><div className="inspector-body"><div className="inspector-top"><span className="eyebrow">{eyebrow}</span><button className="icon-button" aria-label="Close details" onClick={close}><Icon name="close" /></button></div><h2 id="dialog-title">{title}</h2>{children}</div></dialog>;
}
