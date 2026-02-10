import React from 'react';
import BloodPlasmaBanner from './BloodPlasmaBanner';
import { Card } from 'primereact/card';
import './PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="privacy-policy-page">
            <BloodPlasmaBanner
                title="Privacy e Cookie Policy"
                description="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679"
            />
            <div className="privacy-content-container">
                <Card className="privacy-card">
                    <h1>Privacy Policy</h1>
                    <p>
                        In questa pagina si descrivono le modalità di gestione del sito in riferimento al trattamento dei dati personali degli utenti che lo consultano.
                        Si tratta di un'informativa che è resa anche ai sensi dell'art. 13 del Regolamento UE 2016/679 "Regolamento generale sulla protezione dei dati" (di seguito "Regolamento" o "GDPR") a coloro che interagiscono con i servizi web di <strong>Avis Comunale di Merate Odv</strong>.
                    </p>

                    <h2>Titolare del Trattamento</h2>
                    <p>
                        Il Titolare del trattamento è <strong>Avis Comunale di Merate Odv</strong>, con sede legale in:<br />
                        Piazza Don Giovanni Minzoni, 5<br />
                        23807 Merate (LC)<br />
                        C.F. 94003940130<br />
                        Email: <a href="mailto:merate.comunale@avis.it">merate.comunale@avis.it</a><br />
                        PEC: <a href="mailto:merate.comunale@pec.avis.it">merate.comunale@pec.avis.it</a>
                    </p>

                    <h2>Responsabile della Protezione dei Dati (DPO)</h2>
                    <p>
                        Il Responsabile della Protezione dei Dati (DPO) designato è il <strong>Dott. Giancarlo Alfredo Slavich</strong>, contattabile all'indirizzo email: <a href="mailto:giancarlo@slavich.it">giancarlo@slavich.it</a>.
                    </p>

                    <h2>Tipologia di dati trattati</h2>
                    <h3>Dati di navigazione</h3>
                    <p>
                        I sistemi informatici e le procedure software preposte al funzionamento di questo sito web acquisiscono, nel corso del loro normale esercizio, alcuni dati personali la cui trasmissione è implicita nell'uso dei protocolli di comunicazione di Internet.
                        In questa categoria di dati rientrano gli indirizzi IP o i nomi a dominio dei computer utilizzati dagli utenti che si connettono al sito, gli indirizzi in notazione URI (Uniform Resource Identifier) delle risorse richieste, l'orario della richiesta, il metodo utilizzato nel sottoporre la richiesta al server, la dimensione del file ottenuto in risposta, il codice numerico indicante lo stato della risposta data dal server (buon fine, errore, ecc.) ed altri parametri relativi al sistema operativo e all'ambiente informatico dell'utente.
                    </p>

                    <h3>Dati forniti volontariamente dall'utente</h3>
                    <p>
                        L'invio facoltativo, esplicito e volontario di posta elettronica agli indirizzi indicati su questo sito, o la compilazione di form di contatto/iscrizione, comporta la successiva acquisizione dell'indirizzo del mittente, necessario per rispondere alle richieste, nonché degli eventuali altri dati personali inseriti nella missiva.
                    </p>

                    <h2>Finalità del trattamento</h2>
                    <p>
                        I dati personali forniti saranno trattati per le seguenti finalità:
                    </p>
                    <ul>
                        <li>Navigazione sul presente sito internet;</li>
                        <li>Eventuale richiesta di contatto, con invio di informazioni da Te richieste;</li>
                        <li>Attività amministrativo-contabili in genere;</li>
                        <li>Gestione della richiesta di candidatura a donatore (per la sezione specifica "Diventa Donatore").</li>
                    </ul>

                    <h2>Base giuridica del trattamento</h2>
                    <p>
                        Il trattamento dei dati personali si fonda sul consenso dell'interessato (art. 6 par. 1 lett. a) del GDPR), sull'esecuzione di un contratto o di misure precontrattuali (art. 6 par. 1 lett. b) del GDPR), sull'adempimento di un obbligo legale (art. 6 par. 1 lett. c) del GDPR) o sul legittimo interesse del Titolare.
                    </p>

                    <h2>Destinatari dei dati</h2>
                    <p>
                        I dati personali potranno essere comunicati a:
                    </p>
                    <ul>
                        <li>Soggetti che forniscono servizi per la gestione del sistema informativo e delle reti di telecomunicazioni;</li>
                        <li>Soggetti che svolgono adempimenti di controllo, revisione e certificazione delle attività poste in essere da Avis Comunale di Merate Odv;</li>
                        <li>Avis Provinciale Lecco, Avis Regionale Lombardia e Avis Nazionale, per finalità associative;</li>
                        <li>Autorità competenti per adempimenti di obblighi di leggi e/o di disposizioni di organi pubblici, su richiesta.</li>
                    </ul>

                    <h2>Diritti degli interessati</h2>
                    <p>
                        Gli interessati hanno il diritto di ottenere da Avis Comunale di Merate Odv, nei casi previsti, l'accesso ai propri dati personali e la rettifica o la cancellazione degli stessi o la limitazione del trattamento che li riguarda o di opporsi al trattamento (artt. 15 e ss. del Regolamento).
                        L'apposita istanza è presentata contattando il Responsabile della protezione dei dati presso Avis Provinciale Lecco o direttamente il Titolare del trattamento ai recapiti sopra indicati.
                    </p>

                    <h2>Modifiche</h2>
                    <p>
                        Il Titolare si riserva il diritto di modificare, aggiornare, aggiungere o rimuovere parti della presente informativa sulla privacy a propria discrezione e in qualsiasi momento. La persona interessata è tenuta a verificare periodicamente le eventuali modifiche.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
