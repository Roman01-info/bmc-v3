import React, { useRef, useEffect } from 'react';
import { BMCData, BMC_LABELS } from '../types';
import { Handshake, Activity, Box, Gift, Heart, Truck, Users, CreditCard, DollarSign, Save, X } from 'lucide-react';

interface BMCInputProps {
  data: BMCData;
  onChange: (field: keyof BMCData, value: string) => void;
  onSubmit: () => void;
  onSaveDraft: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Handshake: <Handshake className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Box: <Box className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
};

export const BMCInput: React.FC<BMCInputProps> = ({ data, onChange, onSubmit, onSaveDraft }) => {
  // Check if at least some fields are filled
  const isFormValid = Object.values(data).some(val => (val as string).trim().length > 0);

  return (
    <div className="w-full max-w-screen-2xl mx-auto p-4 md:p-8 pb-32">
      <div className="text-center mb-10 mt-2">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">বিজনেস মডেল ক্যানভাস</h2>
        <p className="text-lg text-slate-500 max-w-3xl mx-auto font-normal">আপনার ব্যবসার খুঁটিনাটি নিচের বক্সগুলোতে লিখুন। সঠিক তথ্য দিলে এনালাইসিস আরও নিখুঁত হবে।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 xl:gap-6 auto-rows-fr">
        {/* Row 1 Top */}
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 group">
          <InputCard field="keyPartners" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 group">
           <InputCard field="keyActivities" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-2xl shadow-md border border-indigo-100 p-5 transition-all hover:shadow-lg hover:border-indigo-300 bg-gradient-to-b from-indigo-50/50 to-white group relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
           <InputCard field="valuePropositions" data={data} onChange={onChange} highlight />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 group">
           <InputCard field="customerRelationships" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 lg:row-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 group">
           <InputCard field="customerSegments" data={data} onChange={onChange} />
        </div>

        {/* Row 1 Bottom */}
        <div className="md:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 md:col-start-2 group">
           <InputCard field="keyResources" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 md:col-start-4 group">
           <InputCard field="channels" data={data} onChange={onChange} />
        </div>

        {/* Row 2 Bottom */}
        <div className="md:col-span-1 lg:col-span-2.5 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 lg:col-span-2 group">
           <InputCard field="costStructure" data={data} onChange={onChange} />
        </div>
        <div className="md:col-span-1 lg:col-span-2.5 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-lg hover:border-indigo-200 lg:col-start-3 lg:col-span-3 group">
           <InputCard field="revenueStreams" data={data} onChange={onChange} />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
          
          <button
            onClick={onSaveDraft}
            disabled={!isFormValid}
            className={`px-6 py-3 rounded-xl font-bold text-base shadow-sm border transition-all duration-300 flex items-center gap-2
              ${isFormValid 
                ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200' 
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}`}
          >
            <Save className="w-4 h-4" />
            সেভ ড্রাফট
          </button>

          <button
            onClick={onSubmit}
            disabled={!isFormValid}
            className={`px-8 py-3 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-300 flex items-center gap-2
              ${isFormValid 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            {isFormValid ? (
              <>
                <SparklesIcon />
                এনালাইসিস করুন
              </>
            ) : 'তথ্য পূরণ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.39 9.39L22 12L14.39 14.39L12 22L9.61 14.39L2 12L9.61 9.39L12 2Z" fill="currentColor"/>
  </svg>
);

const InputCard: React.FC<{
  field: keyof BMCData;
  data: BMCData;
  onChange: (field: keyof BMCData, value: string) => void;
  highlight?: boolean;
}> = ({ field, data, onChange, highlight }) => {
  const meta = BMC_LABELS[field];
  const value = data[field] || '';
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset to calculate scrollHeight correctly
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(scrollHeight, 120)}px`; // Adjust min-height
    }
  }, [value]);

  const handleClear = () => {
    onChange(field, '');
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2.5 rounded-xl shrink-0 transition-colors duration-300 ${highlight ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
          {iconMap[meta.icon]}
        </div>
        <div>
          <h3 className={`font-bold text-lg leading-tight mb-0.5 ${highlight ? 'text-indigo-900' : 'text-slate-700'}`}>{meta.label}</h3>
          <p className="text-xs text-slate-400 font-medium">{meta.description}</p>
        </div>
      </div>
      
      <div className="relative flex-1 group/input">
        <textarea
          ref={textareaRef}
          className={`w-full p-4 pr-9 pb-8 rounded-xl border bg-slate-50/50 focus:bg-white transition-all resize-none text-base leading-relaxed min-h-[120px] overflow-hidden block outline-none
            ${highlight 
              ? 'border-indigo-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 shadow-sm' 
              : 'border-slate-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50/30 hover:border-indigo-200'}`}
          placeholder="এখানে লিখুন..."
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
        />
        
        {/* Clear Button */}
        <div className={`absolute top-2 right-2 transition-all duration-200 ${value ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={handleClear}
            className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="মুছে ফেলুন"
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        </div>

        {/* Character Count */}
        <div className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-300 pointer-events-none select-none bg-white/80 backdrop-blur-[2px] px-1.5 py-0.5 rounded border border-slate-100">
           {value.length}
        </div>
      </div>
    </div>
  );
};
