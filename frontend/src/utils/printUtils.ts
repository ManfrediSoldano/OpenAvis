
import { Donor } from '../../../shared/models/donor';
import { searchComuni } from 'italian-locations';


const LOGO_URL = "https://openavismeratestorage.blob.core.windows.net/public-assets/Logo_AVIS.png";

const TEMPLATE = `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AVIS Comunale di Merate – Moduli</title>
  <style>
    /* ── Brand palette ──────────────────────────────── */
    :root {
      --avis-blue:  #0075bf;   /* New standard blue */
      --avis-red:   #e30613;   /* New standard red */
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: Arial, sans-serif;
      font-size: 10.5px;
      color: var(--avis-blue);
      background: #fff;
      -webkit-print-color-adjust: exact;
    }

    /* ── Page ────────────────────────────────────────── */
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 6mm 8mm 6mm 8mm; /* narrower margins */
      background: #fff;
      page-break-after: always;
      position: relative;
    }

    /* ── Logo ────────────────────────────────────────── */
    .logo-wrap {
      margin-bottom: 2mm;
      line-height: 0;
    }
    .logo-wrap img {
      display: block;
      max-height: 12mm;   /* even smaller */
      max-width: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
      object-position: left top;
    }

    /* ── Typography helpers ──────────────────────────── */
    hr.thin { border: none; border-top: 1px solid var(--avis-blue); margin: 3px 0; }

    p { margin-bottom: 3px; line-height: 1.4; font-size: 10px; text-align: justify; }

    .main-title {
      font-size: 11.5px;
      font-weight: bold;
      color: var(--avis-blue);
      text-align: center;
      text-decoration: underline;
      margin: 4px 0 5px;
    }
    .section-title {
      font-size: 10.5px;
      font-weight: bold;
      color: var(--avis-blue);
      margin: 4px 0 2px;
    }

    /* ── Checkbox square ─────────────────────────────── */
    .sq {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 11px; height: 11px;
      border: 1.2px solid var(--avis-blue);
      vertical-align: middle;
      font-size: 9.5px;
      line-height: 1;
      flex-shrink: 0;
      background: #fff;
    }

    /* ── Underline field ─────────────────────────────── */
    .field {
      display: inline-block;
      border-bottom: 1px solid var(--avis-blue);
      min-width: 20mm;
      height: 14px;
      vertical-align: baseline;
      font-size: 10px;
      color: #333;
      font-style: italic;
      padding-left: 3px;
      padding-right: 3px;
    }
    .field-full {
      display: block;
      border-bottom: 1px solid var(--avis-blue);
      width: 100%;
      min-height: 14px;
      margin: 1px 0 3px;
      font-size: 10px;
      color: #333;
      font-style: italic;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 3px;
    }

    /* ── Boxed cells (ISTAT / CF / CAP) ─────────────── */
    .cell-row {
      display: inline-flex;
      gap: 0;
    }
    .cell {
      width: 6.4mm; height: 5.5mm;
      border: 1px solid var(--avis-blue);
      border-right: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9.5px;
      color: #333;
      font-style: italic;
      font-weight: bold;
      background: #fff;
    }
    .cell:last-child { border-right: 1px solid var(--avis-blue); }

    /* ── Form wrapper (page 1) ───────────────────────── */
    .form-box {
      border: 1.5px solid var(--avis-blue);
      padding: 2mm 4mm;
    }
    .form-title {
      text-align: center;
      font-size: 13.5px;
      font-weight: bold;
      color: var(--avis-red);
      letter-spacing: 1px;
      border-bottom: 1.5px solid var(--avis-blue);
      padding-bottom: 1.5mm;
      margin-bottom: 1.5mm;
    }
    .form-label {
      font-size: 9px;
      font-weight: bold;
      color: var(--avis-blue);
      margin-bottom: 1px;
      display: block;
    }
    .form-label.red { color: var(--avis-red); }
    .form-row {
      display: flex;
      gap: 3mm;
      margin-bottom: 1.5mm;
      align-items: flex-end;
    }
    .gender-box {
      border: 1.5px solid var(--avis-blue);
      padding: 1px 4px;
      font-weight: bold;
      font-size: 10.5px;
      display: inline-block;
      min-width: 18px;
      text-align: center;
    }
    .gender-box.selected {
        background-color: var(--avis-blue);
        color: white;
    }

    /* ── Column Tables ──────────────────────────── */
    .three-cols {
      display: flex;
      border: 1px solid var(--avis-blue);
      margin-bottom: 2mm;
    }
    .col-box {
      flex: 1;
      padding: 1.5mm 2mm;
      border-right: 1px solid var(--avis-blue);
    }
    .col-box:last-child { border-right: none; }
    .col-box-title {
      font-weight: bold;
      font-size: 9px;
      text-align: center;
      border-bottom: 1px solid var(--avis-blue);
      margin-bottom: 3px;
      padding-bottom: 1.5px;
    }
    .col-item {
      display: flex;
      align-items: center;
      gap: 3px;
      margin: 1.5px 0;
      font-size: 9px;
    }
    .col-inner { display: flex; gap: 4mm; }

    /* ── Two-column table ────────────────────────────── */
    .two-cols {
      display: flex;
      border: 1px solid var(--avis-blue);
      margin-bottom: 2mm;
    }
    .two-col-box {
      flex: 1;
      padding: 1.5mm 2mm;
      border-right: 1px solid var(--avis-blue);
    }
    .two-col-box:last-child { border-right: none; }
    .si-no-row {
      display: flex;
      align-items: center;
      gap: 3mm;
      margin-top: 2mm;
      flex-wrap: wrap;
    }
    .si-no-btn {
      border: 1.5px solid var(--avis-blue);
      padding: 1mm 3mm;
      font-size: 11px;
      font-weight: bold;
    }
    .si-no-btn.selected {
        background-color: var(--avis-blue);
        color: white;
    }

    /* ── Chiede section ──────────────────────────────── */
    .chiede-section { font-size: 9.5px; line-height: 1.5; margin-bottom: 2mm; }
    .chiede-section .hl { font-weight: bold; }

    /* ── Sign row ────────────────────────────────────── */
    .sign-row { display: flex; justify-content: space-between; margin-top: 3mm; }
    .sign-block { width: 46%; }
    .sign-line { border-bottom: 1px solid var(--avis-blue); margin-top: 5mm; }

    /* ── Footer ──────────────────────────────────────── */
    .footer-sede {
      font-size: 8px;
      text-align: center;
      color: var(--avis-blue);
      border-top: 1px solid var(--avis-blue);
      padding-top: 1.5mm;
      margin-top: 2mm;
    }

    /* ── Privacy consent section ─────────────────────── */
    .consent-title {
      font-size: 12.5px;
      font-weight: bold;
      text-align: center;
      margin: 8px 0 6px;
    }
    .cb-label {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid var(--avis-blue);
      width: 12px; height: 12px;
      vertical-align: middle;
      margin-right: 2px;
      font-size: 10px;
      background: #fff;
    }
    .consent-group { margin: 5px 0; font-size: 10px; }
    .consent-row { display: flex; gap: 8mm; margin-bottom: 2px; align-items: center; }
    .consent-opt { display: flex; align-items: center; gap: 4px; font-size: 10px; }

    @media print {
      body { background: #fff; }
      .page { margin: 0; box-shadow: none; page-break-after: always; padding: 5mm 5mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════
     PAGE 1 — DOMANDA DI ISCRIZIONE
     ═══════════════════════════════════════════════════════ -->
<div class="page {{P1_HIDDEN}}">

  <div class="logo-wrap">
    <img src="{{LOGO_SRC}}" alt="AVIS Comunale di Merate" />
  </div>

  <div class="form-box">
    <div class="form-title">DOMANDA DI ISCRIZIONE</div>

    <!-- IL/LA SOTTOSCRITTO/A + gender -->
    <div class="form-row" style="align-items:flex-end;">
      <div style="flex:1;">
        <span class="form-label">IL/LA SOTTOSCRITTO/A</span>
        <div class="field-full">{{FULL_NAME}}</div>
      </div>
      <div style="display:flex; gap:3px; margin-bottom:4px;">
        <span class="gender-box {{MALE_SELECTED}}">M</span>
        <span class="gender-box {{FEMALE_SELECTED}}">F</span>
      </div>
    </div>

    <!-- Nato/a + Prov + il -->
    <div class="form-row">
      <div style="flex:2.2;">
        <span class="form-label">Nato/a a</span>
        <div class="field-full">{{BIRTH_CITY}}</div>
      </div>
      <div style="flex:.7;">
        <span class="form-label">Prov.</span>
        <div class="field-full">{{BIRTH_PROVINCE}}</div>
      </div>
      <div style="flex:.9;">
        <span class="form-label">il</span>
        <div class="field-full">{{BIRTH_DATE}}</div>
      </div>
    </div>

    <!-- CODICE ISTAT comune -->
    <div style="margin-bottom:2mm; display:flex; justify-content:space-between; align-items:center;">
      <span class="form-label red" style="margin:0;">CODICE ISTAT** (**Riservato)</span>
      <div class="cell-row">
        <span class="cell">{{ISTAT_COM_1}}</span><span class="cell">{{ISTAT_COM_2}}</span>
        <span class="cell">{{ISTAT_COM_3}}</span><span class="cell">{{ISTAT_COM_4}}</span>
        <span class="cell">{{ISTAT_COM_5}}</span><span class="cell">{{ISTAT_COM_6}}</span>
      </div>
    </div>

    <!-- Codice Fiscale -->
    <div style="margin-bottom:2mm; display:flex; align-items:center; gap:2mm;">
      <span class="form-label" style="margin:0; white-space:nowrap;">Codice Fiscale</span>
      <div style="display:flex; gap:1.5mm;">
        <div class="cell-row"><span class="cell">{{FC_01}}</span><span class="cell">{{FC_02}}</span><span class="cell">{{FC_03}}</span></div>
        <div class="cell-row"><span class="cell">{{FC_04}}</span><span class="cell">{{FC_05}}</span><span class="cell">{{FC_06}}</span></div>
        <div class="cell-row"><span class="cell">{{FC_07}}</span><span class="cell">{{FC_08}}</span><span class="cell">{{FC_09}}</span><span class="cell">{{FC_10}}</span></div>
        <div class="cell-row"><span class="cell">{{FC_11}}</span><span class="cell">{{FC_12}}</span><span class="cell">{{FC_13}}</span></div>
        <div class="cell-row"><span class="cell">{{FC_14}}</span><span class="cell">{{FC_15}}</span><span class="cell">{{FC_16}}</span></div>
      </div>
    </div>

    <!-- Residenza / Domicilio -->
    <div class="form-row">
      <div style="flex:1;">
        <span class="form-label">Residenza in via</span>
        <div class="field-full">{{RESIDENCE_STREET}}</div>
      </div>
      <div style="flex:1;">
        <span class="form-label">Domicilio in via</span>
        <div class="field-full">{{DOMICILE_STREET}}</div>
      </div>
    </div>

    <!-- Città + CAP residenza / Città + CAP domicilio -->
    <div class="form-row" style="align-items:flex-end;">
      <div style="flex:2;">
        <span class="form-label">Città</span>
        <div class="field-full">{{RESIDENCE_CITY}}</div>
      </div>
      <div style="flex:none; margin-bottom: 3.5px; display:flex; align-items:center; gap:2mm;">
        <span class="form-label" style="margin:0;">CAP</span>
        <div class="cell-row">
          <span class="cell">{{CAP_RES_1}}</span><span class="cell">{{CAP_RES_2}}</span>
          <span class="cell">{{CAP_RES_3}}</span><span class="cell">{{CAP_RES_4}}</span>
          <span class="cell">{{CAP_RES_5}}</span>
        </div>
      </div>
      <div style="flex:2; margin-left:3mm;">
        <span class="form-label">Città</span>
        <div class="field-full">{{DOMICILE_CITY}}</div>
      </div>
      <div style="flex:none; margin-bottom: 3.5px; display:flex; align-items:center; gap:2mm;">
        <span class="form-label" style="margin:0;">CAP</span>
        <div class="cell-row">
          <span class="cell">{{CAP_DOM_1}}</span><span class="cell">{{CAP_DOM_2}}</span>
          <span class="cell">{{CAP_DOM_3}}</span><span class="cell">{{CAP_DOM_4}}</span>
          <span class="cell">{{CAP_DOM_5}}</span>
        </div>
      </div>
    </div>

    <!-- CODICE ISTAT città di residenza -->
    <div style="margin-bottom:2mm; display:flex; justify-content:space-between; align-items:center;">
      <span class="form-label red" style="margin:0;">CODICE ISTAT** per la città di residenza (**Riservato Avis)</span>
      <div class="cell-row">
        <span class="cell">{{ISTAT_RES_1}}</span><span class="cell">{{ISTAT_RES_2}}</span>
        <span class="cell">{{ISTAT_RES_3}}</span><span class="cell">{{ISTAT_RES_4}}</span>
        <span class="cell">{{ISTAT_RES_5}}</span><span class="cell">{{ISTAT_RES_6}}</span>
      </div>
    </div>

    <!-- Telefono / Cellulare -->
    <div class="form-row">
      <div style="flex:1;">
        <span class="form-label">Telefono Abitazione</span>
        <div class="field-full">{{HOME_PHONE}}</div>
      </div>
      <div style="flex:1;">
        <span class="form-label">Cellulare</span>
        <div class="field-full">{{MOBILE_PHONE}}</div>
      </div>
    </div>

    <div><span class="form-label">Posta Elettronica</span><div class="field-full">{{EMAIL}}</div></div>
    <div><span class="form-label">Tessera Sanitaria</span><div class="field-full">{{HEALTH_CARD}}</div></div>
    <div style="margin-bottom:3mm;"><span class="form-label">Luogo di Lavoro (Facoltativo)</span><div class="field-full">{{WORKPLACE}}</div></div>

    <!-- Three columns -->
    <div class="three-cols">
      <div class="col-box">
        <div class="col-box-title">Titolo di studio<br/>(Facoltativo)</div>
        <div class="col-item"><span class="sq">{{CHECK_EDU_NONE}}</span> Nessuno</div>
        <div class="col-item"><span class="sq">{{CHECK_EDU_ELEM}}</span> Licenza Elementare</div>
        <div class="col-item"><span class="sq">{{CHECK_EDU_MEDIA}}</span> Licenza Media Inferiore</div>
        <div class="col-item"><span class="sq">{{CHECK_EDU_DIPL}}</span> Diploma</div>
        <div class="col-item"><span class="sq">{{CHECK_EDU_LAUR}}</span> Laurea</div>
      </div>
      <div class="col-box">
        <div class="col-box-title">Preferenze per la donazione<br/>(Facoltativo)</div>
        <div class="col-inner">
          <div>
            <div class="col-item"><span class="sq">{{CHECK_DON_MON}}</span> Lunedì</div>
            <div class="col-item"><span class="sq">{{CHECK_DON_TUE}}</span> Martedì</div>
            <div class="col-item"><span class="sq">{{CHECK_DON_WED}}</span> Mercoledì</div>
            <div class="col-item"><span class="sq">{{CHECK_DON_THU}}</span> Giovedì</div>
          </div>
          <div>
            <div class="col-item"><span class="sq">{{CHECK_DON_FRI}}</span> Venerdì</div>
            <div class="col-item"><span class="sq">{{CHECK_DON_SAT}}</span> Sabato</div>
            <div class="col-item"><span class="sq">{{CHECK_DON_SUN}}</span> Domenica</div>
          </div>
        </div>
        <div style="margin-top:3mm; font-size:8.5px;">
          Punto di prelievo
          <div class="field-full">{{COLLECTION_POINT}}</div>
        </div>
      </div>
      <div class="col-box">
        <div class="col-box-title">Professione<br/>(Facoltativo)</div>
        <div class="col-inner">
          <div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_AGR}}</span> Agricoltore</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_ART}}</span> Artigiano</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_COM}}</span> Commerciante</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_IMP}}</span> Impiegato</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_INS}}</span> Insegnante</div>
          </div>
          <div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_OPE}}</span> Operaio</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_PRO}}</span> Professionista</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_MIL}}</span> Militare</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_REL}}</span> Religioso</div>
            <div class="col-item"><span class="sq">{{CHECK_PROF_ALT}}</span> Altro</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Two columns -->
    <div class="two-cols">
      <div class="two-col-box">
        <div class="col-box-title">Condizione non professionale<br/>(Facoltativo)</div>
        <div class="col-item"><span class="sq">{{CHECK_COND_DIS}}</span> Disoccupato</div>
        <div class="col-item"><span class="sq">{{CHECK_COND_STU}}</span> Studente</div>
        <div class="col-item"><span class="sq">{{CHECK_COND_CAS}}</span> Casalinga</div>
        <div class="col-item"><span class="sq">{{CHECK_COND_PEN}}</span> Pensionato</div>
      </div>
      <div class="two-col-box">
        <div class="col-box-title">Iscrizione ad altre associazioni di volontariato<br/>(Facoltativo)</div>
        <div class="si-no-row">
          <span class="si-no-btn {{OTHER_ASSOC_SI}}">SI</span>
          <span class="si-no-btn {{OTHER_ASSOC_NO}}">NO</span>
          <span style="font-size:8.5px;">Se SI, quale</span>
          <span class="field" style="flex:1; min-width:20mm;">{{OTHER_ASSOCIATION}}</span>
        </div>
      </div>
    </div>

    <!-- CHIEDE -->
    <div class="chiede-section">
      <p><span class="hl">CHIEDE</span> di essere iscritto come <span class="hl">SOCIO DONATORE / SOCIO NON DONATORE</span></p>
      <p>&gt; ad <span class="hl">AVIS COMUNALE DI MERATE ODV</span> con sede in Piazza Don Giovanni Minzoni 5 – 23807 Merate (Lc)</p>
      <p style="margin-left:4mm;">Telefono: 039/9902171 -- Email: merate.comunale@avis.it -- Pec: merate.comunale@pec.avis.it;</p>
      <p>&gt; di aderire ad <span class="hl">AVIS PROVINCIALE DI LECCO ODV;</span></p>
      <p>&gt; di aderire ad <span class="hl">AVIS REGIONALE LOMBARDIA ODV;</span></p>
      <p>&gt; di aderire ad <span class="hl">AVIS NAZIONALE ODV</span> con sede in Viale Enrico Forlanini 23 – 20134 Milano (Mi)</p>
      <p style="margin-left:4mm;">Telefono: 02/70006795 -- Email: avis.nazionale@avis.it</p>
    </div>

    <!-- Data / Firma -->
    <div class="sign-row">
      <div class="sign-block">
        <div style="font-size:8.5px; text-decoration:underline; font-weight:bold;">Data</div>
        <div class="sign-line" style="font-size:8.5px; color:#444; font-style:italic; padding-bottom:1px;">{{DATE}}</div>
      </div>
      <div class="sign-block" style="text-align:right;">
        <div style="font-size:8.5px; text-decoration:underline; font-weight:bold;">Firma</div>
        <div class="sign-line" style="font-size:8.5px; color:#444; font-style:italic; padding-bottom:1px;">{{SIGNATURE}}</div>
      </div>
    </div>

    <p style="font-size:7.5px; margin-top:3mm;">
      Il richiedente deve leggere l'informativa riportata nel retro e firmare il consenso al trattamento dei dati personali. Si impegna
      altresì a conoscere e rispettare lo Statuto, il Regolamento e il Codice Etico sia della propria sede comunale, sia dell'Avis
      Provinciale di riferimento, sia dell'Avis Regionale, sia dell'AVIS Nazionale.
    </p>
  </div><!-- /form-box -->

  <div class="footer-sede">
    SEDE: Piazza Don Minzoni, 5 23807 Merate (LC) - Tel. 039.5986891 - e-mail: merate.comunale@avis.it - PEC: merate.comunale@pec.avis.it - C.F 94003940130
  </div>
</div><!-- /page 1 -->


<!-- ═══════════════════════════════════════════════════════
     PAGE 2 — PRIVACY FRONTE
     ═══════════════════════════════════════════════════════ -->
<div class="page {{P2_HIDDEN}}">

  <div class="logo-wrap">
    <img src="{{LOGO_SRC}}" alt="AVIS Comunale di Merate" />
  </div>

  <hr class="thin"/>

  <div class="main-title">INFORMATIVA E CONSENSO IN CONFORMITÀ AL REGOLAMENTO (UE) 2016/679</div>

  <p>Ai sensi dell'art. 13 del Regolamento UE n. 2016/679 e della normativa vigente, recante disposizioni a tutela delle persone e di altri soggetti rispetto al trattamento dei dati personali, desideriamo informarLa che i dati personali da Lei forniti formeranno oggetto di trattamento nel rispetto della normativa sopra richiamata e degli obblighi di riservatezza cui è tenuta l'Associazione. Inoltre, con riferimento alla domanda di iscrizione, precisiamo che ai sensi dello Statuto Nazionale ciascun associato a un'Avis Locale diviene automaticamente socio anche della sovra-ordinata Associazione Provinciale, Regionale e Nazionale.</p>

  <div style="margin:5px 0 2px;">
    <span class="cb-label">{{CHECK_ASPIRANTE}}</span>
    <strong style="font-size:11px;">Consenso Aspirante socio</strong>
  </div>
  <p>Per quanto riguarda il trattamento dei dati da lei forniti, l'Avis Comunale alla quale ha sottoposto la sua domanda d'iscrizione e l'Avis Provinciale di Lecco Odv sono da considerarsi contitolari del trattamento e quindi i suoi dati, anche particolari, saranno utilizzati per la gestione del rapporto associativo nei due predetti livelli.</p>

  <div style="margin:5px 0 2px;">
    <span class="cb-label">{{CHECK_SOCIO}}</span>
    <strong style="font-size:11px;">Consenso del socio</strong>
  </div>
  <p>Per quanto riguarda il trattamento dei dati da lei forniti, l'Avis Comunale alla quale Lei è iscritto/a e l'Avis Provinciale di Lecco Odv sono da considerarsi contitolari del trattamento e quindi i suoi dati, anche particolari, saranno utilizzati per la gestione del rapporto associativo nei due predetti livelli.</p>
  <p>Le forniamo, inoltre, le seguenti informazioni:</p>

  <div class="section-title">1. Titolare del trattamento</div>
  <p>Titolare del trattamento dei dati è l'<strong>AVIS Comunale di</strong>
    <span class="field" style="min-width:20mm;">Merate</span> Odv – con sede legale in
    <span class="field" style="min-width:18mm;">Merate</span>
    <span class="field" style="min-width:30mm;">piazza don Minzoni, 5</span>
  </p>

  <div class="section-title">2. Responsabile della protezione dei dati (DPO)</div>
  <p>Il Responsabile della protezione, è indicato nella pagina web https://www.avisprovincialelecco.it/images/privacy/lettera-per-dpo.pdf e può essere contattato via e-mail o via posta utilizzando i dati di contatto presenti nella medesima pagina web.</p>

  <div class="section-title">3. Finalità del trattamento e base giuridica</div>
  <p>I Suoi dati personali saranno trattati for le seguenti finalità:</p>
  <p>a) consentire e gestire la Sua adesione/iscrizione (anche mediante inserimento nelle anagrafiche e nei database informatici gestiti dell'Associazione);</p>
  <p>b) programmare e gestire le attività relative alla donazione e raccolta di sangue e plasma con riferimento al controllo dell'idoneità, alla Sua reperibilità e alla conservazione dei dati clinici ai sensi di legge, ove applicabili;</p>
  <p>c) adempimento di obblighi di legge e/o di regolamenti e rispetto procedure amministrative interne;</p>
  <p>La base giuridica per le suddette attività di trattamento dei Suoi dati personali è il diretto espletamento delle finalità determinate e legittime individuate dallo statuto, da leggi e regolamenti.</p>
  <p>Solo previo e specifico consenso, per le seguenti finalità:</p>
  <p>d) convocazione alla donazione, mediante chiamata telefonica o invio di messaggio multimediale (SMS, Whats-app, ecc.), effettuata da personale all'uopo incaricato;</p>
  <p>e) informative: invio di materiale informativo dell'Associazione e di comunicazioni (ivi comprese le newsletter);</p>
  <p>f) benemerenze, consegna del premio per la benemerenza come da regolamento Nazionale;</p>
  <p>g) divulgazione a terzi della benemerenza, altri associati, giornali, e altri max media;</p>
  <p>N.B. I dati a fini statistici e storici saranno trattati solo in modo anonimo.</p>
  <p>La base giuridica per le suddette attività di trattamento è il consenso da Lei liberamente prestato per una o più finalità specifiche. In particolare, i trattamenti di cui alla lettera e) sono effettuati sulla base del legittimo interesse del Titolare di rendere il rapporto con il socio più trasparente, efficace e duraturo attraverso l'invio di informazioni specifiche sulle particolari attività, progetti già sostenuti, sulle iniziative e sulle necessità più urgenti dei progetti in fase di avvio o di sviluppo. Il socio può chiedere in qualsiasi momento di non ricevere più tale tipologia di comunicazione.</p>

  <div class="section-title">4. Modalità del trattamento</div>
  <p>Il trattamento dei dati avverrà sia con mezzi informatici sia con supporti cartacei e verrà gestito direttamente dalla scrivente Associazione con l'ausilio di collaboratori a ciò specificatamente incaricati ai sensi di legge. Potranno inoltre venire a conoscenza dei suoi dati le strutture direttive dell'Associazione cui aderisce.</p>

  <div class="section-title">5. Categorie particolari di dati personali</div>
  <p>Il trattamento può riguardare anche dati appartenenti a "categorie particolari di dati personali" (c.d. "particolari"), cioè dati idonei a rivelare, a mero titolo di esempio, il suo stato di salute. Il trattamento comprenderà, nel rispetto dei limiti e delle condizioni posti dalla normativa comunitaria e nazionale, tutte le operazioni o complesso di operazioni necessarie al trattamento in questione.</p>
  <p>Il trattamento dei dati personali e particolari avverrà in conformità alle autorizzazioni, anche in forma generale, del Garante per la protezione dei dati personali, ove rinnovate.</p>

  <div class="section-title">6. Destinatari dei dati</div>
  <p>Per le predette finalità e nell'ambito delle stesse, i dati potranno essere comunicati alle strutture sanitarie di ogni livello e alle strutture AVIS che per particolari esigenze ne facciano richiesta. Inoltre, i dati, raccolti in sede locale, potranno essere comunicati, in base agli obblighi statutari, alle Associazioni AVIS regionale e nazionale, che sono da considerarsi autonomi titolari del trattamento.</p>
  <p>I Suoi dati personali non sono oggetto di diffusione. L'eventuale comunicazione ai destinatari di cui sopra sarà condizionata da regole specifiche.</p>

</div><!-- /page 2 -->


<!-- ═══════════════════════════════════════════════════════
     PAGE 3 — PRIVACY RETRO
     ═══════════════════════════════════════════════════════ -->
<div class="page {{P3_HIDDEN}}">

  <div class="section-title">7. Trasferimento dei dati</div>
  <p>Il Titolare non intende trasferire dati personali in un Paese terzo o a organizzazioni internazionali.</p>

  <div class="section-title">8. Periodo di conservazione</div>
  <p>I Suoi dati personali sono conservati per il periodo di tempo non superiore a quello necessario per il conseguimento delle finalità per le quali sono raccolti e trattati o per quelli previsti per legge. In particolare, anche ai fini della tutela della salute collettiva, la legge impone di raccogliere e conservare i dati anagrafici e sanitari dei donatori e consentire il tracciamento delle donazioni per trenta anni.</p>

  <div class="section-title">9. Natura obbligatoria o facoltativa del conferimento dei dati e conseguenze di un eventuale rifiuto</div>
  <p>La natura del conferimento dei dati è obbligatoria per le finalità previste al paragrafo 3 alle lettere a), b) e c). Il mancato conferimento comporterà l'impossibilità di costituire o proseguire il rapporto con le Associazioni contitolari del trattamento ed effettuare donazioni di sangue nel contesto associativo.</p>
  <p>Il conferimento dei dati personali è facoltativo per le finalità previste al paragrafo 3 alle lettere d) ed e) e non preclude l'adesione dell'Interessato all'Associazione e/o la donazione di sangue nel contesto associativo.</p>

  <div class="section-title">10. Esistenza di un processo decisionale automatizzato</div>
  <p>Il Titolare può adottare processi decisionali automatizzati, compresa la profilazione, nel rispetto dei dettati del Regolamento UE n. 679/2016.</p>

  <div class="section-title">11. Diritto di accesso ai dati personali e altri diritti</div>
  <p>1. L'interessato ha diritto di ottenere la conferma dell'esistenza o meno di dati personali che lo riguardano, anche se non ancora registrati, e la loro comunicazione in forma intelligibile.</p>
  <p>2. L'interessato ha diritto di ottenere:</p>
  <p>a) l'aggiornamento, la rettifica ovvero, quando vi ha interesse, l'integrazione dei dati;</p>
  <p>b) l'cancellazione, la trasformazione in forma anonima o il blocco dei dati trattati in violazione di legge, compresi quelli di cui non è necessaria la conservazione in relazione agli scopi per i quali i dati sono stati raccolti o successivamente trattati;</p>
  <p>c) l'attestazione che le operazioni di cui alle lettere a) e b) sono state portate a conoscenza, anche per quanto riguarda il loro contenuto, di coloro ai quali i dati sono stati comunicati o diffusi, eccettuato il caso in cui tale adempimento si rivela impossibile o comporta un impiego di mezzi manifestamente sproporzionato rispetto al diritto tutelato.</p>
  <p>3. L'interessato ha diritto di opporsi, in tutto o in parte:</p>
  <p>a) per motivi legittimi al trattamento dei dati personali che lo riguardano, ancorché pertinenti allo scopo della raccolta;</p>
  <p>b) al trattamento di dati personali che lo riguardano a fini di invio di materiale pubblicitario o di vendita diretta o per il compimento di ricerche di mercato o di comunicazione commerciale.</p>
  <p>4. L'interessato ha diritto alla portabilità dei propri dati e a proporre reclamo all'autorità Garante per la protezione dei dati personali, con sede in piazza Venezia 11 in Roma.</p>

  <hr class="thin" style="margin:7px 0;" />

  <!-- Consent section header -->
  <div class="consent-title">
    <span class="cb-label">{{CHECK_ASPIRANTE_P3}}</span> Consenso dell'aspirante socio
    &nbsp;&nbsp; oppure &nbsp;&nbsp;
    <span class="cb-label">{{CHECK_SOCIO_P3}}</span> Consenso del socio
  </div>

  <!-- Personal fields -->
  <div style="font-size:9.5px; line-height:2.4; margin-top:5mm;">
    <span>Io sottoscritto/a</span>
    <span class="field" style="min-width:55mm;">{{SUBSCRIBER_FULL_NAME}}</span>
    <span>&nbsp;, nato/a a</span>
    <span class="field" style="min-width:35mm;">{{SUBSCRIBER_BIRTH_CITY}}</span>
    <span>&nbsp;, il</span>
    <span class="field" style="min-width:22mm;">{{SUBSCRIBER_BIRTH_DATE}}</span>
    <br/>
    <span class="field" style="min-width:18mm;">{{SUBSCRIBER_CERT_NUM}}</span>
    <span>&nbsp;, C.F.</span>
    <span class="field" style="min-width:55mm;">{{SUBSCRIBER_FISCAL_CODE}}</span>
    <span>&nbsp;, residente in</span>
    <br/>
    <span class="field" style="min-width:75mm;">{{SUBSCRIBER_RESIDENCE_CITY}}</span>
    <span>&nbsp;via/piazza</span>
    <span class="field" style="min-width:55mm;">{{SUBSCRIBER_STREET}}</span>
    <span>&nbsp;, già iscritto/a</span>
    <br/>
    <span>all'Avis Comunale di</span>
    <span class="field" style="min-width:55mm;">{{SUBSCRIBER_AVIS_MUNICIPALITY}}</span>
    <span>&nbsp;,</span>
    <br/>
    <span>tel./cell.</span>
    <span class="field" style="min-width:50mm;">{{SUBSCRIBER_PHONE}}</span>
    <span>&nbsp;e-mail</span>
    <br/>
    <span class="field" style="min-width:80mm;">{{SUBSCRIBER_EMAIL}}</span>
  </div>

  <p style="margin-top:5px;">dichiaro di aver preso visione dell'informativa su riportata, di averla letta e ben compresa e:</p>

  <!-- Consent groups -->
  <div class="consent-group">
    <div class="consent-row">
      <div class="consent-opt"><span class="sq">{{CONS_ABC_YES}}</span> <strong>acconsento</strong></div>
      <div class="consent-opt"><span class="sq">{{CONS_ABC_NO}}</span> non acconsento</div>
    </div>
    <p style="text-align:left;">al trattamento dei miei dati personali e particolari così come indicati e nei limiti dell'informativa oggetto della presente comunicazione di cui ai punti 3 a), b) e c)</p>
  </div>

  <div class="consent-group">
    <div class="consent-row">
      <div class="consent-opt"><span class="sq">{{CONS_D_YES}}</span> <strong>acconsento</strong></div>
      <div class="consent-opt"><span class="sq">{{CONS_D_NO}}</span> non acconsento</div>
    </div>
    <p style="text-align:left;">all'utilizzo del mezzo telefonico per le chiamate, coinvolgendo eventualmente i famigliari che raccogliessero la comunicazione (di cui al punto 3 d)</p>
  </div>

  <div class="consent-group">
    <div class="consent-row">
      <div class="consent-opt"><span class="sq">{{CONS_E_YES}}</span> <strong>acconsento</strong></div>
      <div class="consent-opt"><span class="sq">{{CONS_E_NO}}</span> non acconsento</div>
    </div>
    <p style="text-align:left;">all'invio di materiale informativo dell'Associazione di cui al punto 3 e)</p>
  </div>

  <div class="consent-group">
    <div class="consent-row">
      <div class="consent-opt"><span class="sq">{{CONS_F_YES}}</span> <strong>acconsento</strong></div>
      <div class="consent-opt"><span class="sq">{{CONS_F_NO}}</span> non acconsento</div>
    </div>
    <p style="text-align:left;">alla chiamata per le benemerenze da regolamento Nazionale e relativa consegna del riconoscimento (di cui al punto 3 f)</p>
  </div>

  <div class="consent-group">
    <div class="consent-row">
      <div class="consent-opt"><span class="sq">{{CONS_G_YES}}</span> <strong>acconsento</strong></div>
      <div class="consent-opt"><span class="sq">{{CONS_G_NO}}</span> non acconsento</div>
    </div>
    <p style="text-align:left;">alla divulgazione a terzi delle benemerenze conseguite (di cui al punto 3 g)</p>
  </div>

  <!-- Luogo/data + firma -->
  <div style="display:flex; justify-content:space-between; margin-top:10mm;">
    <div style="width:44%;">
      <div style="font-size:9px; font-weight:bold; color:var(--avis-blue);">Luogo e data</div>
      <div style="border-bottom:1px solid var(--avis-blue); margin-top:8mm; display:flex; gap:4mm; font-size:8.5px; color:#444; font-style:italic; padding-bottom:1px;">
        <span>{{PLACE}}</span><span>,</span><span>{{DATE}}</span>
      </div>
    </div>
    <div style="width:44%;">
      <div style="font-size:9px; font-weight:bold; color:var(--avis-blue);">Firma dell'interessato</div>
      <div style="border-bottom:1px solid var(--avis-blue); margin-top:8mm; font-size:8.5px; color:#444; font-style:italic; padding-bottom:1px;">{{SIGNATURE}}</div>
    </div>
  </div>

</div><!-- /page 3 -->

</body>
</html>
`;

