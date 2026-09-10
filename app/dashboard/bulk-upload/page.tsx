'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Download, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMsg(null);
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setParsing(true);

    Papa.parse(selected, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data);
        setParsing(false);
      },
      error: (err) => {
        setStatusMsg({ type: 'error', text: `Failed to parse file: ${err.message}` });
        setParsing(false);
      },
    });
  };

  const handleUploadBatch = async () => {
    if (parsedRows.length === 0) return;
    setUploading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to bulk import articles.');

      setStatusMsg({
        type: 'success',
        text: `Successfully imported ${data.createdCount} articles into your Drafts!`,
      });
      setParsedRows([]);
      setFile(null);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = 'data:text/csv;charset=utf-8,title,excerpt,content,categoryName,companyName\n' +
      '"Top 10 Developer Tools in 2026","A breakdown of essential tools for modern software engineers.","<h2>Introduction</h2><p>Here are the top tools...</p>","Technology","Acme Corp"\n' +
      '"Next-Gen SEO Strategies","How modern teams rank organically on Google in 2026.","<h2>SEO Overview</h2><p>Content quality and canonical tags matter...</p>","Digital Marketing",""';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'postnest_sample_articles.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <UploadCloud className="w-6 h-6 text-orange-500" />
            <span>Bulk Article Upload</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Import multiple articles simultaneously via CSV or Excel format.</p>
        </div>

        <button
          onClick={downloadSampleCsv}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-orange-500" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Rules Banner */}
      <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">Import Safety Rule:</p>
          <p>
            Articles imported via Bulk Upload are saved as <span className="text-orange-600 dark:text-orange-400 font-semibold font-mono">DRAFTS</span>. Bulk upload does not bypass daily publishing limits — you can publish up to your plan&apos;s daily limit each day.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* File Dropzone */}
      <div className="glass-panel p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 text-center space-y-4 transition-colors bg-white dark:bg-slate-900/60">
        <FileSpreadsheet className="w-12 h-12 text-orange-500 mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">Select a CSV file to upload</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Supported formats: .csv, .json (max 100 rows per batch)</p>
        </div>

        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="hidden"
          id="csv-file-input"
        />
        <label
          htmlFor="csv-file-input"
          className="inline-block px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs cursor-pointer shadow-md shadow-orange-500/20 transition-all"
        >
          Browse Local Files
        </label>
      </div>

      {/* Preview Table if rows parsed */}
      {parsedRows.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Parsed CSV Articles ({parsedRows.length})
            </h3>
            <button
              onClick={handleUploadBatch}
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              <span>{uploading ? 'Importing...' : 'Confirm & Save All as Drafts'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Excerpt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {parsedRows.slice(0, 5).map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-200 truncate max-w-xs">{r.title || 'Untitled'}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{r.categoryName || 'General'}</td>
                    <td className="p-3 text-slate-500">{r.companyName || '-'}</td>
                    <td className="p-3 text-slate-500 truncate max-w-xs">{r.excerpt || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedRows.length > 5 && (
              <p className="text-[11px] text-slate-500 text-center pt-3">
                ...and {parsedRows.length - 5} more articles ready to import.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
