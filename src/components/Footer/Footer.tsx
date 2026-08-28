import logoSrc from '../../assets/logo.png'
import './Footer.css'

export function Footer() {
  return (
    <footer className="footer">
      <img src={logoSrc} alt="miCarta" className="footer__logo" />
      <p className="footer__tagline">rutas y sabores · España</p>
    </footer>
  )
}