export const printModule = (donor: Donor, moduleType: 'iscrizione' | 'privacy') => {
  let html = TEMPLATE;

  // Helper to format date
  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString('it-IT');
  };

  // Replace basic placeholders
  const replacements: Record<string, string> = {
    '{{LOGO_SRC}}': LOGO_URL,
    '{{FULL_NAME}}': `${donor.firstName || ''} ${donor.lastName || ''}`.trim(),
    '{{BIRTH_CITY}}': donor.birthPlace || '',
    '{{BIRTH_PROVINCE}}': '',
    '{{BIRTH_DATE}}': formatDate(donor.birthDate),
    '{{RESIDENCE_STREET}}': donor.address || '',
    '{{DOMICILE_STREET}}': donor.address || '', // Default to same
    '{{RESIDENCE_CITY}}': donor.town || '',
    '{{DOMICILE_CITY}}': donor.town || '',
    '{{EMAIL}}': donor.email || '',
    '{{HOME_PHONE}}': '',
    '{{MOBILE_PHONE}}': donor.phone || '',
    '{{HEALTH_CARD}}': '',
    '{{WORKPLACE}}': '',
    '{{COLLECTION_POINT}}': 'Ospedale Mandic Merate',
    '{{OTHER_ASSOCIATION}}': donor.otherAssociations || '',
    '{{DATE}}': formatDate(new Date()),
    '{{SIGNATURE}}': '',
    '{{P1_HIDDEN}}': moduleType === 'privacy' ? 'no-print' : '',
    '{{P2_HIDDEN}}': moduleType === 'iscrizione' ? 'no-print' : '',
    '{{P3_HIDDEN}}': moduleType === 'iscrizione' ? 'no-print' : '',
    '{{MALE_SELECTED}}': donor.gender === 'male' ? 'selected' : '',
    '{{FEMALE_SELECTED}}': donor.gender === 'female' ? 'selected' : '',
    '{{OTHER_ASSOC_SI}}': donor.otherAssociations && donor.otherAssociations.trim() !== '' ? 'selected' : '',
    '{{OTHER_ASSOC_NO}}': (donor.otherAssociations && (donor.otherAssociations.trim().toLowerCase() === 'no' || donor.otherAssociations.trim().toLowerCase() === 'nessuna')) ? 'selected' : '',
  };

  // Tax Code cells
  const cf = (donor.taxCode || "").toUpperCase().replace(/\s/g, '');
  for (let i = 1; i <= 16; i++) {
    replacements[`{{FC_${i.toString().padStart(2, '0')}}}`] = cf[i - 1] || '';
  }

  // Education Checkboxes
  const edu = (donor.education || "").toLowerCase();
  replacements['{{CHECK_EDU_NONE}}'] = edu === "" ? "" : ""; // don't default to none
  replacements['{{CHECK_EDU_ELEM}}'] = edu.includes("elementare") ? "✓" : "";
  replacements['{{CHECK_EDU_MEDIA}}'] = edu.includes("media") ? "✓" : "";
  replacements['{{CHECK_EDU_DIPL}}'] = edu.includes("diploma") ? "✓" : "";
  replacements['{{CHECK_EDU_LAUR}}'] = edu.includes("laurea") ? "✓" : "";

  // Privacy specific
  replacements['{{CHECK_ASPIRANTE}}'] = "✓";
  replacements['{{CHECK_SOCIO}}'] = "";
  replacements['{{CHECK_ASPIRANTE_P3}}'] = "✓";
  replacements['{{CHECK_SOCIO_P3}}'] = "";
  replacements['{{SUBSCRIBER_FULL_NAME}}'] = `${donor.firstName || ''} ${donor.lastName || ''}`.trim();
  replacements['{{SUBSCRIBER_BIRTH_CITY}}'] = donor.birthPlace || '';
  replacements['{{SUBSCRIBER_BIRTH_DATE}}'] = formatDate(donor.birthDate);
  replacements['{{SUBSCRIBER_CERT_NUM}}'] = "";
  replacements['{{SUBSCRIBER_FISCAL_CODE}}'] = cf;
  replacements['{{SUBSCRIBER_RESIDENCE_CITY}}'] = donor.town || '';
  replacements['{{SUBSCRIBER_STREET}}'] = donor.address || '';
  replacements['{{SUBSCRIBER_AVIS_MUNICIPALITY}}'] = donor.localAvis || 'Merate';
  replacements['{{SUBSCRIBER_PHONE}}'] = donor.phone || '';
  replacements['{{SUBSCRIBER_EMAIL}}'] = donor.email || '';
  replacements['{{PLACE}}'] = "Merate";

  // Consents (Leave for manual signature)
  replacements['{{CONS_ABC_YES}}'] = "";
  replacements['{{CONS_ABC_NO}}'] = "";
  replacements['{{CONS_D_YES}}'] = "";
  replacements['{{CONS_D_NO}}'] = "";
  replacements['{{CONS_E_YES}}'] = "";
  replacements['{{CONS_E_NO}}'] = "";
  replacements['{{CONS_F_YES}}'] = "";
  replacements['{{CONS_F_NO}}'] = "";
  replacements['{{CONS_G_YES}}'] = "";
  replacements['{{CONS_G_NO}}'] = "";

  // Automatic ISTAT and CAP population
  const fillBoxes = (prefix: string, value: string, length: number) => {
    const val = (value || "").replace(/\s/g, '');
    for (let i = 1; i <= length; i++) {
      replacements[`{{${prefix}_${i}}}`] = val[i - 1] || '';
    }
  };

  // Birth Town ISTAT
  const birthTownData = donor.birthPlace ? searchComuni(donor.birthPlace) : [];
  if (birthTownData.length > 0) {
    fillBoxes('ISTAT_COM', birthTownData[0].item.codiceIstat, 6);
  } else {
    for (let i = 1; i <= 6; i++) replacements[`{{ISTAT_COM_${i}}}`] = "";
  }

  // Residence Town ISTAT
  const resTownData = donor.town ? searchComuni(donor.town) : [];
  if (resTownData.length > 0) {
    fillBoxes('ISTAT_RES', resTownData[0].item.codiceIstat, 6);
    // Fill CAP if not already present or as default
    const cap = resTownData[0].item.cap || "";
    fillBoxes('CAP_RES', cap, 5);
    fillBoxes('CAP_DOM', cap, 5);
  } else {
    for (let i = 1; i <= 6; i++) replacements[`{{ISTAT_RES_${i}}}`] = "";
    for (let i = 1; i <= 5; i++) {
      replacements[`{{CAP_RES_${i}}}`] = "";
      replacements[`{{CAP_DOM_${i}}}`] = "";
    }
  }


  // Ensure all CHECK and CONS placeholders are set to empty if not already defined
  // This prevents layout breaking if a placeholder is missing from the logic
  const placeholderRegex = /{{([A-Z0-9_]+)}}/g;
  let match;
  const tempReplacements: Record<string, string> = { ...replacements };
  while ((match = placeholderRegex.exec(html)) !== null) {
    const p = match[0];
    if (!(p in tempReplacements)) {
      tempReplacements[p] = "";
    }
  }

  // Actually replace in HTML
  Object.entries(tempReplacements).forEach(([key, value]) => {
    html = html.split(key).join(value);
  });

  // Final emergency scrub for anything missed
  html = html.replace(/{{[A-Z0-9_]+}}/g, "");

  // Open print window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();

    // Wait for images to load before printing
    const img = printWindow.document.querySelector('img');
    if (img && !img.complete) {
      img.onload = () => {
        printWindow.print();
      };
    } else {
      // Small timeout to ensure browser has rendered the styles
      setTimeout(() => {
        printWindow.print();
      }, 300);
    }
  }
};
