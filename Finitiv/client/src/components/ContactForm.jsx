import React, {useState} from 'react'

export default function ContactForm(){
  const [state, setState] = useState({name:'',email:'',message:''})
  const [resp, setResp] = useState(null)
  const [loading, setLoading] = useState(false)

  const onChange = (e)=> setState({...state,[e.target.name]: e.target.value})

  const onSubmit = async (e)=>{
    e.preventDefault(); setLoading(true); setResp(null)
    try{
      const r = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)})
      const j = await r.json()
      if (r.ok) { setResp({ok:true, msg: j.message || 'Sent'}) ; setState({name:'',email:'',message:''}) }
      else setResp({ok:false, msg: j.error || 'Error'})
    }catch(err){ setResp({ok:false, msg: err.message}) }
    setLoading(false)
  }

  return (
    <form id="contact-form" className="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <input name="name" placeholder="Your name" value={state.name} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={state.email} onChange={onChange} required />
      </div>
      <textarea name="message" placeholder="Tell us a little about your event" value={state.message} onChange={onChange} required />
      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
      {resp && <div className="form-response" style={{color: resp.ok ? 'green' : 'crimson'}}>{resp.msg}</div>}
    </form>
  )
}
