import { useState, useMemo, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Plus, Filter, LayoutGrid, Clock, AlertCircle, CheckCircle, Users, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, Job, Customer } from '../db/db';
import JobCard from './JobCard';
import JobForm from './JobForm';
import JobProfile from './JobProfile';
import CustomerList from './CustomerList';
import CustomerProfile from './CustomerProfile';
import CustomerForm from './CustomerForm';
import ThemeToggle from './ThemeToggle';
import { NotificationService } from '../services/notificationService';
import DataManagement from './DataManagement';
import { calculateJobStatus } from '../utils/status';
import { cn } from '../lib/utils';

type ViewType = 'jobs' | 'customers';
type FilterType = 'All' | 'Pending' | 'Overdue' | 'Completed';

export default function Dashboard() {
  const [view, setView] = useState<ViewType>('jobs');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [viewingJob, setViewingJob] = useState<Job | undefined>(undefined);

  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | undefined>(undefined);

  const [isDataMgmtOpen, setIsDataMgmtOpen] = useState(false);

  const jobs = useLiveQuery(() => db.jobs.orderBy('collectionDate').toArray());
  const customers = useLiveQuery(() => db.customers.toArray());

  const stats = useMemo(() => {
    if (!jobs) return { pendingBalance: 0, activeJobs: 0 };
    return jobs.reduce((acc, job) => {
      if (job.statusOverride !== 'Completed') {
        acc.pendingBalance += job.balanceAmount;
        acc.activeJobs += 1;
      }
      return acc;
    }, { pendingBalance: 0, activeJobs: 0 });
  }, [jobs]);

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    return jobs.filter(job => {
      const matchesSearch = job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const status = calculateJobStatus(job.collectionDate, job.statusOverride);
      
      if (activeFilter === 'All') return matchesSearch;
      if (activeFilter === 'Completed') return matchesSearch && status === 'Completed';
      if (activeFilter === 'Overdue') return matchesSearch && status === 'Overdue';
      if (activeFilter === 'Pending') return matchesSearch && (status === 'Upcoming' || status === 'Due Today');
      
      return matchesSearch;
    });
  }, [jobs, searchQuery, activeFilter]);

  const customerNames = useMemo(() => {
    if (!customers) return [];
    return customers.map(c => c.name);
  }, [customers]);

  const openEditJob = (job: Job) => {
    setEditingJob(job);
    setViewingJob(undefined);
    setViewingCustomer(undefined);
    setIsFormOpen(true);
  };

  const openViewJob = (job: Job) => {
    setViewingJob(job);
    setViewingCustomer(undefined);
  };

  const openEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerFormOpen(true);
    setViewingCustomer(undefined);
  };

  const openViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
    setViewingJob(undefined);
  };

  const addJobForCustomer = (name: string) => {
    setEditingJob({
      customerName: name,
      serviceType: '',
      description: '',
      balanceAmount: 0,
      collectionDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
    setViewingCustomer(undefined);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingJob(undefined);
    setIsFormOpen(false);
  };

  const FilterButton = ({ type, icon: Icon }: { type: FilterType, icon: any }) => (
    <button
      onClick={() => setActiveFilter(type)}
      className={cn(
        "flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all border outline-none min-w-[70px]",
        activeFilter === type 
          ? "bg-brand-border text-brand-text border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-105" 
          : "bg-brand-sidebar text-slate-500 border-brand-border hover:border-slate-700"
      )}
    >
      <Icon className="w-4 h-4 mb-1" />
      <span className="text-[9px] font-bold uppercase tracking-widest">{type}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-immersive text-brand-text max-w-md mx-auto border-x-8 border-brand-border flex flex-col pb-24 shadow-2xl">
      {/* Header */}
      <header className="p-8 sticky top-0 z-30 bg-brand-sidebar/80 backdrop-blur-xl border-b border-brand-border">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-brand-text tracking-tight">Work Management</h1>
            <p className="text-[10px] text-blue-400 font-mono mt-1 tracking-widest uppercase">System Live • Offline Sync</p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setIsDataMgmtOpen(true)}
              className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95 transition-all outline-none"
            >
              <span className="text-white font-black text-xl">W</span>
            </button>
          </div>
        </div>

        {view === 'jobs' && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-brand-bg/40 border border-brand-border p-4 rounded-2xl flex flex-col justify-center">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Total Receivables</p>
              <p className="text-2xl font-black text-amber-500 font-mono tracking-tighter">₦{stats.pendingBalance.toFixed(2)}</p>
            </div>
            <div className="bg-brand-bg/40 border border-brand-border p-4 rounded-2xl flex flex-col justify-center">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Active Protocols</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-black text-brand-text font-mono tracking-tighter">{stats.activeJobs}</p>
                <p className="text-[10px] text-slate-600 font-bold mb-1 italic">Records</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex bg-brand-bg/50 p-1 rounded-xl border border-brand-border mb-6">
          <button
            onClick={() => setView('jobs')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              view === 'jobs' ? "bg-brand-border text-brand-text shadow-sm" : "text-slate-500"
            )}
          >
            <Briefcase className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" /> Service Orders
          </button>
          <button
            onClick={() => setView('customers')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
              view === 'customers' ? "bg-brand-border text-brand-text shadow-sm" : "text-slate-500"
            )}
          >
            <Users className="w-3.5 h-3.5 group-hover:text-amber-400 transition-colors" /> Client Base
          </button>
        </div>

        {view === 'jobs' && (
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-amber-400 transition-colors" />
            <input
              type="text"
              placeholder="Filter protocol records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border border-brand-border rounded-xl focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 outline-none transition-all placeholder:text-slate-700 font-medium text-brand-text shadow-inner"
            />
          </div>
        )}
      </header>

      {view === 'jobs' ? (
        <>
          {/* Filters */}
          <div className="px-6 py-4 flex justify-between gap-2 overflow-x-auto no-scrollbar bg-brand-sidebar/30 border-b border-brand-border">
            <FilterButton type="All" icon={LayoutGrid} />
            <FilterButton type="Pending" icon={Clock} />
            <FilterButton type="Overdue" icon={AlertCircle} />
            <FilterButton type="Completed" icon={CheckCircle} />
          </div>

          {/* List */}
          <main className="flex-1 px-6 pt-8 space-y-6">
            {filteredJobs.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mx-auto opacity-50">
                  <Search className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Zero protocols detected</p>
                </div>
              </div>
            ) : (
              filteredJobs.map(job => (
                <div key={job.id?.toString() || job.createdAt.toString()}>
                  <JobCard job={job} onEdit={openEditJob} onView={openViewJob} />
                </div>
              ))
            )}
          </main>

          <button
            onClick={() => setIsFormOpen(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-600 text-white p-5 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:bg-amber-500 active:scale-95 transition-all z-40 group"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </button>
        </>
      ) : (
        <>
          <CustomerList 
            onAddJob={addJobForCustomer} 
            onViewCustomer={openViewCustomer}
            onEditCustomer={openEditCustomer}
          />
          <button
            onClick={() => setIsCustomerFormOpen(true)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-amber-600 text-white p-5 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.5)] hover:bg-amber-500 active:scale-95 transition-all z-40 group"
          >
            <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </button>
        </>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <JobForm 
            onClose={closeForm} 
            initialData={editingJob} 
            customers={customerNames}
          />
        )}
        {viewingJob && (
          <JobProfile 
            job={viewingJob} 
            onClose={() => setViewingJob(undefined)} 
            onEdit={openEditJob} 
          />
        )}
        {isCustomerFormOpen && (
          <CustomerForm 
            onClose={() => { setIsCustomerFormOpen(false); setEditingCustomer(undefined); }}
            initialData={editingCustomer}
          />
        )}
        {viewingCustomer && (
          <CustomerProfile
            customer={viewingCustomer}
            onClose={() => setViewingCustomer(undefined)}
            onEditCustomer={openEditCustomer}
            onAddJob={addJobForCustomer}
            onViewJob={openViewJob}
            onEditJob={openEditJob}
          />
        )}
        {isDataMgmtOpen && <DataManagement onClose={() => setIsDataMgmtOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
