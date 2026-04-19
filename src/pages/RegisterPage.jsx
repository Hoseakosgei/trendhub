import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Phone } from 'lucide-react'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'
import styles from './AuthPage.module.css'

export default function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const f = k => e => setForm(prev => ({...prev, [k]: e.target.value}))

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login({ name: form.name, email: form.email }, 'mock-token-new')
      toast.success('Account created! Welcome to TrendHub 🎉')
      navigate('/')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logo}>T</div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.sub}>Join thousands of shoppers on TrendHub Kenya</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {[
            { icon:<User size={16}/>,  key:'name',     type:'text',  placeholder:'John Kamau',      label:'Full Name' },
            { icon:<Mail size={16}/>,  key:'email',    type:'email', placeholder:'john@email.com',  label:'Email Address' },
            { icon:<Phone size={16}/>, key:'phone',    type:'tel',   placeholder:'0712 345 678',    label:'Phone Number' },
            { icon:<Lock size={16}/>,  key:'password', type:'password', placeholder:'Min. 8 characters', label:'Password' },
          ].map(({icon, key, type, placeholder, label}) => (
            <div className="form-group" key={key}>
              <label className="form-label">{label}</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>{icon}</span>
                <input
                  required type={type} value={form[key]}
                  onChange={f(key)} className={`form-input ${styles.withIcon}`}
                  placeholder={placeholder}
                  minLength={key === 'password' ? 8 : undefined}
                />
              </div>
            </div>
          ))}

          <p className={styles.terms}>
            By registering you agree to our <a href="#" style={{color:'var(--primary)'}}>Terms of Service</a> and <a href="#" style={{color:'var(--primary)'}}>Privacy Policy</a>.
          </p>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg">
            {loading ? '⏳ Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
