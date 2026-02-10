import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { motion } from "framer-motion";
import "primeicons/primeicons.css";
import "./NotFoundPage.css";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <motion.div
        className="notfound-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.i
          className="pi pi-exclamation-circle notfound-icon"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10
          }}
        ></motion.i>
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Pagina non trovata</h2>
        <p className="notfound-description">
          Spiacenti, la pagina che stai cercando non esiste o è stata spostata.
          Torna alla home per continuare a navigare nel sito di AVIS Merate.
        </p>
        <Button
          label="Torna alla Home"
          icon="pi pi-home"
          className="home-button"
          onClick={() => navigate("/")}
        />
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
