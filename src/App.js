import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { api } from './api';
import WelcomePage from './components/WelcomePage';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [userMode, setUserMode] = useState(null);
  const [isVisitorMode, setIsVisitorMode] = useState(false);
  const [prs, setPrs] = useState([]);
  const [activePR, setActivePR] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [toasts, setToasts] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [prToDelete, setPrToDelete] = useState(null);
  const [newPRForm, setNewPRForm] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    category: 'FM/Maintenance',
    assignee: 'Mohammad Amir Khan',
    dueDate: '',
  });

  const templates = [
    { id: 'T1', title: 'Office Furniture', description: 'Chairs, desks, and other office furniture', category: 'FM/Maintenance', priority: 'medium' },
    { id: 'T2', title: 'Construction Materials', description: 'Cement, steel, bricks for construction', category: 'Remote Areas', priority: 'high' },
    { id: 'T3', title: 'Office Supplies', description: 'Pens, paper, stationery items', category: 'Others', priority: 'low' },
    { id: 'T4', title: 'Property Maintenance', description: 'Tools and materials for property upkeep', category: 'FM/Maintenance', priority: 'medium' },
    { id: 'T5', title: 'IT Equipment', description: 'Computers, printers, networking gear', category: 'IT', priority: 'high' },
  ];

useEffect(() => {
  if (userMode === 'user') {
    loadPRs();
    loadActivities();
    addToast(`Welcome back, Mohammad Amir Khan!`, 'info');
  } else if (userMode === 'visitor') {
    setPrs(SAMPLE_PRS);
    addToast(' Viewing in DEMO MODE - No changes will be saved', 'info');
  }
}, [userMode]);
const getInitialSteps = () => [
    { id: 1, name: 'Request Prepared', description: 'Draft PR details', completed: false, completedAt: null },
    { id: 2, name: 'HOD Approval', description: 'Department head approval', completed: false, completedAt: null },
    { id: 3, name: 'Purchase Approval', description: 'Purchase department review', completed: false, completedAt: null },
    { id: 4, name: 'RFQ Generated', description: 'Request for Quotation created', completed: false, completedAt: null },
    { id: 5, name: 'Supplier Extracted', description: 'Supplier list prepared', completed: false, completedAt: null },
    { id: 6, name: 'RFQs Sent', description: 'RFQs sent to suppliers', completed: false, completedAt: null },
    { id: 7, name: 'Quotations Received', description: 'Supplier quotations collected', completed: false, completedAt: null },
    { id: 8, name: 'Quotations Analysis', description: 'Analyze and compare quotations', completed: false, completedAt: null },
    { id: 9, name: 'Comparison Approved', description: 'Comparison approved by HOD', completed: false, completedAt: null },
    { id: 10, name: 'Approved to Order', description: 'Order approved by higher authorities', completed: false, completedAt: null },
    { id: 11, name: 'PO Created', description: 'Purchase Order issued', completed: false, completedAt: null },
    { id: 12, name: 'Delivery Received', description: 'Items received from supplier', completed: false, completedAt: null },
    { id: 13, name: 'GRN Created', description: 'Goods Receipt Note created', completed: false, completedAt: null },
  ];

const SAMPLE_PRS = [
    {
      id: 'SAMPLE-001',
      title: 'Office Furniture Setup',
      description: 'Arrange new desks and chairs for the office space',
      priority: 'high',
      category: 'Consultancy',
      dueDate: '2025-01-15',
      status: 'in-progress',
      createdAt: new Date('2025-01-01'),
      assignee: 'Mohammad Amir Khan',
      steps: getInitialSteps().map((step, idx) => ({
        ...step,
        completed: idx < 8,
        completedAt: idx < 8 ? new Date(Date.now() - (8-idx) * 86400000) : null
      }))
    },
    {
      id: 'SAMPLE-002',
      title: 'IT Equipment Upgrade',
      description: 'Replace old computers and set up new workstations',
      priority: 'medium',
      category: 'IT',
      dueDate: '2025-01-20',
      status: 'in-progress',
      createdAt: new Date('2025-01-03'),
      assignee: 'Mohammad Amir Khan',
      steps: getInitialSteps().map((step, idx) => ({
        ...step,
        completed: idx < 4,
        completedAt: idx < 4 ? new Date(Date.now() - (4-idx) * 86400000) : null
      }))
    },
    {
      id: 'SAMPLE-003',
      title: 'Property Maintenance',
      description: 'Regular maintenance and repairs for the building',
      priority: 'low',
      category: 'Real Estate',
      dueDate: '2025-02-01',
      status: 'completed',
      createdAt: new Date('2024-12-20'),
      assignee: 'Mohammad Amir Khan',
      steps: getInitialSteps().map(step => ({
        ...step,
        completed: true,
        completedAt: new Date(Date.now() - Math.random() * 10 * 86400000)
      }))
    }
  ];

