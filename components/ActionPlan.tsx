
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { ArrowLeft, Megaphone, TrendingUp, Settings, DollarSign, Users, Briefcase, CheckSquare, Printer, User, FileText, Download } from 'lucide-react';

interface ActionPlanProps {
  result: AnalysisResult;
  onBack: () => void;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({ result, onBack }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Helper to map department names to icons
  const getIconForDept = (deptName: string) => {
    const name = deptName.toLowerCase();
    if (name.includes('market') || name.includes('মার্কেটিং') || name.includes('প্রচার')) return <Megaphone className="w-6 h-6" />;
    if (name.includes('sales') || name.includes('সেলস') || name.includes('বিক্রয়')) return <TrendingUp className="w-6 h-6" />;
    if (name.includes('oper') || name.includes('অপারেশন') || name.includes('ব্যবস্থাপনা')) return <Settings className="w-6 h-6" />;
    if (name.includes('finan') || name.includes('হিসাব') || name.includes('অর্থ')) return <DollarSign className="w-6 h-6" />;
    if (name.includes('hr') || name.includes('মানব') || name.includes('team')) return <Users className="w-6 h-6" />;
    return <Briefcase className="w-6 h-6" />;
  };

  const getColorForDept = (index: number) => {
    const colors = [
      'bg-blue-50 text-blue-700 border-blue-100',
      'bg-emerald-50 text-emerald-700 border-emerald-100',
      'bg-purple-50 text-purple-700 border-purple-100',
      'bg-orange-50 text-orange-700 border-orange-100',
      'bg-pink-50 text-pink-700 border-pink-100',
    ];
    return colors[index % colors.length];
  };

  const handlePrint = () => {
    window.print();
  };

  const getActionPlanHTML = () => {
    return `
      <div style="font-family: 'Hind Siliguri', sans-serif; color: #1e293b;">
        <h1 style="text-align: center; color: #4f46e5; margin-bottom: 10px;">ডিপার্টমেন্টাল অ্যাকশন প্ল্যান</h1>
        <p style="text-align: center; color: #64748b; margin-bottom: 30px;">পদ ও দায়িত্ব অনুযায়ী আপনার প্রতিষ্ঠানের করণীয় তালিকা</p>
        
        ${(result.departmentalActionPlan || []).map(dept => `
          <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #f8fafc; padding: 15px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0; color: #334155; font-size: 18pt;">${dept.department}</h2>
            </div>
            <div style="padding: 20px;">
              ${dept.roles.map(role => `
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #4f46e5; margin-bottom: 10px; font-size: 14pt;">${role.role}</h3>
                  <ul style="margin: 0; padding-left: 20px;">
                    ${role.tasks.map(task => `
                      <li style="margin-bottom: 8px; color: #475569; line-height: 1.5;">${task}</li>
                    `).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const downloadWord = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Action Plan</title>
      </head>
      <body>
        ${getActionPlanHTML()}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Action_Plan.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    // @ts-ignore
    if (typeof window.html2pdf === 'undefined') {
      alert("PDF library not loaded yet. Please try printing instead.");
      return;
    }

    setIsDownloading(true);
    const container = document.createElement('div');
    container.innerHTML = getActionPlanHTML();
    container.style.padding = '20px';
    document.body.appendChild(container);

    const opt = {
      margin: 10,
      filename: 'Action_Plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(container).save().then(() => {
      setIsDownloading(false);
      document.body.removeChild(container);
    });
  };

  const actionPlans = result.departmentalActionPlan || [];

  return (
    <div className="w-full max-w-screen-xl mx-auto p-4 md:p-8 pb-32 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-center gap-6 mb-10 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          রিপোর্টে ফিরে যান
        </button>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center justify-center gap-3">
             <CheckSquare className="w-8 h-8 text-indigo-600" />
             ডিপার্টমেন্টাল অ্যাকশন প্ল্যান
          </h2>
          <p className="text-slate-500 mt-2">পদ ও দায়িত্ব অনুযায়ী আপনার প্রতিষ্ঠানের করণীয় তালিকা</p>
        </div>

        <div className="flex items-center gap-3">
           <button 
            onClick={downloadWord}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all font-bold border border-blue-100"
            title="Download Word"
          >
            <FileText className="w-5 h-5" />
            <span className="hidden sm:inline">Word</span>
          </button>
          
          <button 
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-all font-bold border border-red-100"
            title="Download PDF"
          >
            {isDownloading ? (
               <span className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
               <Download className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold border border-slate-200"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {actionPlans.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
          <p className="text-xl text-slate-400">এই রিপোর্টের জন্য অ্যাকশন প্ল্যান জেনারেট করা হয়নি। দয়া করে নতুন করে এনালাইসিস করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {actionPlans.map((dept, index) => {
            const style = getColorForDept(index);
            // Extract core styles for role sub-cards
            const roleText = style.split(' ')[1];
            
            return (
              <div key={index} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden break-inside-avoid">
                {/* Department Header */}
                <div className={`p-6 border-b border-slate-100 flex items-center gap-4 ${style}`}>
                  <div className="p-3 bg-white/60 rounded-xl backdrop-blur-sm">
                    {getIconForDept(dept.department)}
                  </div>
                  <h3 className="text-2xl font-bold">{dept.department}</h3>
                </div>

                {/* Roles Grid */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dept.roles.map((rolePlan, rIndex) => (
                    <div key={rIndex} className={`rounded-2xl p-5 border ${index % 2 === 0 ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${roleText}`}>
                        <User size={18} className="opacity-70" />
                        {rolePlan.role}
                      </h4>
                      <ul className="space-y-3">
                        {rolePlan.tasks.map((task, tIndex) => (
                          <li key={tIndex} className="flex items-start gap-3 group/item">
                            <div className={`mt-1.5 w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors ${roleText.replace('text-', 'border-').replace('700', '300')}`}>
                              <div className={`w-2 h-2 rounded-[1px] opacity-0 group-hover/item:opacity-100 transition-opacity ${roleText.replace('text-', 'bg-').replace('700', '400')}`}></div>
                            </div>
                            <span className="text-slate-600 leading-relaxed group-hover/item:text-slate-900 transition-colors text-base">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center text-blue-800 break-inside-avoid">
        <p className="font-medium">💡 টিপস: এই তালিকাটি প্রিন্ট করে আপনার টিমের সংশ্লিষ্ট ডিপার্টমেন্টের সাথে শেয়ার করুন এবং ডেডলাইন ঠিক করে কাজ শুরু করুন।</p>
      </div>

    </div>
  );
};
