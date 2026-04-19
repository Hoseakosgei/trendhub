import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/store'
import toast from 'react-hot-toast'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      login({ name: 'John Kamau', email }, 'mock-token-123')
      toast.success('Welcome back!')
      navigate('/')
      setLoading(false)
    }, 1200)
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <div className={styles.logo}>T</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.sub}>Sign in to your TrendHub account</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon}/>
              <input
                required type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                className={`form-input ${styles.withIcon}`}
                placeholder="john@email.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon}/>
              <input
                required type={show ? 'text' : 'password'} value={pass}
                onChange={e => setPass(e.target.value)}
                className={`form-input ${styles.withIcon} ${styles.withIconRight}`}
                placeholder="Enter your password"
              />
              <button type="button" className={styles.togglePass} onClick={() => setShow(s=>!s)}>
                {show ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>
          </div>

          <div className={styles.forgotRow}>
            <a href="#" className={styles.forgot}>Forgot password?</a>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-full btn-lg">
            {loading ? '⏳ Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="divider-text" style={{margin:'20px 0'}}>or continue with</div>

        <div className={styles.socials}>
          <button className={`btn btn-outline ${styles.socialBtn}`}>🇬 Google</button>
          <button className={`btn btn-outline ${styles.socialBtn}`}>📘 Facebook</button>
        </div>

        <p className={styles.switch}>
          Don't have an account? <Link to="/register" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  )
}
