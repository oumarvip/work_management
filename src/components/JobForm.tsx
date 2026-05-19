import React, { useState } from 'react';
import { Camera, X, Calendar, User, Briefcase, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, Job } from '../db/db';
import { cn } from '../lib/utils';

interface JobFormProps {
  onClose: () => void;
  initialData?: Job;
  customers: string[];
}

export default function JobForm({ onClose, initialData, customers }: JobFormProps) {
  const [formData, setFormData] = useState<Partial<Job>>(
    initialData || {
      customerName: '',
      serviceType: '',
      description: '',
      balanceAmount: 0,
      collectionDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    }
  );

  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setFormData(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await db.jobs.update(initialData.id, formData);
      } else {
        await db.jobs.add(formData as Job);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save job:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
    >
      <div className="bg-brand-sidebar w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] border border-brand-border">
        <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-sidebar sticky top-0 z-10 font-bold">
          <h2 className="text-xl text-brand-text tracking-tight">
            {initialData ? 'Update Service Record' : 'Initialize New Job'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">System Asset / Photo</label>
            <div className="flex items-center justify-center w-full">
              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden group border border-brand-border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(undefined);
                        setFormData(prev => ({ ...prev, image: undefined }));
                      }}
                      className="p-3 bg-red-600 rounded-full text-white hover:scale-110 transition-transform shadow-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="w-full aspect-video border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-blue-500/50 hover:bg-white/5 transition-all group">
                  <Camera className="w-10 h-10 text-slate-700 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">Connect Video/Image Source</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" capture="environment" />
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Customer Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Client Name 
              </label>
              <input
                list="customer-list"
                type="text"
                required
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Identification required..."
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
              <datalist id="customer-list">
                {customers.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            {/* Service Type */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Service Protocol
              </label>
              <input
                type="text"
                required
                value={formData.serviceType}
                onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                placeholder="Protocol type..."
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Detailed Logs</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Log entries..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium resize-none shadow-inner"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* Balance Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-4 h-4" /> Credits
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono italic">₦</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.balanceAmount}
                    onChange={e => setFormData({ ...formData, balanceAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full pr-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text font-mono focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Collection Date */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Timestamp
                </label>
                <input
                  type="date"
                  required
                  value={formData.collectionDate}
                  onChange={e => setFormData({ ...formData, collectionDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text font-mono focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 pb-2">
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold font-mono tracking-widest shadow-lg shadow-amber-900/40 hover:bg-amber-500 active:scale-[0.98] transition-all uppercase"
            >
              {initialData ? 'Commit Changes' : 'Initialize Protocol'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
