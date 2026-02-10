import React, { useState, useEffect } from "react";
import client from "../../api/client";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import BloodPlasmaBanner from "./BloodPlasmaBanner";
import "./DonorSignup.css";
import { FloatLabel } from "primereact/floatlabel";
import { Fieldset } from 'primereact/fieldset';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";


const exclusionPdf = "https://lineeguida.avis.it/wp-content/uploads/2025/01/Approfondimento-4.-Criteri-di-esclusione-temporanea-e-permanente-dalla-donazione.pdf";


const transfusionCenters = [
  { label: "Ospedale Manzoni Lecco", value: "AvisLecco", url: "https://www.avislecco.it/" },
  { label: "Ospedale Vimercate", value: "AvisVimercate", url: "https://www.avisvimercate.it/" },
  { label: "Ospedali di Bergamo", value: "AvisBergamo", url: "https://www.avisbergamo.it/" }
];


interface FormState {
  age: number | null;
  weight: number | null;
  noPermanentExclusion: boolean;
  donateInMerate: boolean | null;
  transfusionCenter: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: Date | null;
  birthPlace: string;
  taxCode: string;
  address: string;
  town: string;
  phone: string;
  email: string;
  education: string;
  donationPreferences: string;
  profession: string;
  nonProfessionalStatus: string;
  otherAssociations: string;
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


const Step1: React.FC<StepProps> = ({ form, setForm, setStep }) => (
  <div className="donor-signup-container">
    <div className="donor-step-banner">
      <i className="pi pi-info-circle" />
      Le risposte non saranno salvate da AVIS, servono solo per guidarti nella compilazione. Solo il medico può valutare l'idoneità definitiva.
    </div>
    <div className="donor-step-title">Controllo dei requisiti</div>
    <div className="donor-step-desc">Per candidarti devi avere tra 18 e 60 anni, pesare almeno 50kg e non avere criteri di esclusione permanente. <a href={exclusionPdf} target="_blank" rel="noopener noreferrer">Consulta i criteri di esclusione</a>.</div>
    <div className="donor-step-form-row">
      <span>
        <FloatLabel>
          <label htmlFor="age-check">Età</label>
          <InputNumber
            id="age-check"
            value={form.age}
            onValueChange={e => setForm(f => ({ ...f, age: e.value ?? null }))}
            min={18}
            max={70}
            showButtons
            suffix=" anni"
            inputStyle={{ width: 250 }}
          />
        </FloatLabel>
      </span>
      <span>
        <FloatLabel>
          <label htmlFor="weight-check">Peso*</label>
          <InputNumber
            id="weight-check"
            value={form.weight}
            onValueChange={e => setForm(f => ({ ...f, weight: e.value ?? null }))}
            min={50}
            max={200}
            showButtons
            suffix=" kg"
            inputStyle={{ width: 250 }}
          />
        </FloatLabel>
      </span>
    </div>
    <div style={{ margin: '1rem 0', textAlign: 'center' }}>
      <Checkbox inputId="noPermanentExclusion" checked={form.noPermanentExclusion} onChange={e => setForm(f => ({ ...f, noPermanentExclusion: e.checked || false }))} />
      <label htmlFor="noPermanentExclusion" style={{ marginLeft: 8 }}>Dichiaro di non avere criteri di esclusione permanente</label>
    </div>
    <div className="donor-step-actions">
      <Button label="Avanti" icon="pi pi-arrow-right" disabled={!(form.age && form.weight && form.noPermanentExclusion)} onClick={() => setStep(2)} />
    </div>
  </div>
);


const Step2: React.FC<StepProps> = ({ form, setForm, setStep }) => (
  <div className="donor-signup-container">
    <div className="donor-step-title">Dove vuoi donare?</div>
    <div className="donor-step-desc">Preferisci donare a Merate o in un altro centro trasfusionale?</div>
    <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
      <RadioButton inputId="merateYes" name="donateInMerate" value={true} checked={form.donateInMerate === true} onChange={() => setForm(f => ({ ...f, donateInMerate: true, transfusionCenter: "" }))} />
      <label htmlFor="merateYes" style={{ marginLeft: 8, marginRight: 24 }}>Merate</label>
      <RadioButton inputId="merateNo" name="donateInMerate" value={false} checked={form.donateInMerate === false} onChange={() => setForm(f => ({ ...f, donateInMerate: false }))} />
      <label htmlFor="merateNo" style={{ marginLeft: 8 }}>Altro centro</label>
    </div>
    {form.donateInMerate === false && (
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <label>Scegli il centro trasfusionale:</label>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.7rem', justifyContent: 'center' }}>
          {transfusionCenters.map(center => (
            <Button key={center.value} label={center.label} onClick={() => window.open(center.url, '_blank')} className="p-button-secondary" />
          ))}
        </div>
      </div>
    )}
    <div className="donor-step-actions">
      <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(1)} />
      {form.donateInMerate === true && (
        <Button label="Avanti" icon="pi pi-arrow-right" onClick={() => setStep(3)} />
      )}
    </div>
  </div>
);


