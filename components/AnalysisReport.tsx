
import React, { useRef, useState } from 'react';
import { AnalysisResult, BMCData, BMC_LABELS } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { CheckCircle, AlertTriangle, Lightbulb, Target, ArrowLeft, FileText, Printer, Download, Share2, Layers, TrendingUp, ShieldAlert, Megaphone, Quote, Rocket, CheckSquare } from 'lucide-react';

interface AnalysisReportProps {
  result: AnalysisResult;
  data: BMCData;
  onReset: () => void;
  onViewActionPlan: () => void;
}

export const AnalysisReport: React.FC<AnalysisReportProps> = ({ result, data, onReset, onViewActionPlan }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullDownloading, setIsFullDownloading] = useState(false);
  
  const scoreData = [
    { name: 'Score', value: result.overallScore },
    { name: 'Remaining', value: 100 - result.overallScore },
  ];
  
  const COLORS = ['#4f46e5', '#e2e8f0'];

  const radarData = result.segmentAnalysis.map(item => ({
    subject: item.segment,
    A: item.score,
    fullMark: 10,
  }));

  const handlePrint = () => {
    window.print();
  };

  const getInputHTML = () => {
     const orderedKeys = Object.keys(BMC_LABELS) as (keyof BMCData)[];
     return `
      <div style="margin-bottom: 40px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
        <h2 style="color: #1e293b; border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 20px;">আপনার ইনপুট (BMC Data)</h2>
        ${orderedKeys.map(key => {
          const val = data[key];
          if (!val) return '';
          return `
            <div style="margin-bottom: 15px;">
              <h3 style="color: #4f46e5; margin: 0 0 5px 0; font-size: 14pt;">${BMC_LABELS[key].label}</h3>
              <p style="margin: 0; color: #333; background-color: #f8fafc; padding: 10px; border-radius: 5px;">${val}</p>
            </div>
          `;
        }).join('')}
      </div>
     `;
  };

  const getReportHTML = () => {
    return `
      <div>
          <h2>ওভারভিউ (Overview)</h2>
          <p><strong>স্কোর:</strong> <span class="score">${result.overallScore}/100</span></p>
          <p>${result.executiveSummary}</p>
        </div>
        
        <div style="margin-top: 30px; background-color: #f0fdf4; padding: 20px; border-radius: 10px; border: 1px solid #bbf7d0;">
           <h3 style="color: #166534; margin-top:0;">ইনভেস্টর পিচ (Elevator Pitch)</h3>
           <p style="font-style: italic; font-size: 16pt;">"${result.elevatorPitch || 'N/A'}"</p>
        </div>

        <div>
          <h2>প্যারামিটার বিশ্লেষণ (Segment Analysis)</h2>
          <table>
            <thead>
              <tr>
                <th>সেগমেন্ট (Segment)</th>
                <th>ফিডব্যাক (Feedback)</th>
                <th>স্কোর (Score)</th>
              </tr>
            </thead>
            <tbody>
              ${result.segmentAnalysis.map(item => `
                <tr>
                  <td>${item.segment}</td>
                  <td>${item.feedback}</td>
                  <td>${item.score}/10</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div>
          <h2>SWOT অ্যানালাইসিস</h2>
          
          <h3>শক্তিমত্তা (Strengths)</h3>
          <ul>${result.swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>দুর্বলতা (Weaknesses)</h3>
          <ul>${result.swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>সুযোগ (Opportunities)</h3>
          <ul>${result.swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul>

          <h3>ঝুঁকি (Threats)</h3>
          <ul>${result.swot.threats.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        
        <div>
           <h2>ঝুঁকি বিশ্লেষণ ও সমাধান (Risk Matrix)</h2>
           <table>
            <thead>
              <tr>
                <th>ঝুঁকি (Risk)</th>
                <th>প্রভাব (Impact)</th>
                <th>সম্ভাবনা (Prob.)</th>
                <th>সমাধান (Mitigation)</th>
              </tr>
            </thead>
            <tbody>
              ${(result.riskAnalysis || []).map(item => `
                <tr>
                  <td>${item.risk}</td>
                  <td>${item.impact}</td>
                  <td>${item.probability}</td>
                  <td>${item.mitigation}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div>
           <h2>মার্কেটিং ও মেট্রিক্স (KPIs)</h2>
           <p><strong>ট্যাগলাইন:</strong> ${result.marketingStrategy?.tagline || 'N/A'}</p>
           <p><strong>গ্রোথ হ্যাক:</strong> ${result.marketingStrategy?.growthHack || 'N/A'}</p>
           <h3>সাফল্য পরিমাপক (KPIs):</h3>
           <ul>
             ${(result.kpis || []).map(k => `<li>${k}</li>`).join('')}
           </ul>
        </div>

        <div>
          <h2>পরামর্শ (Suggestions)</h2>
          <ul>
            ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        
        ${result.departmentalActionPlan ? `
        <div>
          <h2>অ্যাকশন প্ল্যান (Action Plan)</h2>
           ${result.departmentalActionPlan.map(d => `
              <div style="margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
                <h3 style="color: #2563eb; margin-top: 0;">${d.department}</h3>
                ${d.roles.map(r => `
                  <div style="margin-bottom: 10px;">
                    <h4 style="margin: 5px 0; color: #475569;">${r.role}</h4>
                    <ul>${r.tasks.map(t => `<li>${t}</li>`).join('')}</ul>
                  </div>
                `).join('')}
              </div>
           `).join('')}
        </div>
        ` : ''}
    `;
  };

  const downloadWord = (includeInput: boolean) => {
    const inputContent = includeInput ? getInputHTML() : '';
    const reportContent = getReportHTML();

    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>BMC Analysis Report</title>
        <style>
          body { font-family: 'Hind Siliguri', sans-serif; font-size: 14pt; }
          h1 { color: #4f46e5; font-size: 24pt; margin-bottom: 20px; text-align: center; }
          h2 { color: #333; font-size: 18pt; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          h3 { font-size: 16pt; }
          h4 { font-size: 14pt; font-weight: bold; }
          p { margin-bottom: 15px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f8fafc; color: #333; }
          .score { font-size: 28pt; font-weight: bold; color: #4f46e5; }
        </style>
      </head>
      <body>
        <h1>বিজনেজ মডেল ক্যানভাস (BMC) রিপোর্ট</h1>
        ${inputContent}
        ${reportContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = includeInput ? 'BMC_Full_Report.doc' : 'BMC_Report.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = (includeInput: boolean) => {
    if (!reportRef.current) return;
    
    if (includeInput) setIsFullDownloading(true);
    else setIsDownloading(true);

    // @ts-ignore
    if (typeof window.html2pdf === 'undefined') {
      alert("PDF library not loaded yet. Please try printing instead.");
      setIsDownloading(false);
      setIsFullDownloading(false);
      return;
    }

    // Create a container for PDF generation
    const container = document.createElement('div');
    // If we need input, prepend it
    let contentHTML = '';
    
    if (includeInput) {
       contentHTML += getInputHTML();
    }
    
    if (includeInput) {
        container.innerHTML = `
          <div style="padding: 20px; font-family: 'Hind Siliguri', sans-serif;">
            <h1 style="text-align: center; color: #4f46e5;">বিজনেস মডেল ক্যানভাস</h1>
            ${getInputHTML()}
            <div id="report-part"></div>
          </div>
        `;
        const reportClone = reportRef.current.cloneNode(true) as HTMLElement;
        container.querySelector('#report-part')?.appendChild(reportClone);
    } else {
        container.appendChild(reportRef.current.cloneNode(true));
    }

    document.body.appendChild(container); // Append to DOM to render charts/styles correctly

    const opt = {
      margin:       [10, 10, 10, 10],
      filename:     includeInput ? 'BMC_Full_Report.pdf' : 'BMC_Analysis_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // @ts-ignore
    window.html2pdf().set(opt).from(container).save().then(() => {
      setIsDownloading(false);
      setIsFullDownloading(false);
      document.body.removeChild(container);
    });
  };

  return (
    <div className="w-full max-w-[95%] mx-auto p-4 sm:p-8 space-y-10 animate-fade-in pb-24">
      
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 no-print bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">রিপোর্ট ড্যাশবোর্ড</h2>
           <p className="text-slate-500">আপনার ব্যবসার বিস্তারিত বিশ্লেষণ</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          
          {/* Action Plan Button (New) */}
          <button 
            onClick={onViewActionPlan}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all font-bold animate-pulse-slow"
          >
             <CheckSquare className="w-5 h-5" />
             অ্যাকশন প্ল্যান দেখুন
          </button>

          {/* Group 1: Report Only */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
             <span className="text-xs font-bold text-slate-400 px-2 uppercase tracking-wider hidden xl:inline">শুধু রিপোর্ট</span>
             <button 
                onClick={() => downloadWord(false)}
                className="p-2 text-blue-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                title="Word (Report Only)"
             >
                <FileText className="w-5 h-5" />
             </button>
             <button 
                onClick={() => handleDownloadPDF(false)}
                disabled={isDownloading}
                className="p-2 text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                title="PDF (Report Only)"
             >
                {isDownloading ? <span className="block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span> : <Download className="w-5 h-5" />}
             </button>
          </div>

          {/* Group 2: Full Package */}
          <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-xl border border-indigo-100">
             <span className="text-xs font-bold text-indigo-400 px-2 uppercase tracking-wider flex items-center gap-1 hidden xl:flex">
               <Layers size={14} /> ইনপুট + রিপোর্ট
             </span>
             <button 
                onClick={() => downloadWord(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-indigo-700 rounded-lg hover:bg-indigo-600 hover:text-white shadow-sm transition-all font-medium text-sm"
             >
                <FileText className="w-4 h-4" /> Word
             </button>
             <button 
                onClick={() => handleDownloadPDF(true)}
                disabled={isFullDownloading}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all font-medium text-sm"
             >
                {isFullDownloading ? (
                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                   <Download className="w-4 h-4" />
                )}
                PDF
             </button>
          </div>
          
          <button 
            onClick={handlePrint}
            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            title="Print"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Report Content Container - ID used for PDF Generation */}
      <div id="report-content" ref={reportRef} className="space-y-8 bg-white/50 p-2 md:p-4 rounded-3xl">
        
        {/* Header & Score */}
        <div className="flex flex-col xl:flex-row gap-8 items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-64 h-64 relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  innerRadius={90}
                  outerRadius={120}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                >
                  {scoreData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-slate-800 tracking-tighter">{result.overallScore}</span>
              <span className="text-sm text-slate-400 uppercase font-bold tracking-widest mt-2">Score</span>
            </div>
          </div>
          
          <div className="flex-1 text-center xl:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">এক্সিকিউটিভ সামারি</h2>
            <p className="text-slate-600 text-xl leading-relaxed">{result.executiveSummary}</p>
            
            {/* Elevator Pitch Box */}
            {result.elevatorPitch && (
              <div className="mt-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-2xl relative">
                <Quote className="absolute top-4 left-4 text-emerald-200 w-8 h-8 opacity-50" />
                <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                  <Megaphone size={18} />
                  এলিভেটর পিচ (Elevator Pitch)
                </h4>
                <p className="text-emerald-900 text-lg font-medium italic relative z-10 pl-6">
                  "{result.elevatorPitch}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Segment Radar Chart & Details */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 break-inside-avoid">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Target className="w-7 h-7 text-indigo-500" />
              প্যারামিটার বিশ্লেষণ
            </h3>
            <div className="h-[400px] w-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 14, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} />
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#4f46e5"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
             <h3 className="text-2xl font-bold text-slate-800 mb-6">বিস্তারিত মূল্যায়ন</h3>
             <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
               {result.segmentAnalysis.map((seg, idx) => (
                 <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 break-inside-avoid">
                   <div className="flex justify-between items-center mb-2">
                     <span className="font-bold text-lg text-slate-700">{seg.segment}</span>
                     <span className={`text-sm font-bold px-3 py-1 rounded-full ${seg.score >= 7 ? 'bg-green-100 text-green-700' : seg.score >= 4 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                       {seg.score}/10
                     </span>
                   </div>
                   <p className="text-base text-slate-600 leading-relaxed">{seg.feedback}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Risk Analysis Matrix (New) */}
        {result.riskAnalysis && result.riskAnalysis.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 break-inside-avoid">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <ShieldAlert className="w-7 h-7 text-red-500" />
              ঝুঁকি বিশ্লেষণ ও সমাধান (Risk Analysis)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 font-bold text-slate-600">ঝুঁকি (Risk)</th>
                    <th className="p-4 font-bold text-slate-600">প্রভাব (Impact)</th>
                    <th className="p-4 font-bold text-slate-600">সম্ভাবনা (Prob.)</th>
                    <th className="p-4 font-bold text-slate-600">সমাধান (Mitigation)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.riskAnalysis.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="p-4 font-medium text-slate-800">{item.risk}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.impact === 'High' ? 'bg-red-100 text-red-700' : item.impact === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {item.impact}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.probability === 'High' ? 'bg-red-100 text-red-700' : item.probability === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                          {item.probability}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{item.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Marketing & KPIs (New) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 break-inside-avoid">
           {/* Marketing Strategy */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Megaphone className="w-7 h-7 text-pink-500" />
                মার্কেটিং স্ট্র্যাটেজি
              </h3>
              <div className="space-y-6 flex-1">
                 {result.marketingStrategy?.tagline && (
                   <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
                     <span className="text-xs font-bold text-pink-400 uppercase tracking-wider block mb-1">Tagline</span>
                     <p className="text-xl font-bold text-pink-700">"{result.marketingStrategy.tagline}"</p>
                   </div>
                 )}
                 <div>
                   <h4 className="font-bold text-slate-700 mb-2">সেরা চ্যানেলসমূহ:</h4>
                   <div className="flex flex-wrap gap-2">
                     {(result.marketingStrategy?.topChannels || []).map((ch, i) => (
                       <span key={i} className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-sm">{ch}</span>
                     ))}
                   </div>
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-700 mb-2">গ্রোথ হ্যাক (Growth Hack):</h4>
                    <p className="text-slate-600">{result.marketingStrategy?.growthHack || 'N/A'}</p>
                 </div>
              </div>
           </div>

           {/* KPIs */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-blue-500" />
                সাফল্য পরিমাপক (KPIs)
              </h3>
              <ul className="space-y-3 flex-1">
                {(result.kpis || []).map((kpi, i) => (
                  <li key={i} className="flex items-center gap-3 bg-blue-50/50 p-3 rounded-xl border border-blue-50 text-blue-900 font-medium">
                    <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">{i + 1}</span>
                    {kpi}
                  </li>
                ))}
              </ul>
           </div>
        </div>

        {/* SWOT Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          <SwotCard title="শক্তিমত্তা (Strengths)" items={result.swot.strengths} type="strength" />
          <SwotCard title="দুর্বলতা (Weaknesses)" items={result.swot.weaknesses} type="weakness" />
          <SwotCard title="সুযোগ (Opportunities)" items={result.swot.opportunities} type="opportunity" />
          <SwotCard title="ঝুঁকি (Threats)" items={result.swot.threats} type="threat" />
        </div>

        {/* Actionable Suggestions */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-800 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 break-inside-avoid">
          <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-yellow-300" />
            উন্নতির জন্য পরামর্শ (Suggestions)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex gap-4 bg-white/10 p-5 rounded-2xl backdrop-blur-md border border-white/10">
                <span className="font-bold text-2xl text-indigo-300 opacity-50">#{index + 1}</span>
                <p className="text-lg text-indigo-50 leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center pt-8 pb-4 text-slate-400 text-sm no-print">
          Generated by BMC AI Analyst
        </div>
      </div>

       <div className="flex justify-center pt-4 no-print">
        <button
          onClick={onReset}
          className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-300 rounded-full text-slate-700 font-bold hover:bg-slate-50 hover:shadow-lg transition-all text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          নতুন পরিকল্পনা শুরু করুন
        </button>
      </div>
    </div>
  );
};

const SwotCard: React.FC<{ title: string; items: string[]; type: 'strength' | 'weakness' | 'opportunity' | 'threat' }> = ({ title, items, type }) => {
  const styles = {
    strength: { border: 'border-l-8 border-green-500', icon: <CheckCircle className="w-6 h-6 text-green-600" />, bg: 'bg-green-50/50' },
    weakness: { border: 'border-l-8 border-orange-500', icon: <AlertTriangle className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50/50' },
    opportunity: { border: 'border-l-8 border-blue-500', icon: <Lightbulb className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50/50' },
    threat: { border: 'border-l-8 border-red-500', icon: <AlertTriangle className="w-6 h-6 text-red-600" />, bg: 'bg-red-50/50' },
  };
  
  const style = styles[type];

  return (
    <div className={`bg-white p-8 rounded-3xl shadow-sm border border-slate-100 ${style.border} break-inside-avoid flex flex-col`}>
      <h4 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        {style.icon}
        {title}
      </h4>
      <ul className="space-y-4 flex-1">
        {items.map((item, i) => (
          <li key={i} className="text-lg text-slate-700 flex gap-3 items-start leading-relaxed">
            <span className="mt-2.5 w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
