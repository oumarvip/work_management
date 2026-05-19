import { motion } from 'motion/react';
import { X, Calendar, User, Briefcase, Hash, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Job, db } from '../db/db';
import { calculateJobStatus } from '../utils/status';
import { NotificationService } from '../services/notificationService';
import StatusBadge from './StatusBadge';
import { format, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

interface JobProfileProps {
  job: Job;
  onClose: () => void;
  onEdit: (job: Job) => void;
}

export default function JobProfile({ job, onClose, onEdit }: JobProfileProps) {
  const status = calculateJobStatus(job.collectionDate, job.statusOverride);

  const toggleStatus = async () => {
    const newOverride = job.statusOverride === 'Completed' ? undefined : 'Completed';
    await db.jobs.update(job.id!, { statusOverride: newOverride });
    if (newOverride === 'Completed') {
      NotificationService.send('Protocol Finalized', `Job for ${job.customerName} marked as COMPLETED.`);
    }
  };

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
        className="bg-brand-bg w-full max-w-lg h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl overflow-hidden flex flex-col border border-brand-border"
      >
        {/* Hero Section with Image */}
        <div className="relative h-64 flex-shrink-0 bg-brand-sidebar">
          {job.image ? (
            <img src={job.image} alt="Job" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand-card">
              <Briefcase className="w-20 h-20 text-slate-800" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-transparent to-black/20" />
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="absolute bottom-6 left-8">
            <StatusBadge status={status} className="mb-2" />
            <h2 className="text-3xl font-black text-brand-text tracking-tight leading-none">
              {job.customerName}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-3 h-3" /> Service Type
              </p>
              <p className="text-brand-text font-medium">{job.serviceType}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="w-3 h-3" /> Scheduled Date
              </p>
              <p className="text-brand-text font-medium">{format(parseISO(job.collectionDate), 'MMMM dd, yyyy')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Hash className="w-3 h-3" /> Balance Due
              </p>
              <p className="text-2xl font-black text-blue-400 font-mono tracking-tighter">
                ₦{job.balanceAmount.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Created
              </p>
              <p className="text-slate-400 text-sm">{format(job.createdAt, 'MMM dd, HH:mm')}</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-3 h-3" /> Job Description & Notes
            </p>
            <div className="bg-brand-card border border-brand-border p-5 rounded-2xl">
              <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-wrap">
                {job.description || 'No additional notes provided for this protocol.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-8 border-t border-brand-border bg-brand-sidebar flex gap-4">
          <button
            onClick={() => onEdit(job)}
            className="flex-1 bg-brand-bg hover:bg-brand-card text-brand-text font-bold py-4 rounded-xl border border-brand-border transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            Modify Entry
          </button>
          <button
            onClick={() => {
              toggleStatus();
              onClose();
            }}
            className={cn(
              "flex-1 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg",
              job.statusOverride === 'Completed' 
                ? "bg-amber-600/20 text-amber-500 border border-amber-500/30" 
                : "bg-amber-600 text-white shadow-amber-900/40"
            )}
          >
            {job.statusOverride === 'Completed' ? 'Reopen Job' : 'Complete Job'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
