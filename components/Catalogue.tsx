import React, { useState, useMemo, useEffect } from 'react';
import { Ordnance } from '../types';

interface CatalogueProps {
  munitions: Ordnance[];
}

const Catalogue: React.FC<CatalogueProps> = ({ munitions }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('Tous');
  const [selectedItem, setSelectedItem] = useState<Ordnance | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Fermeture via touche Echap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedItem) {
        setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const categories = useMemo(() => 
    Array.from(new Set(munitions.map(m => m.category))).sort()
  , [munitions]);

  const subCategories = useMemo(() => 
    activeCategory === 'Tous' ? [] : 
    Array.from(new Set(munitions.filter(m => m.category === activeCategory).map(m => m.subCategory))).sort()
  , [activeCategory, munitions]);

  const filtered = useMemo(() => {
    return munitions.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || 
                          m.localName?.toLowerCase().includes(search.toLowerCase()) ||
                          m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = activeCategory === 'Tous' || m.category === activeCategory;
      const matchSub = activeSubCategory === 'Tous' || m.subCategory === activeSubCategory;
      return matchSearch && matchCat && matchSub;
    });
  }, [munitions, search, activeCategory, activeSubCategory]);

  useEffect(() => {
    setCurrentImgIdx(0);
    if (selectedItem) {
        // Bloque le scroll du body sur desktop et mobile
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    } else {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    }
    return () => { 
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
    };
  }, [selectedItem]);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setCurrentImgIdx(prev => (prev + 1) % selectedItem.imageUrls.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedItem) return;
    setCurrentImgIdx(prev => (prev - 1 + selectedItem.imageUrls.length) % selectedItem.imageUrls.length);
  };

  return (
    <>
      <div className="space-y-8 animate-in">
        {/* Filtres tactiques */}
        <div className="bg-stone-900 border border-stone-800 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 flex flex-col md:flex-row gap-3 sm:gap-4 shadow-2xl">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Rechercher..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl sm:rounded-2xl px-5 py-3.5 sm:py-4 pl-12 focus:ring-2 focus:ring-orange-600/50 outline-none transition-all text-sm text-stone-200"
            />
            <svg viewBox="0 0 24 24" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-600" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          
          <select 
            value={activeCategory}
            onChange={e => { setActiveCategory(e.target.value); setActiveSubCategory('Tous'); }}
            className="bg-stone-950 border border-stone-800 rounded-xl sm:rounded-2xl px-5 py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest outline-none hover:border-orange-600/50 cursor-pointer text-stone-400"
          >
            <option value="Tous">Toutes Catégories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {activeCategory !== 'Tous' && (
            <select 
              value={activeSubCategory}
              onChange={e => setActiveSubCategory(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl sm:rounded-2xl px-5 py-3.5 sm:py-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-orange-500 outline-none animate-in"
            >
              <option value="Tous">Toutes Sous-Catégories</option>
              {subCategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>

        {/* Grille de résultats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map(item => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-stone-900/40 border border-stone-800 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden hover:border-orange-600/50 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <div className="aspect-square bg-black relative flex items-center justify-center p-6">
                {item.imageUrls[0] ? (
                  <img src={item.imageUrls[0]} alt={item.name} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-all group-hover:scale-105" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-16 h-16 text-stone-900" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                )}
                <div className="absolute top-4 left-4">
                  <span className="text-[7px] sm:text-[8px] font-black text-stone-600 uppercase tracking-widest bg-stone-950/80 px-2.5 py-1 rounded-full border border-stone-800">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-2 border-t border-stone-800">
                <h3 className="text-lg sm:text-xl font-black text-stone-100 uppercase tracking-tighter">{item.name}</h3>
                <p className="text-[9px] sm:text-[10px] text-stone-500 font-bold uppercase tracking-widest">{item.localName}</p>
                <div className="flex flex-wrap gap-1.5 pt-3">
                  {item.tags.slice(0, 3).map(t => <span key={t} className="text-[7px] font-black text-stone-600 border border-stone-800 px-2 py-0.5 rounded-full uppercase">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay de Détails - Centrage Fixe Absolu */}
      {selectedItem && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl cursor-pointer p-4 sm:p-6 md:p-8 overflow-hidden"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-stone-900 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] sm:rounded-[3.5rem] border border-stone-800 overflow-hidden flex flex-col md:flex-row relative shadow-[0_0_150px_rgba(0,0,0,1)] cursor-default transition-all duration-300 animate-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton Fermer */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 sm:w-12 sm:h-12 bg-stone-950/95 border border-stone-800 rounded-2xl flex items-center justify-center text-stone-500 hover:text-orange-500 hover:border-orange-500/50 transition-all shadow-xl active:scale-90"
              title="Fermer (Echap)"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            {/* Galerie d'Images - Stackée au dessus sur mobile */}
            <div className="w-full md:w-1/2 bg-stone-950 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative border-b md:border-b-0 md:border-r border-stone-800 min-h-[250px] sm:min-h-[400px] shrink-0">
              <div className="flex-1 flex items-center justify-center w-full max-h-[200px] sm:max-h-full">
                {selectedItem.imageUrls[currentImgIdx] ? (
                  <img src={selectedItem.imageUrls[currentImgIdx]} alt={selectedItem.name} className="max-w-full max-h-full object-contain drop-shadow-[0_20px_70px_rgba(0,0,0,0.8)] transition-all duration-500" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-24 h-24 text-stone-900" fill="none" stroke="currentColor" strokeWidth="0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                )}
              </div>
              
              {selectedItem.imageUrls.length > 1 && (
                <>
                  <button onClick={prevImg} className="absolute left-4 top-[40%] md:top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-stone-900/80 border border-stone-800 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all shadow-2xl backdrop-blur-md z-20">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button onClick={nextImg} className="absolute right-4 top-[40%] md:top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-stone-900/80 border border-stone-800 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all shadow-2xl backdrop-blur-md z-20">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <div className="flex gap-2 mt-4 sm:mt-8">
                    {selectedItem.imageUrls.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentImgIdx(i)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${i === currentImgIdx ? 'bg-orange-600 w-4 sm:w-6' : 'bg-stone-800 hover:bg-stone-700'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Contenu Technique - Scrollable indépendamment */}
            <div className="flex-1 p-6 sm:p-12 lg:p-16 space-y-6 sm:space-y-10 overflow-y-auto custom-scrollbar bg-stone-900">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-black text-orange-600 uppercase tracking-[0.4em]">
                  <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                  {selectedItem.hierarchy.join(' / ')}
                </div>
                <h2 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.85]">{selectedItem.name}</h2>
                <div className="text-lg sm:text-2xl text-stone-600 font-bold italic uppercase tracking-tighter">{selectedItem.localName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <InfoBox label="Pays" value={selectedItem.country} />
                <InfoBox label="Charge" value={selectedItem.fill || 'N/A'} />
                <InfoBox label="Masse" value={selectedItem.weight || 'N/A'} />
                <InfoBox label="Allumeur" value={selectedItem.fuze || 'N/A'} />
              </div>

              <div className="space-y-3 sm:space-y-4">
                <label className="text-[9px] sm:text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] font-mono">ANALYSE_TECHNIQUE</label>
                <div className="bg-stone-950/40 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-800">
                  <p className="text-stone-300 italic leading-relaxed text-sm sm:text-lg">"{selectedItem.description}"</p>
                </div>
              </div>

              {selectedItem.warning && (
                <div className="p-5 sm:p-8 bg-red-950/20 border border-red-900/30 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row gap-4 sm:gap-6 items-center shadow-[0_0_60px_rgba(220,38,38,0.15)]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  </div>
                  <div className="text-red-500 font-black text-[9px] sm:text-sm uppercase leading-tight tracking-wide text-center sm:text-left">{selectedItem.warning}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #292524; border-radius: 10px; }
      `}</style>
    </>
  );
};

const InfoBox: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="bg-stone-950/50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-stone-800/60 flex flex-col justify-center min-w-0">
    <div className="text-[7px] sm:text-[8px] font-black text-stone-700 uppercase tracking-widest mb-1 truncate">{label}</div>
    <div className="text-stone-100 font-bold text-xs sm:text-base truncate">{value}</div>
  </div>
);

export default Catalogue;