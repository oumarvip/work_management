import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { db, Customer } from '../db/db';

interface CustomerFormProps {
  onClose: () => void;
  initialData?: Customer;
}

export default function CustomerForm({ onClose, initialData }: CustomerFormProps) {
  const [formData, setFormData] = useState<Partial<Customer>>(
    initialData || {
      name: '',
      phone: '',
      email: '',
      address: '',
      createdAt: Date.now(),
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData?.id) {
        await db.customers.update(initialData.id, formData);
      } else {
        await db.customers.add(formData as Customer);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save customer:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-black/60 backdrop-blur-md"
    >
      <div className="bg-brand-sidebar w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-brand-border">
        <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-sidebar sticky top-0 z-10">
          <h2 className="text-xl font-bold text-brand-text tracking-tight">
            {initialData ? 'Update Client Profile' : 'Register New Client'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Identity string..."
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="client@network.net"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Location/Address
              </label>
              <textarea
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="Physical coordinates..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg border border-brand-border text-brand-text focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="pt-6 pb-2">
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold font-mono tracking-widest shadow-lg shadow-amber-900/40 hover:bg-amber-500 active:scale-[0.98] transition-all uppercase"
            >
              {initialData ? 'Commit System Profile' : 'Initialize Client Record'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
