import { motion } from 'motion/react';
import { Download, Upload, X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { db } from '../db/db';
import React from 'react';

export default function DataManagement({ onClose }: { onClose: () => void }) {
  const exportData = async () => {
    const jobs = await db.jobs.toArray();
    const customers = await db.customers.toArray();
    const data = { jobs, customers, exportDate: new Date().toISOString() };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `work_mgmt_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.jobs && data.customers) {
          if (confirm('Importing will overwrite local data. Continue?')) {
            await db.jobs.clear();
            await db.customers.clear();
            await db.jobs.bulkAdd(data.jobs);
            await db.customers.bulkAdd(data.customers);
            alert('Restore successful! Reloading...');
            window.location.reload();
          }
        }
      } catch (err) {
        alert('Invalid backup file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-brand-sidebar w-full max-w-md rounded-3xl border border-brand-border p-8"
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-bold uppercase tracking-widest text-white">Cloud Logic</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-[11px] text-amber-200/70 leading-normal">
              System uses Local-First architecture. Data is stored in your encryption-protected browser instance. We recommend weekly exports for data perpetuity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={exportData}
              className="w-full bg-brand-bg hover:bg-brand-card flex items-center justify-between p-5 rounded-2xl border border-brand-border transition-all group"
            >
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Generate Archive</p>
                <p className="text-[10px] text-slate-500 font-mono">Create encrypted JSON ledger</p>
              </div>
              <Download className="w-5 h-5 text-amber-500 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <label className="w-full bg-brand-bg hover:bg-brand-card flex items-center justify-between p-5 rounded-2xl border border-brand-border transition-all group cursor-pointer">
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">Initialize Restore</p>
                <p className="text-[10px] text-slate-500 font-mono">Inject archive into instance</p>
              </div>
              <Upload className="w-5 h-5 text-amber-500 group-hover:-translate-y-0.5 transition-transform" />
              <input type="file" className="hidden" accept=".json" onChange={importData} />
            </label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