const loadPRs = async () => {
  if (isVisitorMode) {
    setPrs(SAMPLE_PRS);
    return;
  }
  
  try {
    const response = await api.getAllPRs();
    if (response.success) {
      setPrs(response.data);
    }
  } catch (error) {
    console.error('Error loading PRs:', error);
    addToast('Connected in offline mode', 'info');
    const samplePRs = [
      {
        id: 'PR-001',
        title: 'Office Chairs Purchase',
        description: 'Procurement of 20 ergonomic chairs for new office',
        createdAt: new Date(),
        status: 'in-progress',
        steps: getInitialSteps(),
        priority: 'medium',
        assignee: 'Mohammad Amir Khan',
        dueDate: new Date(Date.now() + 86400000 * 7),
        category: 'Consultancy',
      },
      {
        id: 'PR-002',
        title: 'Construction Cement Order',
        description: '100 bags of cement for downtown project',
        createdAt: new Date(Date.now() - 86400000),
        status: 'completed',
        steps: getInitialSteps().map(step => ({ ...step, completed: true })),
        priority: 'high',
        assignee: 'Mohammad Amir Khan',
        dueDate: new Date(Date.now() + 86400000 * 5),
        category: 'Real Estate',
      },
    ];
    setPrs(samplePRs);
  }
};

