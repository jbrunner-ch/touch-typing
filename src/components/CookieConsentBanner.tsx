import React from 'react';
import { Shield } from 'lucide-react';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onOpenPrivacy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onAccept,
  onOpenPrivacy,
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-3xl mx-auto bg-stone-900 text-stone-100 rounded-xl p-4 sm:p-5 shadow-xl border-2 border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-pop-in">
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-stone-200 leading-relaxed">
          <strong className="text-white">Datenschutz &amp; Speicherhinweis (revDSG):</strong> Wir verwenden
          keine Werbe- oder Tracking-Cookies. Technisch notwendiger Browser-Speicher sowie – bei
          Google-Anmeldung – Google Firebase (Region Zürich) werden nur für deinen Lernfortschritt
          genutzt.{' '}
          <button
            onClick={onOpenPrivacy}
            className="underline text-amber-300 hover:text-amber-200 cursor-pointer"
          >
            Datenschutzerklärung lesen
          </button>
        </div>
      </div>
      <button
        onClick={onAccept}
        className="shrink-0 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 border-b-2 border-blue-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
      >
        Verstanden &amp; Akzeptieren
      </button>
    </div>
  );
};
