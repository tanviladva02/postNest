'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Download, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Download Sample CSV Template
  const downloadSampleCsv = () => {
    const csvContent = `Title,Slug,Description,Content,Category,FeaturedImage
"Best SEO Strategies for 2026","best-seo-strategies-2026","Learn modern organic traffic growth techniques.","<h2>SEO Strategy Guide</h2><p>Focus on authentic content and authoritative publishing.</p>","Digital Marketing","https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600"
"Top Cloud Infrastructure Providers","top-cloud-infrastructure-providers","Comparing AWS, Cloudflare, and Next.js hosting.","<h2>Cloud Infrastructure</h2><p>Scalable cloud server architectures for web apps.</p>","Technology","https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600"`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'postnest_bulk_upload_sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle File Upload & Parse CSV
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMsg(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setParsedRows(results.data);
        },
        error: (err) => {
          setStatusMsg({ type: 'error', text: `Failed parsing CSV: ${err.message}` });
        },
      });
    }
  };

  // Submit Parsed Rows to Backend Bulk Import API
  const handleImportSubmit = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Bulk upload failed.');
      }

      setStatusMsg({
        type: 'success',
        text: `Successfully imported ${data.importedCount} articles as DRAFTS! You can publish them according to your plan's daily limit.`,
      });
      setFile(null);
      setParsedRows([]);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <UploadCloud className="w-6 h-6 text-indigo-400" />
            <span>Bulk Article Upload</span>
          </h1>
          <p className="text-xs text-slate-400">Import multiple articles simultaneously via CSV or Excel format.</p>
        </div>

        <button
          onClick={downloadSampleCsv}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4 text-brand-400" />
          <span>Download Sample CSV</span>
        </button>
      </div>

      {/* Rules Banner */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Import Safety Rule:</p>
          <p>
            Articles imported via Bulk Upload are saved as <span className="text-slate-100 font-semibold font-mono">DRAFTS</span>. Bulk upload does not bypass daily publishing limits — you can publish up to your plan's daily limit each day.
          </p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* File Dropzone */}
      <div className="glass-panel p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-brand-500/50 text-center space-y-4 transition-colors">
        <FileSpreadsheet className="w-12 h-12 text-indigo-400 mx-auto" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Select a CSV file to upload</p>
          <p className="text-xs text-slate-400">Supported formats: .csv, .json (max 100 rows per batch)</p>
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
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs cursor-pointer shadow-lg transition-colors"
        >
          Browse File
        </label>

        {file && <p className="text-xs text-emerald-400 font-mono pt-2">Selected: {file.name} ({parsedRows.length} rows parsed)</p>}
      </div>

      {/* Parsed Rows Preview */}
      {parsedRows.length > 0 && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Preview Parsed Articles ({parsedRows.length})</h3>
            <button
              onClick={handleImportSubmit}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg disabled:opacity-50"
            >
              <span>{loading ? 'Importing...' : 'Save All as Drafts'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 uppercase font-mono">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Slug</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {parsedRows.slice(0, 10).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="p-3 font-medium text-slate-200 truncate max-w-xs">{row.Title || row.title}</td>
                    <td className="p-3 text-slate-400">{row.Category || row.category || 'Technology'}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">{row.Slug || row.slug}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