const Step3: React.FC<StepProps> = ({ form, setForm, setStep }) => {
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    return form.firstName && form.lastName && form.gender && form.birthDate &&
      form.birthPlace && form.taxCode && form.town && form.address &&
      form.phone && form.email;
  };

  const handleNext = () => {
    setSubmitted(true);
    if (validate()) {
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
                <Calendar value={form.birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.value as Date }))} dateFormat="dd/mm/yy" showIcon showButtonBar maxDate={new Date()} className={isInvalid(form.birthDate) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Data di nascita*</label>
            </FloatLabel>
            {isInvalid(form.birthDate) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
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
                <InputText value={form.taxCode} onChange={e => setForm({ ...form, taxCode: e.target.value })} className={isInvalid(form.taxCode) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Codice Fiscale*</label>
            </FloatLabel>
            {isInvalid(form.taxCode) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
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
              <label>Comune*</label>
            </FloatLabel>
            {isInvalid(form.town) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-building">
                <InputText value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={isInvalid(form.address) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Via e numero*</label>
            </FloatLabel>
            {isInvalid(form.address) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
        </div>
        <div className="donor-step-form-row">
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-phone">
                <InputText value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} keyfilter="int" className={isInvalid(form.phone) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Telefono*</label>
            </FloatLabel>
            {isInvalid(form.phone) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
          </span>
          <span>
            <FloatLabel>
              <InputWithIcon icon="pi pi-envelope">
                <InputText value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} keyfilter="email" className={isInvalid(form.email) ? 'p-invalid' : ''} />
              </InputWithIcon>
              <label>Email*</label>
            </FloatLabel>
            {isInvalid(form.email) && <small className="p-error" style={{ display: 'block', marginTop: '5px' }}>Campo obbligatorio</small>}
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
            <InputText value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} />
          </InputWithIcon>
          <label>Titolo di studio</label>
        </FloatLabel>
      </span>
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-heart">
            <InputText value={form.donationPreferences} onChange={e => setForm({ ...form, donationPreferences: e.target.value })} />
          </InputWithIcon>
          <label>Preferenze per la donazione</label>
        </FloatLabel>
      </span>
    </div>
    <div className="donor-step-form-row">
      <span>
        <FloatLabel>
          <InputWithIcon icon="pi pi-briefcase">
            <InputText value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} />
          </InputWithIcon>
          <label>Professione</label>
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
      <Button label="Invia il codice" icon="pi pi-send" onClick={() => {
        // Optimistic update: Go to next step immediately
        // Fire request in background
        setLoading(true);
        setError("");
        client.post('/api/send-otp', { email: form.email })
          .then(() => setAck(true))
          .catch((err: any) => {
            console.error("Send OTP failed", err);
            // We can show the error in the next step or handle it globally
            // For now, we log it. The user can click "Resend" in the next step.
          })
          .finally(() => setLoading(false));

        setStep(5);
      }} />
    </div>
    {loading && <Message severity="info" text="Invio codice OTP in corso..." />}
    {error && <Message severity="error" text={error} />}
  </div >
);


const Step5: React.FC<StepProps> = ({ form, setStep, otp, setOtp, otpError, setOtpError, setSuccess }) => {
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);

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
        />
      </div>
      {otpError && <Message severity="error" text={otpError} />}

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <Button
          label={resending ? "Invio in corso..." : (canResend ? "Invia nuovo codice" : `Invia nuovo codice (${timer}s)`)}
          icon="pi pi-refresh"
          className="p-button-text p-button-sm"
          onClick={handleResend}
          disabled={!canResend || resending}
        />
      </div>

      <div className="donor-step-actions">
        <Button label="Indietro" icon="pi pi-arrow-left" className="p-button-text" onClick={() => setStep(4)} />
        <Button label="Conferma Iscrizione" icon="pi pi-check" onClick={async () => {
          try {
            setOtpError("");
            // Final Submit: Data + OTP
            const res = await client.post('/api/signup', { ...form, otp });
            if (res.data.success) {
              setSuccess(true);
              setStep(6);
            }
          } catch (err: any) {
            console.error("Signup verify failed", err);
            setOtpError(err.response?.data?.error || "Codice OTP non valido o errore nel salvataggio.");
          }
        }} />
      </div>
    </div>
  );
};


const Step6: React.FC<StepProps> = ({ navigate }) => (
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
    age: null,
    weight: null,
    noPermanentExclusion: false,
    donateInMerate: null,
    transfusionCenter: "",
    firstName: "",
    lastName: "",
    gender: "",
    birthDate: null,
    birthPlace: "",
    taxCode: "",
    address: "",
    town: "",
    phone: "",
    email: "",
    education: "",
    donationPreferences: "",
    profession: "",
    nonProfessionalStatus: "",
    otherAssociations: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


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
