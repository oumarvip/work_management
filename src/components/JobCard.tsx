import { motion } from 'motion/react';
import { Calendar, User, MoreVertical, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Job, db } from '../db/db';
import { calculateJobStatus } from '../utils/status';
import StatusBadge from './StatusBadge';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onView: (job: Job) => void;
}

export default function JobCard({ job, onEdit, onView }: JobCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const status = calculateJobStatus(job.collectionDate, job.statusOverride);

  const toggleStatus = async () => {
    const newOverride = job.statusOverride === 'Completed' ? undefined : 'Completed';
    await db.jobs.update(job.id!, { statusOverride: newOverride });
    setShowOptions(false);
  };

  const deleteJob = async () => {
    if (confirm('Delete this job entry?')) {
      await db.jobs.delete(job.id!);
    }
  };

  const statusColorClass = status === 'Overdue' ? 'bg-red-500' : 
                         status === 'Due Today' ? 'bg-amber-500' : 
                         status === 'Upcoming' ? 'bg-emerald-500' : 'bg-blue-500';

  const glowClass = status === 'Overdue' ? 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                    status === 'Due Today' ? 'shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 
                    status === 'Upcoming' ? 'shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'shadow-[0_0_15px_rgba(59,130,246,0.5)]';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onView(job)}
      className="bg-brand-card border border-brand-border rounded-2xl p-5 shadow-lg relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 cursor-pointer active:scale-[0.98]"
    >
      {/* Visual Indicator Bar */}
      <div className={cn("absolute top-0 left-0 w-1 h-full", statusColorClass, glowClass)} />

      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 flex gap-4">
          {job.image ? (
            <img 
              src={job.image} 
              alt={job.customerName} 
              className="w-14 h-14 rounded-xl object-cover bg-brand-bg flex-shrink-0 border border-brand-border"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-brand-bg flex items-center justify-center flex-shrink-0 border border-brand-border">
              <User className="w-6 h-6 text-slate-700" />
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-text tracking-tight leading-none">{job.customerName}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-mono tracking-tighter">{job.serviceType}</p>
            <StatusBadge status={status} className="mt-2" />
          </div>
        </div>

        <div className="relative" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 top-12 w-48 bg-brand-sidebar border border-brand-border rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right backdrop-blur-md">
              <button 
                onClick={() => { onEdit(job); setShowOptions(false); }}
                className="w-full px-4 py-3 text-left text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 flex items-center gap-3 text-slate-300 border-b border-brand-border"
              >
                <Edit2 className="w-4 h-4 text-blue-400" /> Edit Entry
              </button>
              <button 
                onClick={toggleStatus}
                className="w-full px-4 py-3 text-left text-[11px] uppercase tracking-widest font-bold hover:bg-white/5 flex items-center gap-3 text-emerald-400 border-b border-brand-border"
              >
                <CheckCircle2 className="w-4 h-4" /> 
                {job.statusOverride === 'Completed' ? 'Pending' : 'Complete'}
              </button>
              <button 
                onClick={deleteJob}
                className="w-full px-4 py-3 text-left text-[11px] uppercase tracking-widest font-bold hover:bg-red-950/20 flex items-center gap-3 text-red-500"
              >
                <Trash2 className="w-4 h-4" /> Terminate
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto flex justify-between items-end">
        <div>
          <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Balance</p>
          <p className="text-2xl font-bold text-brand-text font-mono leading-none tracking-tighter">
            ₦{job.balanceAmount.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Scheduled</p>
          <p className="text-sm font-mono text-slate-300">
            {format(parseISO(job.collectionDate), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>
      
      {job.description && (
        <p className="mt-4 text-[11px] text-slate-600 italic border-l border-brand-border pl-3 line-clamp-1 py-1 bg-white/2 rounded">
          {job.description}
        </p>
      )}
    </motion.div>
  );
}
