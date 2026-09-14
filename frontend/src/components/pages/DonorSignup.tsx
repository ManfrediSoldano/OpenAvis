import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import BloodPlasmaBanner from "./BloodPlasmaBanner";
import "./DonorSignup.css";
import { FloatLabel } from "primereact/floatlabel";
import { Fieldset } from 'primereact/fieldset';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import CodiceFiscale from "codice-fiscale-js";
import { Donor } from "../../../../shared/models/donor";


const exclusionPdf = "https://lineeguida.avis.it/wp-content/uploads/2025/01/Approfondimento-4.-Criteri-di-esclusione-temporanea-e-permanente-dalla-donazione.pdf";


const transfusionCenters = [
  { label: "Ospedale Manzoni Lecco", value: "AvisLecco", url: "http://www.avislecco.it/avis/" },
  { label: "Ospedale Vimercate", value: "AvisVimercate", url: "https://avisvimercate.it/" },
  { label: "Ospedali di Bergamo", value: "AvisBergamo", url: "https://avisbergamo.it/" }
];

const educationOptions = [
  { label: "Nessuno", value: "none" },
  { label: "Licenza Elementare", value: "primary_school" },
  { label: "Licenza Media Inferiore", value: "middle_school" },
  { label: "Diploma", value: "diploma" },
  { label: "Laurea", value: "degree" }
];

const donationPreferencesOptions = [
  { label: "Lunedì", value: "monday" },
  { label: "Martedì", value: "tuesday" },
  { label: "Mercoledì", value: "wednesday" },
  { label: "Giovedì", value: "thursday" },
  { label: "Venerdì", value: "friday" },
  { label: "Sabato", value: "saturday" },
  { label: "Domenica", value: "sunday" }
];

const professionOptions = [
  { label: "Agricoltore", value: "farmer" },
  { label: "Artigiano", value: "artisan" },
  { label: "Commerciante", value: "merchant" },
  { label: "Impiegato", value: "employee" },
  { label: "Insegnante", value: "teacher" },
  { label: "Operaio", value: "worker" },
  { label: "Professionista", value: "professional" },
  { label: "Militare", value: "military" },
  { label: "Religioso", value: "religious" },
  { label: "Altro", value: "other" }
];

const nonProfessionalConditionOptions = [
  { label: "Disoccupato", value: "unemployed" },
  { label: "Studente", value: "student" },
  { label: "Casalinga", value: "housewife" },
  { label: "Pensionato", value: "pensioner" }
];

/**
 * Determines the local AVIS (Merate/Brivio/Missaglia) based on the domicile town.
 * If the domicile town matches "Brivio" or "Missaglia" (case-insensitive, trimmed),
 * the corresponding AVIS is returned. Otherwise defaults to "Merate".
 */
function getLocalAvisFromDomicile(domicileTown: string): 'Merate' | 'Brivio' | 'Missaglia' {
  const normalized = domicileTown.trim().toLowerCase();
  if (normalized === 'brivio') return 'Brivio';
  if (normalized === 'missaglia') return 'Missaglia';
  return 'Merate';
}


interface FormState extends Donor {
  donateInMerate: boolean | null;
  transfusionCenter: string;
  residenceSameAsDomicile: boolean;
  privacyAccepted: boolean;
  consorelleAccepted: boolean;
}


interface StepProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setAck: React.Dispatch<React.SetStateAction<boolean>>;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  otp: string;
  otpError: string;
  setOtpError: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: string;
  navigate: (path: string) => void;
}


const InputWithIcon: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <IconField iconPosition="left" style={{ width: '100%' }}>
    <InputIcon className={icon} />
    {children}
  </IconField>
);


