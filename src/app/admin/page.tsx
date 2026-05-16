"use client";

import { useState } from "react";
import { MENU_DATA } from "@/lib/menu-data";
import { Lock, Eye, EyeOff, Save, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [availability, setAvailability] = useState<Record<string, boolean>>(
    MENU_DATA.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") { // PIN d'esempio
      setIsAuthenticated(true);
    } else {
      alert("PIN errato!");
    }
  };

  const toggleAvailability = (id: string) => {
    setAvailability(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulazione salvataggio su Edge Config
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-6">
        <div className="glass-card p-8 w-full max-w-sm text-center">
          <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif mb-6">Accesso Ristoratore</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Inserisci PIN (es. 1234)"
              className="w-full bg-surface border border-border rounded-lg p-3 text-center text-2xl tracking-[1em] focus:border-accent outline-none"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full py-4">
              Entra
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Gestione Menù</h1>
            <p className="text-muted-text">Attiva o disattiva i prodotti in tempo reale.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              saved ? 'bg-green-600 text-white' : 'bg-accent text-background hover:bg-accent-hover'
            }`}
          >
            {isSaving ? "Salvataggio..." : saved ? <><CheckCircle2 size={20} /> Salvato!</> : <><Save size={20} /> Salva Modifiche</>}
          </button>
        </div>

        <div className="space-y-4">
          {MENU_DATA.map((product) => (
            <div key={product.id} className="glass-card p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${availability[product.id] ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-steak-red'}`} />
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-xs text-muted-text uppercase tracking-widest">{product.category}</p>
                </div>
              </div>
              
              <button
                onClick={() => toggleAvailability(product.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                  availability[product.id] 
                    ? 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                    : 'border-steak-red/30 bg-steak-red/10 text-steak-red hover:bg-steak-red/20'
                }`}
              >
                {availability[product.id] ? (
                  <><Eye size={16} /> Disponibile</>
                ) : (
                  <><EyeOff size={16} /> Esaurito</>
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-text">
          Nota: Questo sistema usa Vercel Edge Config per aggiornamenti istantanei senza database.
        </p>
      </div>
    </div>
  );
}
