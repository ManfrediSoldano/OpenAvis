import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-section footer-logo">
      <img src={process.env.PUBLIC_URL + "/images/Logo_AVIS.png"} alt="AVIS Logo" className="footer-avis-logo" />
      <address>
        Piazza Don Minzoni, 5<br />
        23807 Merate (LC)<br />
        C.F. 94003940130<br />
        PEC: <a href="mailto:MERATE.COMUNALE@PEC.AVIS.IT">merate.comunale@pec.avis.it</a><br />
      </address>
      <ul className="footer-links">
        <li><Link to="/privacy-policy">Privacy policy</Link> | <Link to="/privacy-policy">Cookie policy</Link></li>
        <li><a href="#">Dati di contatto del DPO</a></li>
        <li><a href="#">Diritti dell'interessato</a></li>
        <li><a href="#">Informativa privacy per i soci</a></li>
        <li><a href="#">Privacy policy per i Social network</a></li>
      </ul>
    </div>
    <div className="footer-section footer-contacts">
      <h4>CONTATTI</h4>
      <ul>
        <li>Telefono: <a href="tel:+390399902303">039 9902303</a></li>
        <li>Email: <a href="mailto:info@avismerate.it">info@avismerate.it</a></li>
        <li>PEC: <a href="mailto:MERATE.COMUNALE@PEC.AVIS.IT">merate.comunale@pec.avis.it</a></li>
      </ul>
    </div>
    <div className="footer-section footer-links-utili">
      <h4>LINK UTILI</h4>
      <ul>
        <li><a href="#">FAQ</a></li>
        <li><a href="#">INTRANET</a></li>
        <li><a href="#">ORGANISMO DI VIGILANZA</a></li>
      </ul>
      <div className="footer-social">
        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
        <a href="#" aria-label="X"><i className="fab fa-x-twitter"></i></a>
        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
        <a href="#" aria-label="YouTube"><i className="fab fa-youtube"></i></a>
        <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </footer>
);

export default Footer;
