import { motion } from 'motion/react';
import { X, User, Phone, Mail, MapPin, Briefcase, Plus, Edit2 } from 'lucide-react';
import { Customer, Job, db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import JobCard from './JobCard';

interface CustomerProfileProps {
  customer: Customer;
  onClose: () => void;
  onEditCustomer: (customer: Customer) => void;
  onAddJob: (customerName: string) => void;
  onViewJob: (job: Job) => void;
  onEditJob: (job: Job) => void;
}

export default function CustomerProfile({ 
  customer, 
  onClose, 
  onEditCustomer, 
  onAddJob,
  onViewJob,
  onEditJob 
}: CustomerProfileProps) {
  
  const customerJobs = useLiveQuery(
    () => db.jobs.where('customerName').equals(customer.name).reverse().sortBy('createdAt'),
    [customer.name]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-brand-bg w-full max-w-lg h-full sm:h-auto sm:max-h-[95vh] sm:rounded-3xl overflow-hidden flex flex-col border border-brand-border"
      >
        {/* Header Section */}
        <div className="bg-brand-sidebar p-8 border-b border-brand-border relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 text-slate-500 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-brand-bg rounded-2xl flex items-center justify-center border border-brand-border shadow-xl">
              <User className="w-10 h-10 text-amber-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-brand-text tracking-tight leading-none uppercase italic">
                {customer.name}
              </h2>
              <p className="text-[10px] text-amber-400 font-mono mt-2 tracking-widest uppercase">
                Client ID: {customer.id?.toString().padStart(4, '0')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a 
              href={customer.phone ? `tel:${customer.phone}` : '#'}
              className="space-y-1 block hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors group"
            >
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Phone className="w-3 h-3 group-hover:text-amber-500 transition-colors" /> Contact
              </p>
              <p className="text-slate-300 text-xs font-mono">{customer.phone || 'No Data'}</p>
            </a>
            <a 
              href={customer.email ? `mailto:${customer.email}` : '#'}
              className="space-y-1 block hover:bg-white/5 p-2 -m-2 rounded-lg transition-colors group text-left overflow-hidden"
            >
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3 group-hover:text-amber-500 transition-colors" /> Digital
              </p>
              <p className="text-slate-300 text-xs font-mono truncate">{customer.email || 'No Data'}</p>
            </a>
          </div>
          
          <div className="mt-4 pt-4 border-t border-brand-border/50">
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3" /> Primary Location
            </p>
            <p className="text-slate-400 text-xs italic">{customer.address || 'Location parameters not set'}</p>
          </div>

          <div className="mt-6 flex gap-3">
             <button
              onClick={() => onEditCustomer(customer)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 py-2.5 rounded-lg border border-brand-border transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
            </button>
            <button
              onClick={() => onAddJob(customer.name)}
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-lg shadow-lg shadow-amber-900/20 transition-all flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            >
              <Plus className="w-3.5 h-3.5" /> Initialize Job
            </button>
          </div>
        </div>

        {/* Job History / Center Section */}
        <div className="flex-1 overflow-y-auto p-8 bg-immersive no-scrollbar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-brand-text uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" /> Protocol History
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-brand-sidebar px-2 py-1 rounded border border-brand-border">
              {customerJobs?.length || 0} Records
            </span>
          </div>

          <div className="space-y-4">
            {!customerJobs || customerJobs.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-brand-border rounded-3xl">
                <p className="text-slate-600 text-xs uppercase font-bold tracking-tighter">No active protocols for this entity</p>
              </div>
            ) : (
              customerJobs.map(job => (
                <div key={job.id?.toString() || job.createdAt.toString()}>
                  <JobCard 
                    job={job} 
                    onEdit={onEditJob} 
                    onView={onViewJob} 
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
