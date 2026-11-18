import React, { useState } from 'react';
import { Download, FileText, ShieldCheck, Trash2, X } from 'lucide-react';

interface LegalModalProps {
  initialTab: 'privacy' | 'imprint' | 'data';
  isAuthenticated: boolean;
  onClose: () => void;
  onExportData: () => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialTab,
  isAuthenticated,
  onClose,
  onExportData,
  onDeleteAccount,
}) => {
  const [tab, setTab] = useState<'privacy' | 'imprint' | 'data'>(initialTab);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleExport = async () => {
    setBusy(true);
    setStatusMsg(null);
    try {
      await onExportData();
      setStatusMsg('Deine Daten wurden als JSON-Datei heruntergeladen.');
    } catch {
      setStatusMsg('Fehler beim Exportieren der Daten.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    setStatusMsg(null);
    try {
      await onDeleteAccount();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setStatusMsg(
        `Löschen fehlgeschlagen (${msg}). Hinweis: Bei sensiblen Aktionen verlangt Google ggf. eine frische Anmeldung – melde dich kurz neu an und versuche es erneut.`
      );
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-pop-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-slate-900 text-lg">Rechtliches & Datenschutz (Schweiz)</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-4 text-sm font-semibold">
          <button
            onClick={() => setTab('privacy')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              tab === 'privacy'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Datenschutzerklärung (revDSG)
          </button>
          <button
            onClick={() => setTab('imprint')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              tab === 'imprint'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Impressum
          </button>
          <button
            onClick={() => setTab('data')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              tab === 'data'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Meine Daten & Löschung
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto text-sm text-slate-700 space-y-4 leading-relaxed">
          {tab === 'privacy' && (
            <>
              <p className="text-xs text-slate-400">Stand: November 2026 • Ausgelegt nach Schweizer revDSG (und DSGVO, soweit anwendbar)</p>

              <section className="space-y-1">
                <h3 className="font-bold text-slate-900">1. Verantwortliche Stelle</h3>
                <p>
                  Verantwortlich für die Datenbearbeitung auf dieser Webapplikation («TippMeister») ist:
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-medium">
                  [PLATZHALTER: Vorname Nachname / Firma]
                  <br />
                  [PLATZHALTER: Strasse &amp; Hausnummer]
                  <br />
                  [PLATZHALTER: PLZ Ort, Schweiz]
                  <br />
                  E-Mail: [PLATZHALTER: Kontakt-E-Mail]
                </div>
              </section>

              <section className="space-y-1">
                <h3 className="font-bold text-slate-900">2. Welche Daten wir bearbeiten &amp; Zweck</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Gast-Modus (ohne Login):</strong> Dein Lernfortschritt wird ausschliesslich lokal im Speicher deines Browsers (<code>localStorage</code>) gesichert. Es findet keine Übermittlung an unsere Datenbank statt.
                  </li>
                  <li>
                    <strong>Google-Anmeldung (Firebase Authentication):</strong> Wenn du dich mit deinem Google-Konto anmeldest, erhalten wir von Google deine Nutzer-ID (UID), deinen Anzeigenamen, deine E-Mail-Adresse und (falls vorhanden) dein Profilbild, um dein Konto zu identifizieren.
                  </li>
                  <li>
                    <strong>Lernfortschritt (Cloud Firestore):</strong> Wir speichern deinen XP-Stand, dein Level, deinen Streak, deine Lektions-Sterne, deine Tasten-Statistiken (für das adaptive Training) sowie deine letzten Übungsergebnisse in der Region <code>europe-west6</code> (Zürich, Schweiz).
                  </li>
                </ul>
              </section>

              <section className="space-y-1">
                <h3 className="font-bold text-slate-900">3. Dienste von Drittanbietern &amp; Auslandbekanntgabe</h3>
                <p>
                  Für Authentifizierung, Datenbank und Hosting nutzen wir <strong>Google Firebase</strong> (Google Ireland Limited / Google LLC). Die Firestore-Datenbank wird im Rechenzentrum Zürich (<code>europe-west6</code>) betrieben. Bei der Google-Anmeldung können Authentifizierungsdaten auch über Server in den USA verarbeitet werden. Google LLC ist unter dem <em>Swiss-U.S. Data Privacy Framework</em> zertifiziert bzw. nutzt Standardvertragsklauseln, womit ein angemessenes Datenschutzniveau gemäss revDSG gewährleistet ist.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-bold text-slate-900">4. Cookies &amp; lokaler Speicher</h3>
                <p>
                  Wir setzen <strong>keine</strong> Werbe-, Tracking- oder Analyse-Cookies ein. Wir verwenden lediglich technisch notwendigen Browser-Speicher (<code>localStorage</code> / <code>IndexedDB</code> für Firebase Auth), um deine Einwilligung, dein gewähltes Tastaturlayout und deine aktive Sitzung zu speichern.
                </p>
              </section>

              <section className="space-y-1">
                <h3 className="font-bold text-slate-900">5. Deine Rechte (revDSG)</h3>
                <p>
                  Du hast jederzeit das Recht auf Auskunft, Berichtigung, Datenherausgabe (Portabilität) sowie vollständige Löschung deiner Personendaten. Im Tab <strong>«Meine Daten &amp; Löschung»</strong> kannst du deine gesamten Daten direkt als JSON herunterladen oder dein Konto samt allen Datenbankeinträgen unwiderruflich löschen.
                </p>
              </section>
            </>
          )}

          {tab === 'imprint' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileText className="w-4 h-4 text-indigo-600" />
                Impressum (gemäss Schweizer UWG)
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-950 space-y-1">
                <p className="font-bold">Betreiber der Webapplikation:</p>
                <p>[PLATZHALTER: Vorname Nachname / Firma]</p>
                <p>[PLATZHALTER: Strasse &amp; Hausnummer]</p>
                <p>[PLATZHALTER: PLZ Ort]</p>
                <p>Schweiz</p>
                <p className="pt-2">
                  <strong>Kontakt:</strong> [PLATZHALTER: E-Mail-Adresse wird noch ergänzt]
                </p>
              </div>
              <p className="text-xs text-slate-500">
                Hinweis: Bitte ersetze alle <code>[PLATZHALTER]</code> vor einer öffentlichen Produktivschaltung mit deinen vollständigen, aktuellen Kontaktdaten.
              </p>
            </div>
          )}

          {tab === 'data' && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-slate-900">Datenauskunft &amp; Export (Art. 25 / 28 revDSG)</h3>
                <p className="text-xs text-slate-600">
                  Lade eine vollständige Kopie deines Profils, deiner Lektionsfortschritte, Tasten-Statistiken und Übungshistorie als JSON-Datei herunter.
                </p>
                <button
                  disabled={busy}
                  onClick={handleExport}
                  className="mt-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Meine Daten als JSON exportieren
                </button>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                <h3 className="font-bold text-rose-900">Konto &amp; alle Daten unwiderruflich löschen</h3>
                <p className="text-xs text-rose-800">
                  {isAuthenticated
                    ? 'Löscht dein Firebase-Authentifizierungskonto sowie sämtliche in Firestore und lokal gespeicherten Lernfortschritte.'
                    : 'Löscht deinen gesamten lokal gespeicherten Lernfortschritt aus diesem Browser.'}
                </p>

                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="mt-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    Alle Daten löschen...
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      disabled={busy}
                      onClick={handleDelete}
                      className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold cursor-pointer"
                    >
                      Ja, endgültig und unwiderruflich löschen
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Abbrechen
                    </button>
                  </div>
                )}
              </div>

              {statusMsg && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium">
                  {statusMsg}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