const Step1: React.FC<StepProps> = ({ setStep }) => (
  <div className="donor-signup-container animated-fade-in">
    <div className="donor-step-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
      Informativa sui requisiti per la donazione
    </div>
    <div className="donor-step-desc" style={{ marginBottom: '2rem' }}>
      Per diventare donatore AVIS è necessario possedere alcuni requisiti fondamentali di base.
    </div>

    <div className="requirements-grid">
      <div className="requirement-card">
        <i className="pi pi-calendar" />
        <h3>Età</h3>
        <p>Per la prima donazione è necessario avere un'età compresa tra 18 e 60 anni.</p>
        <div className="requirement-badge">18 - 60 anni</div>
      </div>

      <div className="requirement-card">
        <i className="pi pi-box" />
        <h3>Peso</h3>
        <p>Per poter donare in sicurezza è necessario pesare almeno 50 kg.</p>
        <div className="requirement-badge">Minimo 50 kg</div>
      </div>
    </div>

    <div className="donor-step-desc" style={{ marginTop: '2rem', fontSize: '1rem' }}>
      Esistono altri criteri di idoneità legati allo stato di salute e allo stile di vita.<br />
      <a href={exclusionPdf} target="_blank" rel="noopener noreferrer" className="requirements-link">
        <i className="pi pi-external-link" style={{ marginRight: '5px' }} />
        Consulta i criteri di esclusione (PDF)
      </a>
    </div>

    <div className="medical-warning">
      <i className="pi pi-info-circle" />
      <span>L'idoneità definitiva alla donazione potrà essere confermata solo dal medico durante la prima visita.</span>
    </div>

    <div className="donor-step-actions">
      <Button label="Ho capito, procedi" icon="pi pi-arrow-right" onClick={() => setStep(2)} className="p-button-lg" />
    </div>
  </div>
);


