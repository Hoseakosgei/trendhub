import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, Smartphone, CreditCard, Wallet } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatKES } from '@/data/products'
import toast from 'react-hot-toast'
import styles from './CheckoutPage.module.css'

const STEPS = ['Address', 'Payment', 'Review']

export default function CheckoutPage() {
  const [step, setStep]     = useState(0)
  const [paying, setPaying] = useState(false)
  const [payMethod, setPayMethod] = useState('mpesa')
  const [form, setForm] = useState({ name:'', email:'', phone:'', county:'', town:'', street:'' })
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()

  const subtotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const delivery  = subtotal >= 3000 ? 0 : 350
  const total     = subtotal + delivery

  function handleField(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })) }

  function nextStep(e) {
    e.preventDefault()
    if (step < 2) setStep(s => s + 1)
  }

  function handlePay(e) {
    e.preventDefault()
    setPaying(true)
    setTimeout(() => {
      clearCart()
      navigate('/order-confirmation')
    }, 2000)
  }

  return (
    <div className={`page ${styles.page}`}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        {/* Step Progress */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={s} className={styles.stepItem}>
              <div className={`${styles.stepDot} ${i < step ? styles.stepDone : ''} ${i === step ? styles.stepActive : ''}`}>
                {i < step ? <Check size={14}/> : i + 1}
              </div>
              <span className={`${styles.stepLabel} ${i === step ? styles.stepLabelActive : ''}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.stepLineDone : ''}`} />}
            </div>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Form */}
          <div className={styles.formSection}>

            {/* Step 0 – Address */}
            {step === 0 && (
              <form onSubmit={nextStep} className={styles.form}>
                <h2 className={styles.formTitle}>Delivery Address</h2>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input required name="name" value={form.name} onChange={handleField} className="form-input" placeholder="John Kamau" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input required name="phone" value={form.phone} onChange={handleField} className="form-input" placeholder="0712 345 678" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input required type="email" name="email" value={form.email} onChange={handleField} className="form-input" placeholder="john@email.com" />
                </div>
                <div className={styles.row2}>
                  <div className="form-group">
                    <label className="form-label">County *</label>
                    <select required name="county" value={form.county} onChange={handleField} className="form-select">
                      <option value="">Select county</option>
                      {['Nairobi','Mombasa','Kisumu','Nakuru','Eldoret','Thika','Machakos'].map(c=>(
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Town *</label>
                    <input required name="town" value={form.town} onChange={handleField} className="form-input" placeholder="Westlands" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Street Address *</label>
                  <input required name="street" value={form.street} onChange={handleField} className="form-input" placeholder="Westlands Road, Apt 4B" />
                </div>
                <button type="submit" className="btn btn-primary btn-full btn-lg" style={{marginTop:8}}>
                  Continue to Payment <ChevronRight size={18}/>
                </button>
              </form>
            )}

            {/* Step 1 – Payment */}
            {step === 1 && (
              <form onSubmit={nextStep} className={styles.form}>
                <h2 className={styles.formTitle}>Payment Method</h2>
                <div className={styles.payMethods}>
                  {[
                    { id:'mpesa',  icon:<Smartphone size={22}/>, label:'M-Pesa', sub:'Enter your M-Pesa number to receive STK push' },
                    { id:'card',   icon:<CreditCard size={22}/>, label:'Visa / Mastercard', sub:'Secure card payment via Stripe' },
                    { id:'paypal', icon:<Wallet size={22}/>,     label:'PayPal', sub:'Pay using your PayPal account' },
                  ].map(m => (
                    <label key={m.id} className={`${styles.payMethod} ${payMethod===m.id ? styles.payMethodActive : ''}`}>
                      <input type="radio" name="pay" value={m.id} checked={payMethod===m.id} onChange={() => setPayMethod(m.id)} className={styles.payRadio}/>
                      <span className={styles.payIcon}>{m.icon}</span>
                      <div>
                        <p className={styles.payLabel}>{m.label}</p>
                        <p className={styles.paySub}>{m.sub}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {payMethod === 'mpesa' && (
                  <div className="form-group" style={{marginTop:16}}>
                    <label className="form-label">M-Pesa Phone Number *</label>
                    <input required className="form-input" placeholder="0712 345 678" defaultValue={form.phone}/>
                    <p className="form-error" style={{color:'var(--gray-400)',fontSize:12,marginTop:4}}>
                      ℹ️ You will receive an STK push prompt on your phone to enter your PIN.
                    </p>
                  </div>
                )}

                {payMethod === 'card' && (
                  <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:12}}>
                    <div className="form-group">
                      <label className="form-label">Card Number *</label>
                      <input required className="form-input" placeholder="4242 4242 4242 4242" maxLength={19}/>
                    </div>
                    <div className={styles.row2}>
                      <div className="form-group">
                        <label className="form-label">Expiry *</label>
                        <input required className="form-input" placeholder="MM / YY" maxLength={7}/>
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV *</label>
                        <input required className="form-input" placeholder="123" maxLength={4} type="password"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Cardholder Name *</label>
                      <input required className="form-input" placeholder="JOHN KAMAU" defaultValue={form.name}/>
                    </div>
                  </div>
                )}

                <div style={{display:'flex',gap:12,marginTop:16}}>
                  <button type="button" onClick={() => setStep(0)} className="btn btn-outline">Back</button>
                  <button type="submit" className="btn btn-primary" style={{flex:1}}>
                    Review Order <ChevronRight size={18}/>
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 – Review */}
            {step === 2 && (
              <form onSubmit={handlePay} className={styles.form}>
                <h2 className={styles.formTitle}>Review Your Order</h2>

                <div className={styles.reviewSection}>
                  <h4 className={styles.reviewHeading}>Delivery Address</h4>
                  <p>{form.name}</p>
                  <p>{form.street}, {form.town}, {form.county}</p>
                  <p>{form.phone} · {form.email}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h4 className={styles.reviewHeading}>Payment</h4>
                  <p>{payMethod === 'mpesa' ? '📱 M-Pesa' : payMethod === 'card' ? '💳 Card' : '💼 PayPal'}</p>
                </div>

                <div className={styles.reviewSection}>
                  <h4 className={styles.reviewHeading}>Items ({items.reduce((n,i)=>n+i.quantity,0)})</h4>
                  {items.map(item => (
                    <div key={item.id} className={styles.reviewItem}>
                      <img src={item.image} alt={item.name} className={styles.reviewItemImg}/>
                      <div style={{flex:1}}>
                        <p style={{fontSize:14,fontWeight:500}}>{item.name}</p>
                        <p style={{fontSize:12,color:'var(--gray-400)'}}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{fontWeight:700,fontFamily:'var(--font-display)'}}>{formatKES(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <p className={styles.agreement}>
                  By placing this order, you agree to TrendHub Kenya's <a href="#" style={{color:'var(--primary)'}}>Terms of Service</a> and <a href="#" style={{color:'var(--primary)'}}>Privacy Policy</a>.
                </p>

                <div style={{display:'flex',gap:12,marginTop:16}}>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-outline">Back</button>
                  <button type="submit" disabled={paying} className="btn btn-primary" style={{flex:1}}>
                    {paying ? '⏳ Processing…' : `Pay ${formatKES(total)}`}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary sidebar */}
          <div className={styles.sidebar}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            <div className={styles.summaryItems}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImg}>
                    <img src={item.image} alt={item.name}/>
                    <span className={styles.qtyBadge}>{item.quantity}</span>
                  </div>
                  <p style={{fontSize:13,flex:1,color:'var(--gray-700)'}}>{item.name}</p>
                  <p style={{fontSize:13,fontWeight:600,color:'var(--navy)',flexShrink:0}}>{formatKES(item.price*item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className={styles.summaryLines}>
              <div className={styles.line}><span>Subtotal</span><span>{formatKES(subtotal)}</span></div>
              <div className={styles.line}><span>Delivery</span><span style={{color:delivery===0?'var(--success)':'inherit'}}>{delivery===0?'FREE':formatKES(delivery)}</span></div>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{formatKES(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
