import { useLiveQuery } from 'dexie-react-hooks';
import { User, Phone, Mail, MapPin, Edit2, Trash2, Plus, Search, PlusSquare } from 'lucide-react';
import { db, Customer } from '../db/db';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import CustomerForm from './CustomerForm';

interface CustomerListProps {
  onAddJob: (customerName: string) => void;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
}

export default function CustomerList({ onAddJob, onViewCustomer, onEditCustomer }: CustomerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const customers = useLiveQuery(() => db.customers.orderBy('name').toArray());

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customers, searchQuery]);

  const deleteCustomer = async (id: number) => {
    if (confirm('Permanently remove this client from system?')) {
      await db.customers.delete(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col pt-8">
      <div className="px-8 mb-8">
        <h2 className="text-3xl font-light text-brand-text tracking-tight">Client Directory</h2>
        <p className="text-[10px] text-amber-400 font-mono mt-1 tracking-widest uppercase">System Registered Entities</p>
      </div>

      <div className="px-8 mb-8">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border border-brand-border rounded-xl focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium text-brand-text shadow-inner"
          />
        </div>
      </div>

      <div className="flex-1 px-8 space-y-4 pb-24">
        {filteredCustomers.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mx-auto opacity-50">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No matches in directory</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <motion.div
              layout
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onViewCustomer(customer)}
              className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center border border-brand-border group-hover:border-blue-500/50 transition-colors">
                    <User className="w-6 h-6 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-text tracking-tight">{customer.name}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">ID: {customer.id?.toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => onAddJob(customer.name)} 
                    className="p-2 hover:bg-blue-500/20 rounded-full transition-colors text-blue-400"
                    title="Add Job for Customer"
                  >
                    <PlusSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => onEditCustomer(customer)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteCustomer(customer.id!)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-red-500/70">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-brand-border/50">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Connect</label>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Phone className="w-3 h-3 text-blue-500" /> {customer.phone}
                    </div>
                  )}
                  {customer.email && (
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <Mail className="w-3 h-3 text-blue-500" /> {customer.email}
                    </div>
                  )}
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-right block">Location</label>
                  <div className="flex items-center justify-end gap-2 text-xs text-slate-400 text-right">
                    <MapPin className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{customer.address || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