const Step2: React.FC<StepProps> = ({ form, setForm, setStep }) => (
  <div className="donor-signup-container animated-fade-in">
    <div className="donor-step-title">Scelta del Centro Trasfusionale</div>
    <div className="donor-step-desc">
      AVIS Merate coordina i donatori che donano presso l'<b>Ospedale Mandic di Merate</b>.<br />
      Dove preferisci effettuare le tue donazioni?
    </div>

    <div className="donor-center-options" style={{ marginBottom: '2rem' }}>
      <div
        className={`donor-center-option ${form.donateInMerate === true ? 'selected' : ''}`}
        onClick={() => setForm(f => ({ ...f, donateInMerate: true, transfusionCenter: "" }))}
        style={{ width: '250px', height: '150px' }}
      >
        <i className="pi pi-home" style={{ fontSize: '2.5rem' }}></i>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Merate</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ospedale Mandic</div>
        </div>
      </div>

      <div
        className={`donor-center-option ${form.donateInMerate === false ? 'selected' : ''}`}
        onClick={() => setForm(f => ({ ...f, donateInMerate: false }))}
        style={{ width: '250px', height: '150px' }}
      >
        <i className="pi pi-map-marker" style={{ fontSize: '2.5rem' }}></i>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Altro centro</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Fuori zona Merate</div>
        </div>
      </div>
    </div>

    {form.donateInMerate === false && (
      <div className="animated-fade-in" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
        <Message
          severity="warn"
          content={() => (
            <div className="flex align-items-center">
              <i className="pi pi-exclamation-triangle" style={{ fontSize: '1.5rem', marginRight: '1rem' }}></i>
              <div style={{ textAlign: 'left' }}>
                <b>Attenzione:</b> Verrai reindirizzato al portale dell'AVIS competente per il territorio scelto.
              </div>
            </div>
          )}
          style={{ width: '100%', marginBottom: '1.5rem' }}
        />
        <div className="p-field" style={{ textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 600 }}>Scegli il centro trasfusionale di riferimento:</label>
          <div className="flex flex-wrap justify-content-center gap-2">
            {transfusionCenters.map(center => (
              <Button
                key={center.value}
                label={center.label}
                icon="pi pi-external-link"
                onClick={() => window.open(center.url, '_blank')}
                className="p-button-outlined p-button-secondary"
              />
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="donor-step-actions">
      <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(1)} />
      {form.donateInMerate === true && (
        <Button label="Avanti" icon="pi pi-arrow-right" onClick={() => setStep(3)} className="p-button-raised" />
      )}
    </div>
  </div>
);


const Step3: React.FC<StepProps> = ({ form, setForm, setStep }) => {
  const [submitted, setSubmitted] = useState(false);
  const [taxCodeError, setTaxCodeError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  const validate = () => {
    return form.firstName && form.lastName && form.gender && form.birthDate &&
      form.birthPlace && form.taxCode && form.town && form.address &&
      form.phone && form.email && (form.residenceSameAsDomicile || (form.domicileTown && form.domicileAddress));
  };

  const validateTaxCode = () => {
    if (!form.taxCode || !form.firstName || !form.lastName || !form.birthPlace) return "Dati mancanti";
    const cfStr = form.taxCode.trim().toUpperCase();
    if (!cfStr) return "Codice fiscale obbligatorio";
    if (cfStr.length !== 16) return "Il codice fiscale deve essere di 16 caratteri";

    try {
      const g = form.gender === "male" ? "M" : "F";
      const bDate = form.birthDate instanceof Date ? form.birthDate : (form.birthDate ? new Date(form.birthDate) : null);
      if (!bDate || isNaN(bDate.getTime())) return "Data di nascita non valida";

      const cf = new CodiceFiscale({
        name: form.firstName,
        surname: form.lastName,
        gender: g as any,
        day: bDate.getDate(),
        month: bDate.getMonth() + 1,
        year: bDate.getFullYear(),
        birthplace: form.birthPlace.split('(')[0].trim(),
        birthplaceProvincia: ""
      });

      const generatedCf = cf.toString().toUpperCase();
      if (generatedCf !== cfStr) {
        // Check for omocodie
        const omocodes = cf.omocodie().map(o => o.toUpperCase());
        if (!omocodes.includes(cfStr)) {
          return `Il codice fiscale inserito (${cfStr}) non corrisponde ai dati anagrafici. Corretto: ${generatedCf}`;
        }
      }
    } catch (e) {
      console.error("CF Validation error", e);
      return "Impossibile validare il codice fiscale. Controlla il luogo di nascita (scrivi solo il nome del comune o dello stato estero).";
    }
    return null;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) return "Email obbligatoria";
    if (!emailRegex.test(form.email)) return "Formato email non valido";
    return null;
  };

  const validatePhone = () => {
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!form.phone) return "Telefono obbligatorio";
    if (!phoneRegex.test(form.phone)) return "Formato telefono non valido (es: 3401234567)";
    return null;
  };

  const validateAge = () => {
    if (!form.birthDate) return "Data di nascita obbligatoria";
    const today = new Date();
    const birthDate = new Date(form.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) return "Devi avere almeno 18 anni per candidarti";
    if (age > 60) return "L'età massima per la prima candidatura è 60 anni";
    return null;
  };

  const handleNext = () => {
    setSubmitted(true);
    setTaxCodeError("");
    setEmailError("");
    setPhoneError("");
    setBirthDateError("");

    if (validate()) {
      const cfError = validateTaxCode();
      const eError = validateEmail();
      const pError = validatePhone();
      const aError = validateAge();

      if (cfError || eError || pError || aError) {
        setTaxCodeError(cfError || "");
        setEmailError(eError || "");
        setPhoneError(pError || "");
        setBirthDateError(aError || "");
        return;
      }
      setStep(4);
    }
  };

  const isInvalid = (val: any) => submitted && !val;

  return (
    <div className="donor-signup-container">
      <div className="donor-step-title">Dati obbligatori</div>
      <div className="donor-step-desc">Inserisci i tuoi dati per la candidatura. Tutti i campi sono obbligatori.</div>
      <Fieldset legend="Dati personali">
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-user">
                <InputText value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className={isInvalid(form.firstName) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Nome*</label>
            </FloatLabel>
            {isInvalid(form.firstName) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-user">
                <InputText value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className={isInvalid(form.lastName) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Cognome*</label>
            </FloatLabel>
            {isInvalid(form.lastName) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
        </div>

        <div className="donor-step-form-row">
          <span style={{ textAlign: 'center' }}>
            <label style={{ color: isInvalid(form.gender) ? '#e24c4c' : 'inherit' }}>Sesso*</label><br />
            <RadioButton inputId="male" name="gender" value="male" checked={form.gender === "male"} onChange={() => setForm(f => ({ ...f, gender: "male" }))} />
            <label htmlFor="male" style={{ marginLeft: 8, marginRight: 16 }}>Maschio</label>
            <RadioButton inputId="female" name="gender" value="female" checked={form.gender === "female"} onChange={() => setForm(f => ({ ...f, gender: "female" }))} />
            <label htmlFor="female" style={{ marginLeft: 8 }}>Femmina</label>
            {isInvalid(form.gender) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
        </div>
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-calendar">
                <Calendar value={form.birthDate instanceof Date ? form.birthDate : (form.birthDate ? new Date(form.birthDate) : null)} onChange={e => setForm(f => ({ ...f, birthDate: e.value as Date }))} dateFormat="dd/mm/yy" showIcon showButtonBar maxDate={new Date()} className={(isInvalid(form.birthDate) || !!birthDateError) ? 'p-invalid' : ''} readOnlyInput={false} mask="99/99/9999" />
              </InputWithIcon>
              <label>Data di nascita*</label>
            </FloatLabel>
            {isInvalid(form.birthDate) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            {birthDateError && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>{birthDateError}</small>}
          </span>
        </div>
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-map">
                <InputText value={form.birthPlace} onChange={e => setForm({ ...form, birthPlace: e.target.value })} className={isInvalid(form.birthPlace) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Luogo di nascita*</label>
            </FloatLabel>
            {isInvalid(form.birthPlace) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-id-card">
                <InputText value={form.taxCode} onChange={e => setForm({ ...form, taxCode: e.target.value })} className={(isInvalid(form.taxCode) || !!taxCodeError) ? 'p-invalid' : ''} maxLength={16} />
              </InputWithIcon>
              <label>Codice Fiscale*</label>
            </FloatLabel>
            {isInvalid(form.taxCode) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            {taxCodeError && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>{taxCodeError}</small>}
          </span>
        </div>
      </Fieldset>

      <Fieldset legend="Dati di contatto">
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-home">
                <InputText value={form.town} onChange={e => setForm({ ...form, town: e.target.value })} className={isInvalid(form.town) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Comune di residenza*</label>
            </FloatLabel>
            {isInvalid(form.town) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-building">
                <InputText value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={isInvalid(form.address) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Via e numero di residenza*</label>
            </FloatLabel>
            {isInvalid(form.address) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
        </div>

        <div className="donor-step-form-row" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Checkbox inputId="residenceSameAsDomicile" checked={form.residenceSameAsDomicile} onChange={e => setForm(f => ({ ...f, residenceSameAsDomicile: e.checked || false }))} />
            <label htmlFor="residenceSameAsDomicile">La residenza e il domicilio combaciano</label>
          </div>
        </div>

        {!form.residenceSameAsDomicile && (
          <div className="donor-step-form-row" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s' }}>
            <span>
              <FloatLabel>
                <InputWithIcon icon="pi pi-home">
                  <InputText value={form.domicileTown} onChange={e => setForm({ ...form, domicileTown: e.target.value })} className={isInvalid(form.domicileTown) ? 'p-invalid' : ''} />
                </InputWithIcon>
                <label>Comune di domicilio*</label>
              </FloatLabel>
              {isInvalid(form.domicileTown) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            </span>
            <span>
              <FloatLabel>
                <InputWithIcon icon="pi pi-building">
                  <InputText value={form.domicileAddress} onChange={e => setForm({ ...form, domicileAddress: e.target.value })} className={isInvalid(form.domicileAddress) ? 'p-invalid' : ''} />
                </InputWithIcon>
                <label>Via e numero di domicilio*</label>
              </FloatLabel>
              {isInvalid(form.domicileAddress) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            </span>
          </div>
        )}
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-phone">
                <InputText value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} keyfilter="int" className={(isInvalid(form.phone) || !!phoneError) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Telefono*</label>
            </FloatLabel>
            {isInvalid(form.phone) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            {phoneError && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>{phoneError}</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-envelope">
                <InputText value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} keyfilter="email" className={(isInvalid(form.email) || !!emailError) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Email*</label>
            </FloatLabel>
            {isInvalid(form.email) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
            {emailError && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>{emailError}</small>}
          </span>
        </div>
      </Fieldset>
      <div className="donor-step-actions">
        <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(2)} />
        <Button label="Avanti" icon="pi pi-arrow-right" onClick={handleNext} />
      </div>
    </div>
  );
};


const Step4: React.FC<StepProps> = ({ form, setForm, setStep, setLoading, setError, setAck, loading, error }) => (
  <div className="donor-signup-container">
    <div className="donor-step-title">Dati facoltativi</div>
    <div className="donor-step-desc">Questi dati sono opzionali ma ci aiutano a conoscerti meglio.</div>
    <div className="donor-step-form-row">
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-book">
            <Dropdown
              id="education"
              value={form.education}
              options={educationOptions}
              onChange={e => setForm({ ...form, education: e.value })}
              placeholder="Seleziona"
              showClear
              className="w-full"
            />
          </InputWithIcon>
          <label htmlFor="education">Titolo di studio</label>
        </FloatLabel>
      </span>
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-heart">
            <Dropdown
              id="donationPreferences"
              value={form.donationPreferences}
              options={donationPreferencesOptions}
              onChange={e => setForm({ ...form, donationPreferences: e.value })}
              placeholder="Seleziona"
              showClear
              className="w-full"
            />
          </InputWithIcon>
          <label htmlFor="donationPreferences">Preferenze per la donazione</label>
        </FloatLabel>
      </span>
    </div>
    <div className="donor-step-form-row">
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-briefcase">
            <Dropdown
              id="profession"
              value={form.profession}
              options={professionOptions}
              onChange={e => setForm({ ...form, profession: e.value })}
              placeholder="Seleziona"
              showClear
              className="w-full"
            />
          </InputWithIcon>
          <label htmlFor="profession">Professione</label>
        </FloatLabel>
      </span>
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-briefcase">
            <Dropdown
              id="nonProfessionalCondition"
              value={form.nonProfessionalCondition}
              options={nonProfessionalConditionOptions}
              onChange={e => setForm({ ...form, nonProfessionalCondition: e.value })}
              placeholder="Seleziona"
              showClear
              className="w-full"
            />
          </InputWithIcon>
          <label htmlFor="nonProfessionalCondition">Condizione non professionale</label>
        </FloatLabel>
      </span>
    </div>
    <div className="donor-step-form-row">
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-users">
            <InputText value={form.otherAssociations} onChange={e => setForm({ ...form, otherAssociations: e.target.value })} />
          </InputWithIcon>
          <label>Iscrizione ad altre associazioni</label>
        </FloatLabel>
      </span>
    </div>
    <div className="donor-step-actions">
      <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(3)} />
      <Button label="Avanti" icon="pi pi-arrow-right" onClick={() => setStep(5)} />
    </div>
  </div >
);


const Step5: React.FC<StepProps> = ({ form, setForm, setStep, setLoading, setError, setAck, loading, error }) => {
  const needsConsorelleWarning = form.localAvis === 'Brivio' || form.localAvis === 'Missaglia';

  return (
    <div className="donor-signup-container animated-fade-in">
      <div className="donor-step-title">Associazione di Appartenenza</div>
      <div className="donor-step-desc">
        Puoi scegliere di iscriverti a un'associazione (entità legale) diversa da AVIS Merate tra le AVIS che affluiscono al Centro Trasfusionale di Merate:
      </div>

      <div className="donor-center-options" style={{ marginBottom: '2rem' }}>
        <div
          className={`donor-center-option ${form.localAvis === 'Merate' ? 'selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, localAvis: 'Merate', consorelleAccepted: false }))}
        >
          <i className="pi pi-building"></i>
          <span>AVIS Comunale di Merate ODV</span>
        </div>
        <div
          className={`donor-center-option ${form.localAvis === 'Missaglia' ? 'selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, localAvis: 'Missaglia' }))}
        >
          <i className="pi pi-building"></i>
          <span>AVIS Comunale di Missaglia ODV</span>
        </div>
        <div
          className={`donor-center-option ${form.localAvis === 'Brivio' ? 'selected' : ''}`}
          onClick={() => setForm(f => ({ ...f, localAvis: 'Brivio' }))}
        >
          <i className="pi pi-building"></i>
          <span>AVIS Comunale di Brivio ODV</span>
        </div>
      </div>

      {needsConsorelleWarning && (
        <div className="animated-fade-in" style={{ maxWidth: '800px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
          <Message
            severity="info"
            className="w-full"
            content={() => (
              <div style={{ padding: '0.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#005a91', fontSize: '1.1rem' }}>
                  <i className="pi pi-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  Informativa Gestione Dati tra associazioni
                </div>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  AVIS Comunale Merate gestisce operativamente gli aspiranti alla donazione e le attività di raccolta anche per conto delle AVIS consorelle di <b>Brivio</b> e <b>Missaglia</b>.<br />
                  Selezionando questa sede, i tuoi dati personali saranno trattati da AVIS Merate (in qualità di <b>Responsabile del Trattamento dati</b>) e condivisi con l'associazione prescelta ai fini della gestione del rapporto associativo e delle donazioni, in conformità al <b>Regolamento UE 2016/679 (GDPR)</b>.
                </p>
              </div>
            )}
          />
          <div className="flex align-items-center mt-4 p-2" style={{ border: 'none', background: 'transparent' }}>
            <Checkbox
              inputId="consorelleAccepted"
              checked={form.consorelleAccepted}
              onChange={e => setForm(f => ({ ...f, consorelleAccepted: e.checked ?? false }))}
              className={(!form.consorelleAccepted && error === 'CONSORELLE_ERR') ? 'p-invalid' : ''}
            />
            <label htmlFor="consorelleAccepted" style={{ marginLeft: '1rem', cursor: 'pointer', fontWeight: 500, color: '#444', fontSize: '0.92rem' }}>
              Dichiaro di aver compreso che <b>AVIS Merate</b> agirà come Responsabile del Trattamento dei dati per la gestione operativa della mia candidatura per conto della sede scelta.
            </label>
          </div>
        </div>
      )}

      <div className="donor-step-actions">
        <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(4)} />
        <Button
          label="Invia il codice"
          icon="pi pi-send"
          disabled={needsConsorelleWarning && !form.consorelleAccepted}
          onClick={() => {
            setLoading(true);
            setError("");
            client.post('/api/send-otp', { email: form.email })
              .then(() => setAck(true))
              .catch((err: any) => {
                console.error("Send OTP failed", err);
              })
              .finally(() => setLoading(false));

            setStep(6);
          }}
        />
      </div>
      {loading && <Message severity="info" text="Invio codice OTP in corso..." style={{ marginTop: '1rem' }} />}
      {error && <Message severity="error" text={error} style={{ marginTop: '1rem' }} />}
    </div>
  );
};


const Step6: React.FC<StepProps> = ({ form, setForm, setStep, otp, setOtp, otpError, setOtpError, setSuccess }) => {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const privacyCheckboxRef = React.useRef<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    setResending(true);
    setOtpError("");
    setCanResend(false);
    try {
      await client.post('/api/send-otp', { email: form.email, mode: 'resend' });
      setTimer(30); // Reset timer
    } catch (err: any) {
      console.error("Resend OTP failed", err);
      setOtpError("Errore durante l'invio del codice. Riprova.");
      setCanResend(true); // Allow retry immediately on error? Or keep timer? Let's keep it consistent.
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="donor-signup-container">
      <div className="donor-step-title">Conferma la tua iscrizione</div>
      <div className="donor-step-desc">
        Abbiamo inviato un codice OTP alla tua email <strong>{form.email}</strong>.<br />
        <span style={{ color: '#d97706', fontWeight: 'bold' }}>Controlla anche nella cartella spam.</span>
        <br />Inseriscilo qui sotto per confermare la candidatura.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <InputText
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          maxLength={6}
          style={{ fontSize: '1.5rem', width: 180, textAlign: 'center', letterSpacing: '0.5rem' }}
          keyfilter="int"
          placeholder="------"
          disabled={isSubmitting}
        />
      </div>
      {otpError && <Message severity="error" text={otpError} className="w-full mb-3" />}
      {isSubmitting && <Message severity="info" text="Stiamo completando la richiesta, attendi un momento..." className="w-full mb-3" />}

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Button
          label={resending ? "Invio in corso..." : (canResend ? "Invia nuovo codice" : `Invia nuovo codice (${timer}s)`)}
          icon="pi pi-refresh"
          className="p-button-text p-button-sm"
          onClick={handleResend}
          disabled={!canResend || resending || isSubmitting}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '2rem', padding: '0 1rem' }}>
        <Checkbox
          inputId="privacyAccepted"
          checked={form.privacyAccepted}
          onChange={e => setForm(f => ({ ...f, privacyAccepted: e.checked ?? false }))}
        />
        <label htmlFor="privacyAccepted" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
          Dichiaro di aver letto e accettato la <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#d32f2f', fontWeight: 'bold', textDecoration: 'underline' }}>Privacy Policy</a> per il trattamento dei miei dati personali.
        </label>
      </div>

      <div className="donor-step-actions">
        <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(5)} disabled={isSubmitting} />
        <Button label="Conferma Iscrizione" icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-check"} loading={isSubmitting} disabled={!form.privacyAccepted} onClick={async () => {
          if (!form.privacyAccepted) return;
          try {
            setIsSubmitting(true);
            setOtpError("");
            // Final Submit: Data + OTP
            const dataToSend = form;
            const res = await client.post('/api/signup', { ...dataToSend, otp });
            if (res.data.success) {
              setSuccess(true);
              setStep(7);
            }
          } catch (err: any) {
            console.error("Signup verify failed", err);
            setOtpError(err.response?.data?.error || "Codice OTP non valido o errore nel salvataggio.");
          } finally {
            setIsSubmitting(false);
          }
        }} />
      </div>
    </div>
  );
};


const Step7: React.FC<StepProps> = ({ navigate }) => (
  <div className="donor-signup-container" style={{ textAlign: 'center' }}>
    <div className="donor-step-title">Grazie per la tua candidatura!</div>
    <div className="donor-step-desc">Abbiamo ricevuto la tua richiesta. Riceverai una mail di conferma a breve.</div>
    <Button label="Torna alla home" icon="pi pi-home" onClick={() => navigate("/")} className="p-button-secondary" style={{ marginTop: '2rem' }} />
  </div>
);



const DonorSignup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [ack, setAck] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState("");
  const [form, setForm] = useState<FormState>({
    donateInMerate: true,
    transfusionCenter: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: undefined,
    birthPlace: "",
    taxCode: "",
    address: "",
    town: "",
    domicileAddress: "",
    domicileTown: "",
    phone: "",
    email: "",
    education: undefined,
    donationPreferences: undefined,
    profession: undefined,
    nonProfessionalCondition: undefined,
    otherAssociations: "",
    localAvis: 'Merate',
    residenceSameAsDomicile: true,
    privacyAccepted: false,
    consorelleAccepted: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Auto-assign localAvis based on domicile town
  useEffect(() => {
    const effectiveDomicile = form.residenceSameAsDomicile ? form.town : (form.domicileTown || '');
    const computed = getLocalAvisFromDomicile(effectiveDomicile || '');
    if (computed !== form.localAvis) {
      setForm(f => ({ ...f, localAvis: computed }));
    }
  }, [form.town, form.domicileTown, form.residenceSameAsDomicile]);


  const stepProps: StepProps = {
    form, setForm, setStep, setLoading, setError, setAck, setOtp, otp, otpError, setOtpError, setSuccess, loading, error, navigate
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 {...stepProps} />;
      case 2:
        return <Step2 {...stepProps} />;
      case 3:
        return <Step3 {...stepProps} />;
      case 4:
        return <Step4 {...stepProps} />;
      case 5:
        return <Step5 {...stepProps} />;
      case 6:
        return <Step6 {...stepProps} />;
      case 7:
        return <Step7 {...stepProps} />;
      default:
        return null;
    }
  };


  return (
    <div>
      <BloodPlasmaBanner
        title="Diventare donatore non è mai stato così facile"
        description="Compila la procedura guidata per candidarti come donatore. Bastano pochi minuti!"
      />
      {renderStep()}
    </div>
  );
};


export default DonorSignup;