const loadActivities = async () => {
  try {
    const response = await api.getAllActivities(1000, 1); // Get up to 1000 activities for client-side pagination
    if (response.success) {
      setActivityLog(response.data);
    }
  } catch (error) {
    console.error('Error loading activities:', error);
  }
};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'n' && !showCreateModal && !showTemplates) {
        setShowCreateModal(true);
        addToast('Opening new PR form (Ctrl+N)', 'info');
      }
      if (e.ctrlKey && e.key === 't' && !showCreateModal && !showTemplates) {
        setShowTemplates(true);
        addToast('Opening templates (Ctrl+T)', 'info');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal, showTemplates]);

  

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', '');
  };

  const addToast = (message, type = 'info') => {
    const toast = { id: Date.now(), message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 4000);
  };

  const addActivity = (action, details) => {
    setActivityLog(prev => [
      { id: Date.now(), action, details, timestamp: new Date() },
      ...prev,
    ].slice(0, 50)); 
  };

  const handleEnter = (mode) => {
    setUserMode(mode);
    setIsVisitorMode(mode === 'visitor');
  };
  const handleLogout = () => {
    setUserMode(null);
    setIsVisitorMode(false);
    setPrs([]);
    setActivityLog([]);
    setActivePR(null);
  };

  const createPR = async (newPR) => {
  if (isVisitorMode) {
    addToast('⚠️ Demo mode: Changes are not saved', 'warning');
    const demoPR = {
      ...newPR,
      id: `DEMO-${Date.now()}`,
      status: 'in-progress',
      createdAt: new Date(),
      steps: getInitialSteps()
    };
    setPrs(prev => [demoPR, ...prev]);
    setShowCreateModal(false);
    return;
  }
  try {
    const response = await api.createPR(newPR);
    if (response.success) {
      setPrs(prev => [...prev, response.data]);
      setShowCreateModal(false);
      addToast(`PR ${newPR.id} created successfully`, 'success');
      loadActivities();
      setNewPRForm({
        id: '',
        title: '',
        description: '',
        priority: 'medium',
        category: 'FM/Maintenance',
        assignee: 'Mohammad Amir Khan',
        dueDate: '',
      });
    } else {
      addToast(response.message || 'Failed to create PR', 'error');
    }
  } catch (error) {
    console.error('Error creating PR:', error);
    addToast('Failed to create PR - check backend connection', 'error');
  }
  };

  const updatePR = async (prId, updates) => {
   if (isVisitorMode) {
    addToast('⚠️ Demo mode: Changes are not saved', 'warning');
    setPrs(prev => prev.map(pr => pr.id === prId ? { ...pr, ...updates } : pr));
    if (activePR?.id === prId) {
      setActivePR({ ...activePR, ...updates });
    }
    return;
  }
    try {
    const response = await api.updatePR(prId, updates);
    if (response.success) {
      setPrs(prev => prev.map(pr => pr.id === prId ? response.data : pr));
      if (activePR?.id === prId) {
        setActivePR(response.data);
      }
      addToast(`PR ${prId} updated successfully`, 'success');
      loadActivities();
    } else {
      addToast(response.message || 'Failed to update PR', 'error');
    }
  } catch (error) {
    console.error('Error updating PR:', error);
    addToast('Failed to update PR - check backend connection', 'error');
  }
  };

  const confirmDeletePR = (prId) => {
    setPrToDelete(prId);
    setShowDeleteConfirm(true);
  };

  const deletePR = async () => {
  if (!prToDelete) return;
  if (isVisitorMode) {
    addToast('⚠️ Demo mode: Cannot delete in demo mode', 'warning');
    setShowDeleteConfirm(false);
    return;
  }
  try {
    const response = await api.deletePR(prToDelete);
    if (response.success) {
      setPrs(prev => prev.filter(pr => pr.id !== prToDelete));
      addToast(`PR ${prToDelete} deleted`, 'warning');
      loadActivities();
      
      if (activePR?.id === prToDelete) {
        setActivePR(null);
      }
      
      setPrToDelete(null);
      setShowDeleteConfirm(false);
    } else {
      addToast(response.message || 'Failed to delete PR', 'error');
    }
  } catch (error) {
    console.error('Error deleting PR:', error);
    addToast('Failed to delete PR - check backend connection', 'error');
  }
};  

  const updateStep = async (prId, stepId, updates) => {
    if (isVisitorMode) {
      addToast('⚠️ Demo mode: Changes are not saved', 'warning');
      setPrs(prev => prev.map(pr => {
        if (pr.id !== prId) return pr;
        
        const currentStepIndex = pr.steps.findIndex(s => s.id === stepId);
        const prevSteps = pr.steps.slice(0, currentStepIndex);
        const allPrevCompleted = prevSteps.every(s => s.completed);
        
        if (!allPrevCompleted && updates.completed) {
          addToast(`Complete previous steps first`, 'warning');
          return pr;
        }
    
        const updatedSteps = pr.steps.map(step => {
          if (step.id !== stepId) return step;
          return { 
            ...step, 
            ...updates,
            completedAt: updates.completed ? new Date() : null
          };
        });
    
        const allCompleted = updatedSteps.every(s => s.completed);
        
        if (updates.completed && !pr.steps.find(s => s.id === stepId).completed) {
          const stepName = pr.steps.find(s => s.id === stepId).name;
          addActivity('Completed Step', `PR ${pr.id}: ${stepName}`);
        }
    
        return {
          ...pr,
          steps: updatedSteps,
          status: allCompleted ? 'completed' : 'in-progress',
        };
      }));
      
      if (updates.completed) {
        addToast(`Step ${stepId} completed`, 'success');
      }
      return;
    }

    try {
      const response = await api.updatePRStep(prId, stepId, updates);
      if (response.success) {
        setPrs(prev => prev.map(pr => pr.id === prId ? response.data : pr));
        if (activePR?.id === prId) {
          setActivePR(response.data);
        }
        
        if (updates.completed) {
          const stepName = response.data.steps.find(s => s.id === stepId).name;
          addToast(`Step completed: ${stepName}`, 'success');
        }
        
        loadActivities();
      } else {
        addToast(response.message || 'Failed to update step', 'error');
      }
    } catch (error) {
      console.error('Error updating step:', error);
      addToast('Failed to update step - check backend connection', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getProgress = (steps) => {
    const completed = steps.filter(s => s.completed).length;
    return Math.round((completed / steps.length) * 100);
  };

  const getStepDuration = (steps) => {
    const durations = [];
    let prevDate = new Date(steps[0].completedAt || new Date());
    
    steps.forEach((step, index) => {
      if (step.completedAt) {
        const currentDate = new Date(step.completedAt);
        if (index > 0 && steps[index-1].completedAt) {
          const prevStepDate = new Date(steps[index-1].completedAt);
          durations.push({
            step: step.id,
            name: step.name,
            duration: (currentDate - prevStepDate) / (1000 * 60 * 60)//hoursss
          });
        }
        prevDate = currentDate;
      }
    });
    
    return durations;
  };

  const getPerformanceChartData = (pr) => {
    const durations = getStepDuration(pr.steps);
    
    return {
      labels: durations.map(d => `Step ${d.step}: ${d.name}`),
      datasets: [
        {
          label: 'Time Taken (hours)',
          data: durations.map(d => d.duration),
          backgroundColor: 'rgba(139, 115, 85, 0.7)',
          borderColor: 'rgba(139, 115, 85, 1)',
          borderWidth: 1,
        }
      ]
    };
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'Category', 'Created At', 'Due Date', 'Progress'];
    const rows = prs.map(pr => [
      pr.id,
      pr.title,
      pr.description,
      pr.status,
      pr.priority,
      pr.category,
      formatDate(pr.createdAt),
      pr.dueDate ? formatDate(pr.dueDate) : '',
      `${getProgress(pr.steps)}%`,
    ]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(row => 
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PR_Export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('PRs exported to CSV', 'success');
  };

  const filteredPRs = prs.filter(pr => {
  const matchesSearch = pr.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pr.category.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesStatus = filter === 'all' || pr.status === filter;
  const matchesDepartment = departmentFilter === 'all' || pr.category === departmentFilter;
  return matchesSearch && matchesStatus && matchesDepartment;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    }
    return new Date(b[sortBy]) - new Date(a[sortBy]);
  });

   if (!userMode) {
    return <WelcomePage onEnter={handleEnter} />;
  }

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              className={`toast toast-${toast.type}`}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      
      <div className="app-content">
        
        <header className="app-header">
          <div>
            <h1 className="app-title">PR Flow Manager</h1>
            <p className="app-subtitle">
              Personalized for Mohammad Amir Khan
              {isVisitorMode && <span className="demo-badge-inline"> • DEMO MODE</span>}
            </p>
          </div>
          <div className="header-controls">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="export-button"
            >
              🚪 Logout
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className="theme-toggle"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTemplates(true)}
              className="template-button"
            >
              📋 Templates
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="new-pr-button"
            >
              + New PR
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="export-button"
            >
              📥 Export
            </motion.button>
          </div>
        </header>

        <div className="filters-container">
          <div className="filter-group">
            <label htmlFor="search" className="filter-label">Search</label>
            <input
              id="search"
              type="text"
              placeholder="Search PRs by ID, title, or category..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="filter" className="filter-label">Status</label>
            <select
              id="filter"
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All PRs</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="filter-group">
          <label htmlFor="department" className="filter-label">Department</label>
          <select
            id="department"
            className="filter-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="FM/Maintenance">FM/Maintenance</option>
            <option value="Remote Areas">Remote Areas</option>
            <option value="Marketing">Marketing</option>
            <option value="Leasing">Leasing</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Consultancy">Consultancy</option>
            <option value="Others">Others</option>
          </select>
          </div>
          <div className="filter-group">
            <label htmlFor="sort" className="filter-label">Sort By</label>
            <select
              id="sort"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Created Date</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
          <div className="filter-group">
            <span className="results-count">
              Showing {filteredPRs.length} PR{filteredPRs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {activePR ? (
          <PRDetailView
            pr={activePR}
            onBack={() => setActivePR(null)}
            onUpdateStep={updateStep}
            onDeletePR={confirmDeletePR}
            onUpdatePR={updatePR}
            darkMode={darkMode}
            formatDate={formatDate}
            addToast={addToast}
            getPerformanceChartData={getPerformanceChartData}
          />
        ) : (
          <motion.div
            className="pr-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredPRs.length > 0 ? (
              filteredPRs.map((pr, index) => (
                <PRCard
                  key={pr.id}
                  pr={pr}
                  onClick={() => setActivePR(pr)}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                  getProgress={getProgress}
                  index={index}
                />
              ))
            ) : (
              <div className="empty-state">
                <motion.div
                  className="empty-state-icon"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                <h3 className="empty-state-title">No PRs found</h3>
                <p className="empty-state-message">
                  {searchTerm ? 'Try a different search term' : 'Create your first PR to get started'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="empty-state-button"
                >
                  Create New PR
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Alerts Section */}
        <AlertsSection prs={filteredPRs} formatDate={formatDate} />

        <ActivityLog activities={activityLog} formatDate={formatDate} />

        <AnimatePresence>
          {showCreateModal && (
            <CreatePRModal
              onClose={() => setShowCreateModal(false)}
              onCreate={createPR}
              darkMode={darkMode}
              formData={newPRForm}
              setFormData={setNewPRForm}
            />
          )}
          {showTemplates && (
            <TemplateModal
              templates={templates}
              onClose={() => setShowTemplates(false)}
              onSelect={(template) => {
                setShowTemplates(false);
                setShowCreateModal(true);
                setNewPRForm({
                  ...newPRForm,
                  title: template.title,
                  description: template.description,
                  priority: template.priority,
                  category: template.category,
                });
              }}
              darkMode={darkMode}
            />
          )}
          {showDeleteConfirm && (
            <ConfirmationModal
              message={`Are you sure you want to delete PR ${prToDelete}? This action cannot be undone.`}
              onConfirm={deletePR}
              onCancel={() => setShowDeleteConfirm(false)}
              darkMode={darkMode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const PRCard = ({ pr, onClick, getStatusColor, getPriorityColor, getProgress, index }) => {
  const now = new Date();
  const dueDate = pr.dueDate ? new Date(pr.dueDate) : null;
  const isOverdue = dueDate && dueDate < now && pr.status !== 'completed';
  const isDueSoon = dueDate && dueDate >= now && dueDate <= new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)) && pr.status !== 'completed';
  
  let cardClass = 'pr-card';
  if (isOverdue) cardClass += ' overdue';
  else if (isDueSoon) cardClass += ' due-soon';

  return (
    <motion.div
      className={cardClass}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' }}
    >
      <div className="pr-card-content">
        <div className="pr-card-header">
          <h3 className="pr-id">{pr.id}</h3>
          <div className="pr-card-badges">
            {isOverdue && (
              <span className="overdue-badge">
                ⚠️ Overdue
              </span>
            )}
            {isDueSoon && (
              <span className="due-soon-badge">
                ⏰ Due Soon
              </span>
            )}
            <span className={`status-badge ${getStatusColor(pr.status)}`}>
              {pr.status === 'in-progress' ? 'In Progress' : 'Completed'}
            </span>
          </div>
        </div>
      <h4 className="pr-title">{pr.title}</h4>
      <p className="pr-description">{pr.description}</p>
      <div className="pr-meta">
        <span className={`priority-badge ${getPriorityColor(pr.priority)}`}>
          {pr.priority.charAt(0).toUpperCase() + pr.priority.slice(1)}
        </span>
        <span className="pr-date">{new Date(pr.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="pr-progress">
        <div className="progress-labels">
          <span>Progress</span>
          <span>{getProgress(pr.steps)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${getProgress(pr.steps)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
      <div className="pr-category">{pr.category}</div>
    </div>
  </motion.div>
  );
};

const PRDetailView = ({ 
  pr, 
  onBack, 
  onUpdateStep, 
  onDeletePR, 
  onUpdatePR, 
  darkMode, 
  formatDate, 
  addToast,
  getPerformanceChartData 
}) => {
  const [activeStep, setActiveStep] = useState(null);
  const [comment, setComment] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: pr.id,
    title: pr.title,
    description: pr.description,
    priority: pr.priority,
    category: pr.category,
    dueDate: pr.dueDate ? new Date(pr.dueDate).toISOString().split('T')[0] : '',
  });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleStepClick = (step) => {
    const currentStepIndex = pr.steps.findIndex(s => s.id === step.id);
    const prevSteps = pr.steps.slice(0, currentStepIndex);
    const allPrevCompleted = prevSteps.every(s => s.completed);
    
    if (!allPrevCompleted && !step.completed) {
      const lastIncompleteStep = prevSteps.find(s => !s.completed);
      setActiveStep(lastIncompleteStep || step);
      addToast(`Complete step ${lastIncompleteStep?.id || step.id} first`, 'warning');
      return;
    }
    
    setActiveStep(step);
    setComment(step.comment || '');
  };

  const handleSaveStep = () => {
    if (!activeStep) return;
    onUpdateStep(pr.id, activeStep.id, {
      completed: !activeStep.completed,
      comment,
    });
    setActiveStep(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const dueDate = editForm.dueDate ? new Date(editForm.dueDate) : null;
    
    if (dueDate && dueDate < new Date()) {
      addToast('Due date must be in the future', 'warning');
      return;
    }
    
    onUpdatePR(pr.id, {
      title: editForm.title,
      description: editForm.description,
      priority: editForm.priority,
      category: editForm.category,
      dueDate,
    });
    setShowEditModal(false);
  };

  const performanceChartData = getPerformanceChartData(pr);

  return (
    <motion.div
      className="pr-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`floating-action-bar ${isScrolled ? 'visible' : ''}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="floating-back-button"
        >
          ← Back
        </motion.button>
        <div className="floating-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEditModal(true)}
            className="floating-edit-button"
          >
            Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDeletePR(pr.id)}
            className="floating-delete-button"
          >
            Delete
          </motion.button>
        </div>
      </div>

      <div className={`detail-header ${isScrolled ? 'scrolled' : ''}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="back-button"
        >
          ← Back to PRs
        </motion.button>
        <div className="detail-title-container">
          <div>
            <h2 className="detail-id">{pr.id}</h2>
            <h3 className="detail-title">{pr.title}</h3>
          </div>
          <div className="detail-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="edit-button"
            >
              Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeletePR(pr.id)}
              className="delete-button"
            >
              Delete
            </motion.button>
            <span className={`detail-status ${pr.status === 'in-progress' ? 'status-in-progress' : 'status-completed'}`}>
              {pr.status === 'in-progress' ? 'In Progress' : 'Completed'}
            </span>
          </div>
        </div>
        <p className="detail-description">{pr.description}</p>
        <div className="detail-tags">
          <span className="detail-tag">Created: {formatDate(pr.createdAt)}</span>
          <span className="detail-tag">Priority: {pr.priority.charAt(0).toUpperCase() + pr.priority.slice(1)}</span>
          <span className="detail-tag">Category: {pr.category}</span>
          {pr.dueDate && (
            <span className="detail-tag">Due: {formatDate(pr.dueDate)}</span>
          )}
        </div>
      </div>

      <div className="progress-summary">
        <div className="progress-header">
          <h4 className="progress-title">Progress Timeline</h4>
          <span className="progress-count">
            {pr.steps.filter(s => s.completed).length} of {pr.steps.length} steps completed
          </span>
        </div>
        <div className="timeline">
          {pr.steps.map((step, index) => {
            const isCompleted = step.completed;
            const isNextToComplete = !isCompleted && 
              (index === 0 || pr.steps[index-1].completed) &&
              pr.steps.slice(0, index).every(s => s.completed);
            
            return (
              <motion.div
                key={step.id}
                className={`timeline-step ${isCompleted ? 'completed' : ''} ${isNextToComplete ? 'next-to-complete' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleStepClick(step)}
              >
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <span>{step.name}</span>
                  {isCompleted && step.completedAt && (
                    <span className="timeline-date">{formatDate(step.completedAt)}</span>
                  )}
                </div>
                {isCompleted && (
                  <motion.div 
                    className="timeline-connector"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {pr.status === 'completed' && performanceChartData.labels.length > 0 && (
        <div className="performance-analysis">
          <h4 className="analysis-title">Performance Analysis</h4>
          <div className="chart-container">
            <Bar
              data={performanceChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Time Taken Between Steps (hours)',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Hours',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      <div className="steps-container">
        <h4 className="steps-title">Process Steps</h4>
        <div className="steps-list">
          <AnimatePresence>
            {pr.steps.map((step, index) => (
              <motion.div
                key={step.id}
                className={`step-card ${step.completed ? 'step-completed' : ''} ${activeStep?.id === step.id ? 'step-active' : ''}`}
                onClick={() => handleStepClick(step)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="step-content">
                  <div className={`step-icon ${step.completed ? 'icon-completed' : ''}`}>
                    {step.completed ? '✓' : step.id}
                  </div>
                  <div className="step-info">
                    <h5 className="step-name">{step.name}</h5>
                    <p className="step-description">{step.description}</p>
                    {step.comment && (
                      <div className="step-comment">
                        <span className="comment-label">Comment:</span> {step.comment}
                      </div>
                    )}
                  </div>
                  <div className="step-status">
                    <span className={step.completed ? 'status-completed-badge' : 'status-pending-badge'}>
                      {step.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {activeStep && (
          <motion.div
            className="step-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setActiveStep(null)}
          >
            <motion.div
              className="step-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3 className="modal-title">Step {activeStep.id}: {activeStep.name}</h3>
                <button onClick={() => setActiveStep(null)} className="modal-close">×</button>
              </div>
              <p className="modal-description">{activeStep.description}</p>
              <div className="modal-form-group">
                <label htmlFor="comment" className="modal-label">Add Comment</label>
                <textarea
                  id="comment"
                  rows={3}
                  className="modal-textarea"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter any notes about this step..."
                />
              </div>
              <div className="modal-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveStep(null)}
                  className="modal-button secondary"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveStep}
                  className="modal-button primary"
                >
                  {activeStep.completed ? 'Update' : 'Mark as Complete'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEditModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="create-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <h3 className="modal-title">Edit PR: {pr.id}</h3>
                <button onClick={() => setShowEditModal(false)} className="modal-close">×</button>
              </div>
              <form onSubmit={handleEditSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="edit-title" className="form-label">Title *</label>
                  <input
                    type="text"
                    id="edit-title"
                    name="title"
                    className="form-input"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    required
                    placeholder="Brief title for the PR"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-description" className="form-label">Description</label>
                  <textarea
                    id="edit-description"
                    name="description"
                    rows={3}
                    className="form-textarea"
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Detailed description of the purchase request"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-priority" className="form-label">Priority</label>
                  <select
                    id="edit-priority"
                    name="priority"
                    className="form-select"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({...editForm, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-category" className="form-label">Department</label>
                  <select
                    id="edit-category"
                    name="category"
                    className="form-select"
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  >
                    <option value="FM/Maintenance">FM/Maintenance</option>
                    <option value="Remote Areas">Remote Areas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Leasing">Leasing</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Consultancy">Consultancy</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-dueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    id="edit-dueDate"
                    name="dueDate"
                    className="form-input"
                    value={editForm.dueDate}
                    onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-actions">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="form-button secondary"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="form-button primary"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CreatePRModal = ({ onClose, onCreate, darkMode, formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.id || !formData.title) return;
    
    const dueDate = formData.dueDate ? new Date(formData.dueDate) : null;
    if (dueDate && dueDate < new Date()) {
      return;
    }
    
    onCreate(formData);
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="create-modal"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h3 className="modal-title">Create New PR</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="id" className="form-label">PR ID *</label>
            <input
              type="text"
              id="id"
              name="id"
              className="form-input"
              value={formData.id}
              onChange={handleChange}
              required
              placeholder="Enter PR ID (e.g., PR-001)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief title for the PR"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="form-textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the purchase request"
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority" className="form-label">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-select"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="category" className="form-label">Department</label>
            <select
              id="category"
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="FM/Maintenance">FM/Maintenance</option>
              <option value="Remote Areas">Remote Areas</option>
              <option value="Marketing">Marketing</option>
              <option value="Leasing">Leasing</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Consultancy">Consultancy</option>
              <option value="Others">Others</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              className="form-input"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="form-button secondary"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="form-button primary"
            >
              Create PR
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const TemplateModal = ({ templates, onClose, onSelect, darkMode }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="create-modal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-header">
        <h3 className="modal-title">Select PR Template</h3>
        <button onClick={onClose} className="modal-close">×</button>
      </div>
      <div className="template-list">
        {templates.map(template => (
          <motion.div
            key={template.id}
            className="template-card"
            onClick={() => onSelect(template)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="template-title">{template.title}</h4>
            <p className="template-description">{template.description}</p>
            <div className="template-footer">
              <span className="template-category">{template.category}</span>
              <span className={`template-priority ${template.priority}`}>
                {template.priority.charAt(0).toUpperCase() + template.priority.slice(1)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);

const ConfirmationModal = ({ message, onConfirm, onCancel, darkMode }) => (
  <motion.div
    className="modal-overlay"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="confirm-modal"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-header">
        <h3 className="modal-title">Confirm Deletion</h3>
        <button onClick={onCancel} className="modal-close">×</button>
      </div>
      <div className="modal-body">
        <p>{message}</p>
      </div>
      <div className="modal-actions">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="modal-button secondary"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onConfirm}
          className="modal-button danger"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);

const ActivityLog = ({ activities, formatDate }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const activitiesPerPage = 10;
  
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const startIndex = (currentPage - 1) * activitiesPerPage;
  const endIndex = startIndex + activitiesPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="activity-log">
      <div 
        className="activity-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="activity-title">
          📋 Activity Log ({activities.length} total)
        </h4>
        <motion.div
          className="activity-toggle"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="activity-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="activity-list">
              {currentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  className="activity-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <span className="activity-action">{activity.action}</span>
                  <span className="activity-details">{activity.details}</span>
                  <span className="activity-timestamp">{formatDate(activity.timestamp)}</span>
                </motion.div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="activity-pagination">
                <div className="pagination-info">
                  Showing {startIndex + 1}-{Math.min(endIndex, activities.length)} of {activities.length} activities
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn" 
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div className="pagination-numbers">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button 
                    className="pagination-btn" 
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AlertsSection = ({ prs, formatDate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));
  
  const overduePRs = prs.filter(pr => 
    pr.dueDate && 
    new Date(pr.dueDate) < now && 
    pr.status !== 'completed'
  );
  
  const dueSoonPRs = prs.filter(pr => 
    pr.dueDate && 
    new Date(pr.dueDate) >= now && 
    new Date(pr.dueDate) <= threeDaysFromNow && 
    pr.status !== 'completed'
  );

  const totalAlerts = overduePRs.length + dueSoonPRs.length;

  if (totalAlerts === 0) {
    return null;
  }

  return (
    <div className="alerts-section">
      <div 
        className="alerts-header" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="alerts-title">
          🚨 Alerts & Notifications ({totalAlerts})
        </h4>
        <motion.div
          className="alerts-toggle"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="alerts-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {overduePRs.length > 0 && (
              <div className="alert-group overdue">
                <h5 className="alert-group-title">
                  <span className="alert-icon">⚠️</span>
                  Overdue PRs ({overduePRs.length})
                </h5>
                <div className="alert-list">
                  {overduePRs.map(pr => (
                    <motion.div
                      key={pr.id}
                      className="alert-item overdue-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="alert-content">
                        <span className="alert-pr-id">{pr.id}</span>
                        <span className="alert-pr-title">{pr.title}</span>
                        <span className="alert-due-date">
                          Due: {formatDate(pr.dueDate)}
                        </span>
                      </div>
                      <div className="alert-badge overdue-badge">
                        {Math.ceil((now - new Date(pr.dueDate)) / (1000 * 60 * 60 * 24))} days overdue
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {dueSoonPRs.length > 0 && (
              <div className="alert-group due-soon">
                <h5 className="alert-group-title">
                  <span className="alert-icon">⏰</span>
                  Due Soon ({dueSoonPRs.length})
                </h5>
                <div className="alert-list">
                  {dueSoonPRs.map(pr => (
                    <motion.div
                      key={pr.id}
                      className="alert-item due-soon-item"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="alert-content">
                        <span className="alert-pr-id">{pr.id}</span>
                        <span className="alert-pr-title">{pr.title}</span>
                        <span className="alert-due-date">
                          Due: {formatDate(pr.dueDate)}
                        </span>
                      </div>
                      <div className="alert-badge due-soon-badge">
                        {Math.ceil((new Date(pr.dueDate) - now) / (1000 * 60 * 60 * 24))} days left
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { App };