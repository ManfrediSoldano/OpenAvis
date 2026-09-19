import React from 'react';
import BloodPlasmaBanner from './BloodPlasmaBanner';
import { Card } from 'primereact/card';
import './PrivacyPolicy.css';

const policySections = [
    { id: 'titolare', label: 'Titolare e DPO' },
    { id: 'dati-trattati', label: 'Dati trattati' },
    { id: 'cookie', label: 'Cookie' },
    { id: 'finalita', label: 'Finalità e base giuridica' },
    { id: 'modalita', label: 'Modalità del trattamento' },
    { id: 'conferimento', label: 'Conferimento dei dati' },
    { id: 'conservazione', label: 'Conservazione' },
    { id: 'destinatari', label: 'Destinatari dei dati' },
    { id: 'diritti', label: 'Diritti dell’interessato' },
    { id: 'aggiornamenti', label: 'Aggiornamenti' },
];

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="privacy-policy-page">
            <BloodPlasmaBanner
                title="Privacy e Cookie Policy"
                description="Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679"
            />

            <main className="privacy-content-container">
                <Card className="privacy-card">
                    <article className="privacy-article">
                        <header className="privacy-introduction">
                            <p className="privacy-eyebrow">Informativa privacy</p>
                            <h1>Informativa sul trattamento dei dati personali</h1>
                            <p className="privacy-lead">
                                Le informazioni sul trattamento dei dati personali sono state elaborate ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679, relativo alla protezione delle persone fisiche con riguardo al trattamento dei dati personali e alla libera circolazione di tali dati, e del D.lgs. n. 196/2003, così come modificato dal D.lgs. n. 101/2018.
                            </p>
                            <p>
                                La presente privacy policy si applica esclusivamente alle attività online del sito <strong>avismerate.it</strong> ed è valida per i visitatori e gli utenti del sito. In ottemperanza agli obblighi derivanti dalla normativa nazionale e comunitaria in materia di tutela dei dati personali, il presente sito rispetta e tutela la riservatezza dei visitatori e degli utenti.
                            </p>

                            <dl className="privacy-summary" aria-label="Riepilogo dell’informativa">
                                <div>
                                    <dt>Destinatari</dt>
                                    <dd>Utenti interessati</dd>
                                </div>
                                <div>
                                    <dt>Scopo</dt>
                                    <dd>Adempimento delle informazioni previste dagli artt. 13 e 14 del GDPR e dal D.lgs. n. 196/2003, come modificato dal D.lgs. n. 101/2018</dd>
                                </div>
                                <div>
                                    <dt>Titolare del trattamento</dt>
                                    <dd>AVIS Comunale di Merate ODV, Piazza Don Minzoni 5, 23807 Merate (LC)</dd>
                                </div>
                                <div>
                                    <dt>In vigore dal</dt>
                                    <dd><time dateTime="2026-03-09">9 marzo 2026</time></dd>
                                </div>
                            </dl>
                        </header>

                        <div className="privacy-layout">
                            <nav className="privacy-navigation" aria-label="Indice della privacy policy">
                                <p>In questa pagina</p>
                                <ol>
                                    {policySections.map((section) => (
                                        <li key={section.id}>
                                            <a href={`#${section.id}`}>{section.label}</a>
                                        </li>
                                    ))}
                                </ol>
                            </nav>

                            <div className="privacy-sections">
                                <p>
                                    La raccolta e il trattamento dei dati personali saranno effettuati in conformità a quanto segue.
                                </p>

                                <section id="titolare">
                                    <h2>Titolare del trattamento e Responsabile della protezione dei dati</h2>
                                    <p>Il trattamento è svolto da:</p>
                                    <address className="privacy-contact-block">
                                        <strong>AVIS Comunale di Merate ODV</strong>
                                        <span>Piazza Don Minzoni 5</span>
                                        <span>23807 Merate (LC)</span>
                                        <a href="https://avismerate.it">avismerate.it</a>
                                    </address>
                                    <p>
                                        Il Titolare ha provveduto a nominare il Responsabile per la protezione dei dati ai sensi dell’art. 38 del Regolamento UE 2016/679:
                                    </p>
                                    <address className="privacy-contact-block">
                                        <strong>Dott. Giancarlo Alfredo Slavich</strong>
                                        <span>Piazza Roma 18</span>
                                        <span>20833 Giussano (MB)</span>
                                    </address>
                                </section>

                                <section id="dati-trattati">
                                    <h2>Tipi di dati personali trattati</h2>
                                    <p>I dati personali raccolti e trattati tramite il presente sito web sono i seguenti.</p>

                                    <h3>Dati forniti dall’utente</h3>
                                    <p>
                                        Si tratta di dati inseriti volontariamente dall’utente negli appositi campi di compilazione previsti dal presente sito e trattati esclusivamente per l’erogazione dei servizi richiesti, quali:
                                    </p>
                                    <ul>
                                        <li>servizi di comunicazione tramite il modulo per contatti;</li>
                                        <li>servizi relativi all’accesso all’area riservata tramite il form di registrazione;</li>
                                        <li>richiesta di iscrizione all’AVIS tramite il form di registrazione.</li>
                                    </ul>

                                    <h3>Dati di navigazione</h3>
                                    <p>
                                        Come tutti i siti web, anche il presente sito acquisisce alcuni dati personali la cui trasmissione è implicita nell’uso dei protocolli di comunicazione Internet. I sistemi informatici e le procedure software preposte al funzionamento di questo sito acquisiscono, nel corso del loro normale esercizio, informazioni che non sono raccolte per essere associate a utenti identificati, ma che, per loro stessa natura, potrebbero permettere di identificarli attraverso elaborazioni e associazioni con dati detenuti da terzi.
                                    </p>
                                    <p>
                                        In questa categoria rientrano gli indirizzi IP o i nomi a dominio dei computer utilizzati dagli utenti che si connettono al sito, gli indirizzi in notazione URI (Uniform Resource Identifier) delle risorse richieste, l’orario della richiesta, il metodo utilizzato per sottoporla al server, la dimensione del file ottenuto in risposta, il codice numerico che indica lo stato della risposta del server e altri parametri relativi al sistema operativo e all’ambiente informatico dell’utente.
                                    </p>
                                    <p>
                                        Questi dati sono usati soltanto per ricavare informazioni statistiche anonime sull’uso del sito, controllarne il corretto funzionamento e, se necessario, accertare responsabilità in caso di ipotetici reati informatici ai danni del sito. I dati sono cancellati immediatamente dopo l’elaborazione.
                                    </p>
                                    <p>
                                        L’indirizzo IP rilevato da Google Analytics è anonimizzato e a Google è impedito di incrociare i dati raccolti attraverso Analytics con quelli di altri suoi prodotti.
                                    </p>
                                </section>

                                <section id="cookie">
                                    <h2>Cookie</h2>
                                    <p>
                                        Il sito utilizza esclusivamente cookie tecnici. Non viene fatto uso di cookie per la profilazione degli utenti, né vengono impiegati altri metodi di tracciamento.
                                    </p>
                                    <p>
                                        Viene fatto uso di cookie di sessione non persistenti in modo strettamente limitato a quanto necessario per la navigazione sicura ed efficiente del sito. La memorizzazione dei cookie di sessione nei terminali o nei browser è sotto il controllo dell’utente. Al termine delle sessioni, le informazioni relative ai cookie restano registrate nei log dei servizi per un periodo non superiore a <strong>sette giorni</strong>, al pari degli altri dati di navigazione.
                                    </p>
                                </section>

                                <section id="finalita">
                                    <h2>Finalità del trattamento e relativa base giuridica</h2>
                                    <p>I dati forniti dall’utente saranno utilizzati per:</p>
                                    <ul>
                                        <li>rispondere alle richieste di informazioni dell’utente;</li>
                                        <li>erogare i servizi messi a disposizione attraverso l’accesso all’area riservata;</li>
                                        <li>consentire agli utenti di richiedere l’iscrizione a una delle AVIS comunali presenti sul territorio della provincia di Lecco e, al contempo, ad AVIS Comunale di Merate ODV, AVIS Regionale Lombardia e AVIS Nazionale.</li>
                                    </ul>
                                    <p>
                                        I dati vengono raccolti sulla base del consenso esplicito dell’interessato, espresso mediante la compilazione dell’apposito modulo di richiesta. Il consenso per le finalità sopra indicate è facoltativo. L’utente è libero di fornirlo o meno, ma, in sua assenza, non sarà possibile dare seguito ai servizi offerti dal sito.
                                    </p>
                                    <p>
                                        <strong>Dati di navigazione per finalità statistiche, di analisi e di sicurezza informatica.</strong> Questi dati sono acquisiti dai sistemi informatici e dalle procedure software del sito durante il normale esercizio. Sono utilizzati esclusivamente per ricavare informazioni statistiche anonime sull’uso del sito, controllarne il corretto funzionamento e, se necessario, accertare responsabilità in caso di ipotetici reati informatici ai danni del sito.
                                    </p>
                                    <p>È comunque possibile accedere al sito senza che venga richiesto il conferimento di alcun dato personale.</p>
                                    <p>
                                        Ai sensi dell’art. 7 del Regolamento UE 2016/679, l’interessato ha il diritto di revocare il proprio consenso in qualsiasi momento. Il consenso può essere revocato con la stessa facilità con cui è stato accordato.
                                    </p>
                                </section>

                                <section id="modalita">
                                    <h2>Modalità del trattamento</h2>
                                    <p>
                                        Il trattamento avverrà mediante strumenti manuali, informatici e telematici, con logiche strettamente correlate alle finalità per cui i dati sono stati raccolti, nel rispetto del principio di limitazione delle finalità e degli altri principi stabiliti dall’art. 5 del Regolamento UE 2016/679.
                                    </p>
                                    <p>
                                        In osservanza dei principi di integrità e riservatezza, vengono adottate specifiche misure di sicurezza per prevenire la perdita dei dati, usi illeciti o non corretti e accessi non autorizzati. Il sito dispone di un certificato SSL che consente ai visitatori di utilizzare una connessione HTTPS sicura.
                                    </p>
                                </section>

                                <section id="conferimento">
                                    <h2>Natura del conferimento dei dati e conseguenze di un eventuale rifiuto</h2>
                                    <p>
                                        Il conferimento dei dati è facoltativo. La mancata comunicazione degli stessi comporta l’impossibilità di accedere ai servizi forniti dal sito.
                                    </p>
                                </section>

                                <section id="conservazione">
                                    <h2>Tempi di conservazione</h2>
                                    <p>
                                        I dati dell’utente vengono conservati dal Titolare per il periodo strettamente necessario, nel rispetto della normativa applicabile. L’utente può revocare in qualsiasi momento il proprio consenso al trattamento dei dati, come sopra descritto. I dati trasmessi a eventuali fornitori di servizi saranno trattati da questi ultimi per il tempo strettamente necessario all’esecuzione degli incarichi loro affidati.
                                    </p>
                                </section>

                                <section id="destinatari">
                                    <h2>Ambito di comunicazione e diffusione</h2>
                                    <p>
                                        I dati non saranno diffusi. Oltre al Titolare, potranno accedervi i soggetti coinvolti nell’organizzazione del sito, come personale amministrativo e collaboratori debitamente autorizzati, nonché fornitori di servizi esterni, tra cui il gestore del sito e l’internet provider. Questi soggetti agiscono per conto di AVIS Comunale di Merate ODV, sono debitamente nominati Responsabili del trattamento e trattano i dati in conformità allo scopo per cui sono stati raccolti.
                                    </p>
                                    <p>
                                        Nello svolgimento delle attività dei fornitori esterni, il sito potrebbe condividere alcuni dati raccolti con servizi localizzati al di fuori dell’Unione Europea. In tal caso, il trasferimento è effettuato sulla base delle decisioni e delle garanzie previste dalla normativa applicabile, incluse le <a href="https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/5306161" target="_blank" rel="noreferrer">decisioni richiamate dal Garante per la protezione dei dati personali</a> e le <a href="https://www.garanteprivacy.it/home/provvedimenti-normativa/normativa/normativa-comunitaria-e-intenazionale/trasferimento-dei-dati-verso-paesi-terzi#1" target="_blank" rel="noreferrer">decisioni di adeguatezza della Commissione Europea</a>.
                                    </p>
                                    <p>La protezione dei dati personali trasferiti si fonda, secondo i casi, su:</p>
                                    <ol>
                                        <li>decisioni di adeguatezza relative ai Paesi terzi destinatari adottate dalla Commissione Europea;</li>
                                        <li>garanzie adeguate fornite dal soggetto terzo destinatario ai sensi dell’art. 46 del Regolamento;</li>
                                        <li>norme vincolanti dell’associazione.</li>
                                    </ol>
                                    <p>
                                        I dati potranno inoltre essere comunicati a tutti i soggetti ai quali la comunicazione sia dovuta in ragione di obblighi di legge.
                                    </p>
                                </section>

                                <section id="diritti">
                                    <h2>Diritti dell’interessato</h2>
                                    <p>Gli interessati dispongono dei diritti previsti dal Regolamento UE 2016/679, tra cui:</p>
                                    <ul>
                                        <li>accedere ai dati personali e alle informazioni relative agli stessi;</li>
                                        <li>ottenere la rettifica dei dati inesatti o l’integrazione di quelli incompleti;</li>
                                        <li>ottenere la cancellazione dei dati personali, il cosiddetto diritto all’oblio, nei casi previsti dall’art. 17 del GDPR;</li>
                                        <li>ottenere la limitazione del trattamento nei casi previsti dall’art. 18 del GDPR;</li>
                                        <li>ricevere i dati personali in un formato strutturato e leggibile da dispositivo automatico e trasmetterli a un altro titolare, nei casi previsti dall’art. 20 del GDPR;</li>
                                        <li>opporsi al trattamento dei dati personali in presenza di situazioni particolari che riguardano l’interessato;</li>
                                        <li>revocare il consenso in qualsiasi momento. Il trattamento effettuato prima della revoca conserva la propria liceità;</li>
                                        <li>proporre reclamo a un’autorità di controllo.</li>
                                    </ul>
                                    <p>
                                        Le richieste di informazioni, chiarimenti o esercizio dei diritti possono essere inviate, anche tramite il modulo disponibile sul sito, ai seguenti recapiti:
                                    </p>
                                    <address className="privacy-contact-block">
                                        <a href="mailto:merate.comunale@avis.it">merate.comunale@avis.it</a>
                                        <a href="mailto:Dpo@avisprovincialelecco.it">Dpo@avisprovincialelecco.it</a>
                                        <span>Responsabile della protezione dei dati (RPD)</span>
                                    </address>
                                    <p>
                                        Gli interessati che ritengono che il trattamento dei propri dati personali effettuato attraverso questo sito violi la normativa vigente possono proporre reclamo al Garante per la protezione dei dati personali, contattabile all’indirizzo <a href="mailto:garante@gpdp.it">garante@gpdp.it</a> o tramite il sito <a href="https://www.gpdp.it" target="_blank" rel="noreferrer">www.gpdp.it</a>, ai sensi dell’art. 77 del Regolamento europeo e degli artt. 141 e seguenti del D.lgs. n. 196/2003, come modificato dal D.lgs. n. 101/2018. Resta inoltre possibile adire le opportune sedi giudiziarie ai sensi dell’art. 79 del Regolamento europeo e dell’art. 152 del D.lgs. n. 196/2003, come modificato dal D.lgs. n. 101/2018.
                                    </p>
                                    <p>
                                        I dati personali non sono soggetti ad alcun processo decisionale interamente automatizzato, compresa la profilazione.
                                    </p>
                                </section>

                                <section id="aggiornamenti">
                                    <h2>Aggiornamenti</h2>
                                    <p>
                                        La Privacy Policy del sito, in vigore dal <time dateTime="2026-03-09">9 marzo 2026</time>, potrà essere soggetta ad aggiornamenti periodici. Ogni variazione sostanziale verrà pubblicata a questo indirizzo. L’utente è invitato a consultare periodicamente il sito per verificare la versione vigente delle presenti condizioni.
                                    </p>
                                </section>
                            </div>
                        </div>
                    </article>
                </Card>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
