  // import { useEffect, useMemo, useState } from 'react';
  // import { employeeAPI } from '../../services/api';
  // import './EmployeePortal.css';

  // const STATUS_LABELS = {
  //   PendingVerification: 'Pending',
  //   Verified: 'Verified',
  //   Rejected: 'Rejected',
  //   Submitted: 'Submitted',
  // };

  // const ACTIONABLE_STATUS = 'PendingVerification';

  // const EmptyState = ({ text }) => (
  //   <div className="ep-empty">
  //     <p>{text}</p>
  //   </div>
  // );





  // const TransactionRow = ({ txn, onVerify, onReject, onToggle, selected, mode }) => {
  //   const isActionable = txn.status === ACTIONABLE_STATUS;


  //   // // Get unique statuses of selected transactions
  //   // const selectedStatuses = useMemo(() => {
  //   //   const statuses = new Set();
  //   //   selectedIds.forEach((id) => {
  //   //     const txn = transactions.find((t) => t.id === id);
  //   //     if (txn) statuses.add(txn.status);
  //   //   });
  //   //   return statuses;
  //   // }, [selectedIds, transactions]);

  //   // // Logic for enabling/disabling buttons
  //   // const canVerify = selectedStatuses.size === 1 && selectedStatuses.has("PendingVerification");
  //   // const canSubmit = selectedStatuses.size === 1 && selectedStatuses.has("Verified");


  //   return (
      
  //     <tr className="ep-row">
  //       <td>
  //         <input
  //           type="checkbox"
  //           checked={selected}
  //           onChange={() => onToggle(txn.id)}
  //         // // disabled={!isActionable}
  //         // disabled={
  //         //   mode === 'verify'
  //         //     ? txn.status !== 'PendingVerification'
  //         //     : txn.status !== 'Verified'
  //         // }

  //         />
  //       </td>
  //       <td>{txn.reference}</td>
  //       <td>{txn.senderAccount}</td>
  //       <td>{txn.recipientAccount}</td>
  //       <td>{txn.currency} {Number(txn.amount).toFixed(2)}</td>
  //       <td>{txn.provider}</td>
  //       <td>{txn.swiftCode}</td>
  //       <td>
  //         <span className={`ep-badge ep-badge-${txn.statusLabel}`}>{txn.statusLabel}</span>
  //       </td>
  //       <td className="ep-actions">
  //         <button
  //           className="ep-btn ep-btn-verify"
  //           onClick={() => onVerify(txn.id)}
  //           disabled={!isActionable}
  //         >
  //           Verify
  //         </button>
  //         <button
  //           className="ep-btn ep-btn-reject"
  //           onClick={() => onReject(txn.id)}
  //           disabled={!isActionable}
  //         >
  //           Reject
  //         </button>
  //       </td>
  //     </tr>
  //   );
  // };

  // const normalizeTransactions = (raw) => {
  //   if (!Array.isArray(raw)) return [];
  //   return raw.map((txn) => {
  //     const id = txn.id || txn._id;
  //     const status = txn.status || 'PendingVerification';

  //     return {
  //       id,
  //       reference: txn.reference || id,
  //       senderAccount: txn.senderAccount || txn.payerName,
  //       recipientAccount: txn.recipientAccount || txn.payeeName,
  //       amount: txn.amount,
  //       currency: txn.currency,
  //       provider: txn.provider || txn.country,
  //       swiftCode: txn.swiftCode,
  //       status,
  //       statusLabel: txn.statusLabel || STATUS_LABELS[status] || status,
  //       timestamp: txn.timestamp || txn.createdAt,
  //     };
  //   });
  // };

  // export default function EmployeePortal() {


  //   //added
  //   const [mode, setMode] = useState('verify'); // 'verify' or 'submit'



  //   const [transactions, setTransactions] = useState([]);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState('');
  //   const [selectedIds, setSelectedIds] = useState([]);
  //   const [submitting, setSubmitting] = useState(false);
  //   const [rejectingId, setRejectingId] = useState(null);
  //   const [rejectReason, setRejectReason] = useState('');

    
  //       //aadded
  //   const selectedStatuses = useMemo(() => {
  //     const statuses = new Set();
  //     selectedIds.forEach((id) => {
  //       const txn = transactions.find((t) => t.id === id);
  //       if (txn) statuses.add(txn.status);
  //     });
  //     return statuses;
  //   }, [selectedIds, transactions]);

  //   const canVerify = selectedStatuses.size === 1 && selectedStatuses.has("PendingVerification");
  //   const canSubmit = selectedStatuses.size === 1 && selectedStatuses.has("Verified");

  //   // Filter states are no added
  //   const [statusFilter, setStatusFilter] = useState('');
  //   const [currencyFilter, setCurrencyFilter] = useState('');
  //   const [providerFilter, setProviderFilter] = useState('');

  //   const handleApiError = (err) => {
  //     setError(err.response?.data?.message || err.message || "An error occurred.");
  //   };

  //   // fetchTransactions now includes query params
  //   const fetchTransactions = async () => {
  //     setLoading(true);
  //     setError('');
  //     try {
  //       const params = {};
  //       if (statusFilter) params.status = statusFilter;
  //       if (currencyFilter) params.currency = currencyFilter;
  //       if (providerFilter) params.provider = providerFilter;

  //       const { data } = await employeeAPI.getTransactions(params);
  //       const payload = Array.isArray(data?.transactions) ? data.transactions : data;
  //       setTransactions(normalizeTransactions(payload));
  //     } catch (err) {
  //       handleApiError(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchTransactions();
  //   }, [statusFilter, currencyFilter, providerFilter]);

  //   // const actionableIds = useMemo(
  //   //   () => transactions.filter((txn) => txn.status === ACTIONABLE_STATUS).map((txn) => txn.id),
  //   //   [transactions]
  //   // );

  //   //so that both pending and verirified transcations cna be selected

  //   const pendingIds = useMemo(
  //     () => transactions.filter((txn) => txn.status === 'PendingVerification').map((txn) => txn.id),
  //     [transactions]
  //   );

  //   const verifiedIds = useMemo(
  //     () => transactions.filter((txn) => txn.status === 'Verified').map((txn) => txn.id),
  //     [transactions]
  //   );


  //   // useEffect(() => {
  //   //   setSelectedIds((current) => current.filter((id) => actionableIds.includes(id)));
  //   // }, [actionableIds]);

  //   useEffect(() => {
  //     const validIds = mode === 'verify' ? pendingIds : verifiedIds;
  //     setSelectedIds((current) => current.filter((id) => validIds.includes(id)));
  //   }, [mode, pendingIds, verifiedIds]);


  //   // const toggleAll = () => {
  //   //   if (selectedIds.length === actionableIds.length) {
  //   //     setSelectedIds([]);
  //   //   } else {
  //   //     setSelectedIds(actionableIds);
  //   //   }
  //   // };

  //   // const toggleOne = (id) => {
  //   //   setSelectedIds((current) =>
  //   //     current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  //   //   );
  //   // };

  //   //updating toggle logic so that it can toggle pending and verififed transactions - nvm
  //   // const toggleAll = () => {
  //   //   const validIds = mode === 'verify' ? pendingIds : verifiedIds;

  //   //   if (selectedIds.length === validIds.length) {
  //   //     setSelectedIds([]);
  //   //   } else {
  //   //     setSelectedIds(validIds);
  //   //   }
  //   // };

  //   const toggleAll = () => {
  //     if (selectedIds.length === transactions.length) {
  //       setSelectedIds([]);
  //     } else {
  //       setSelectedIds(transactions.map(txn => txn.id));
  //     }
  //   };


  //   const toggleOne = (id) => {
  //     setSelectedIds((current) =>
  //       current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  //     );
  //   };


  //   const verifyTransaction = async (id) => {
  //     try {
  //       await employeeAPI.verifyTransaction(id);
  //       await fetchTransactions();
  //     } catch (err) {
  //       handleApiError(err);
  //     }
  //   };

  //   const startReject = (id) => {
  //     setRejectingId(id);
  //     setRejectReason('');
  //   };

  //   const confirmReject = async () => {
  //     const trimmed = rejectReason.trim();
  //     if (!trimmed) {
  //       setError('Please provide a reason for rejection.');
  //       return;
  //     }

  //     try {
  //       await employeeAPI.rejectTransaction(rejectingId, trimmed);
  //       setRejectingId(null);
  //       setRejectReason('');
  //       await fetchTransactions();
  //     } catch (err) {
  //       handleApiError(err);
  //     }
  //   };

  //   const submitBatch = async () => {
  //     if (selectedIds.length === 0) return;
  //     setSubmitting(true);
  //     try {
  //       await employeeAPI.submitToSwift(selectedIds);
  //       setSelectedIds([]);
  //       await fetchTransactions();
  //     } catch (err) {
  //       handleApiError(err);
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   };

  //   //added
  //   const handleMassVerify = async () => {
  //     if (selectedIds.length === 0) {
  //       setError("Select at least one transaction to verify.");
  //       return;
  //     }

  //     if (!window.confirm(`Verify ${selectedIds.length} selected transactions?`)) {
  //       return;
  //     }

  //     try {
  //       await employeeAPI.massVerify(selectedIds);
  //       alert(`Verified ${selectedIds.length} transaction(s).`);
  //       setSelectedIds([]);
  //       await fetchTransactions();
  //     } catch (err) {
  //       handleApiError(err);
  //     }
  //   };


  //   return (
  //     <div className="ep-gradient-bg">
  //       <div className="ep-container">
  //         <div className="ep-card">
  //           <div className="ep-header">
  //             <h2>International Payments – Employee Portal</h2>

  //             {/* Filter Section */}
  //             <div className="ep-filters">
  //               <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  //                 <option value="">All Statuses</option>
  //                 <option value="PendingVerification">Pending</option>
  //                 <option value="Verified">Verified</option>
  //                 <option value="Rejected">Rejected</option>
  //                 <option value="Submitted">Submitted</option>
  //               </select>

  //               <input
  //                 type="text"
  //                 placeholder="Currency (e.g. USD)"
  //                 value={currencyFilter}
  //                 onChange={(e) => setCurrencyFilter(e.target.value.toUpperCase())}
  //               />

  //               <input
  //                 type="text"
  //                 placeholder="Provider (e.g. SWIFT)"
  //                 value={providerFilter}
  //                 onChange={(e) => setProviderFilter(e.target.value.toUpperCase())}
  //               />

  //               <button className="ep-btn" onClick={fetchTransactions} disabled={loading}>
  //                 Apply Filters
  //               </button>
  //               <button className="ep-btn" onClick={() => {
  //                 setStatusFilter('');
  //                 setCurrencyFilter('');
  //                 setProviderFilter('');
  //               }}>
  //                 Clear
  //               </button>
  //             </div>

  //             {/* <div className="ep-actions-bar">

  //               <button
  //                 className="ep-btn"
  //                 onClick={handleMassVerify}
  //                 disabled={selectedIds.length === 0}
  //               >
  //                 Verify Selected ({selectedIds.length})
  //               </button>

  //               <button
  //                 className="ep-btn"
  //                 onClick={handleMassVerify}
  //                 disabled={!canVerify || selectedIds.length === 0}  // disabled if can't verify or no selection
  //               >
  //                 Verify Selected ({selectedIds.length})
  //               </button>

  //               <button
  //                 className="ep-btn ep-btn-primary"
  //                 onClick={submitBatch}
  //                 disabled={submitting || !canSubmit || selectedIds.length === 0} // disabled if submitting, or can't submit, or no selection
  //               >
  //                 {submitting ? 'Submitting…' : `Submit ${selectedIds.length} to SWIFT`}
  //               </button>

  //               <button
  //                 className="ep-btn ep-btn-primary"
  //                 onClick={submitBatch}
  //                 disabled={submitting || selectedIds.length === 0}
  //               >
  //                 {submitting ? 'Submitting…' : `Submit ${selectedIds.length} to SWIFT`}
  //               </button>
  //               <button className="ep-btn" onClick={fetchTransactions} disabled={loading}>
  //                 Refresh
  //               </button>
  //             </div> */}

  //             <div className="ep-actions-bar">

  //               <button
  //                 className="ep-btn"
  //                 onClick={handleMassVerify}
  //                 disabled={!canVerify || selectedIds.length === 0}
  //               >
  //                 Verify Selected ({selectedIds.length})
  //               </button>

  //               <button
  //                 className="ep-btn ep-btn-primary"
  //                 onClick={submitBatch}
  //                 disabled={submitting || !canSubmit || selectedIds.length === 0}
  //               >
  //                 {submitting ? 'Submitting…' : `Submit ${selectedIds.length} to SWIFT`}
  //               </button>

  //               <button className="ep-btn" onClick={fetchTransactions} disabled={loading}>
  //                 Refresh
  //               </button>
  //             </div>
  //           </div>



  //           {error && <div className="ep-error">{error}</div>}

  //           {loading ? (
  //             <div className="ep-loading">Loading…</div>
  //           ) : transactions.length === 0 ? (
  //             <EmptyState text="No transactions available." />
  //           ) : (
  //             <div className="ep-table-wrapper">
  //               <table className="ep-table">
  //                 <thead>
  //                   <tr>
  //                     <th>
  //                       {/* <input
  //                         type="checkbox"
  //                         checked={selectedIds.length === actionableIds.length && actionableIds.length > 0}
  //                         onChange={toggleAll}
  //                         disabled={actionableIds.length === 0}
  //                       />
  //                       */}
  //                       <input
  //                         type="checkbox"
  //                         checked={
  //                           selectedIds.length === (mode === 'verify' ? pendingIds.length : verifiedIds.length) &&
  //                           (mode === 'verify' ? pendingIds.length : verifiedIds.length) > 0
  //                         }
  //                         onChange={toggleAll}
  //                         disabled={(mode === 'verify' ? pendingIds.length : verifiedIds.length) === 0}
  //                       />

  //                     </th>
  //                     <th>Reference</th>
  //                     <th>Payer Account</th>
  //                     <th>Payee Account</th>
  //                     <th>Amount</th>
  //                     <th>Provider</th>
  //                     <th>SWIFT Code</th>
  //                     <th>Status</th>
  //                     <th>Actions</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {transactions.map((txn) => (
  //                     <TransactionRow
  //                       key={txn.id}
  //                       txn={txn}
  //                       onVerify={verifyTransaction}
  //                       onReject={startReject}
  //                       onToggle={toggleOne}
  //                       selected={selectedIds.includes(txn.id)}
  //                       //added mode
  //                       mode={mode}
  //                     />
  //                   ))}
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </div>
  //       </div>

  //       {rejectingId && (
  //         <div className="ep-modal-backdrop" onClick={() => setRejectingId(null)}>
  //           <div className="ep-modal" onClick={(event) => event.stopPropagation()}>
  //             <h3>Reject Transaction</h3>
  //             <textarea
  //               className="ep-textarea"
  //               rows={4}
  //               placeholder="Reason for rejection"
  //               value={rejectReason}
  //               onChange={(event) => setRejectReason(event.target.value)}
  //             />
  //             <div className="ep-modal-actions">
  //               <button className="ep-btn" onClick={() => setRejectingId(null)}>Cancel</button>
  //               <button className="ep-btn ep-btn-reject" onClick={confirmReject}>Reject</button>
  //             </div>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // }


  import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // adjust if path differs
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../services/api';
import './EmployeePortal.css';

const STATUS_LABELS = {
  PendingVerification: 'Pending',
  Verified: 'Verified',
  Rejected: 'Rejected',
  Submitted: 'Submitted',
};

const ACTIONABLE_STATUS = 'PendingVerification';

const EmptyState = ({ text }) => (
  <div className="ep-empty">
    <p>{text}</p>
  </div>
);

const TransactionRow = ({ txn, onVerify, onReject, onToggle, selected, mode }) => {
  const isActionable = txn.status === ACTIONABLE_STATUS;

  return (
    <tr className="ep-row">
      <td>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggle(txn.id)}
        />
      </td>
      <td>{txn.reference}</td>
      <td>{txn.senderAccount}</td>
      <td>{txn.recipientAccount}</td>
      <td>{txn.currency} {Number(txn.amount).toFixed(2)}</td>
      <td>{txn.provider}</td>
      <td>{txn.swiftCode}</td>
      <td>
        <span className={`ep-badge ep-badge-${txn.statusLabel}`}>{txn.statusLabel}</span>
      </td>
      <td className="ep-actions">
        <button
          className="ep-btn ep-btn-verify"
          onClick={() => onVerify(txn.id)}
          disabled={!isActionable}
        >
          Verify
        </button>
        <button
          className="ep-btn ep-btn-reject"
          onClick={() => onReject(txn.id)}
          disabled={!isActionable}
        >
          Reject
        </button>
      </td>
    </tr>
  );
};

const normalizeTransactions = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw.map((txn) => {
    const id = txn.id || txn._id;
    const status = txn.status || 'PendingVerification';

    return {
      id,
      reference: txn.reference || id,
      senderAccount: txn.senderAccount || txn.payerName,
      recipientAccount: txn.recipientAccount || txn.payeeName,
      amount: txn.amount,
      currency: txn.currency,
      provider: txn.provider || txn.country,
      swiftCode: txn.swiftCode,
      status,
      statusLabel: txn.statusLabel || STATUS_LABELS[status] || status,
      timestamp: txn.timestamp || txn.createdAt,
    };
  });
};

export default function EmployeePortal() {
  // Auth + Navigation
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Local state
  const [mode, setMode] = useState('verify'); // 'verify' or 'submit'
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');

  // Selected statuses for enabling/disabling buttons
  const selectedStatuses = useMemo(() => {
    const statuses = new Set();
    selectedIds.forEach((id) => {
      const txn = transactions.find((t) => t.id === id);
      if (txn) statuses.add(txn.status);
    });
    return statuses;
  }, [selectedIds, transactions]);

  const canVerify = selectedStatuses.size === 1 && selectedStatuses.has("PendingVerification");
  const canSubmit = selectedStatuses.size === 1 && selectedStatuses.has("Verified");

  // Get IDs filtered by status
  const pendingIds = useMemo(
    () => transactions.filter((txn) => txn.status === 'PendingVerification').map((txn) => txn.id),
    [transactions]
  );

  const verifiedIds = useMemo(
    () => transactions.filter((txn) => txn.status === 'Verified').map((txn) => txn.id),
    [transactions]
  );

  // Reset selectedIds when mode or valid IDs change
  useEffect(() => {
    const validIds = mode === 'verify' ? pendingIds : verifiedIds;
    setSelectedIds((current) => current.filter((id) => validIds.includes(id)));
  }, [mode, pendingIds, verifiedIds]);

  // Error handler
  const handleApiError = (err) => {
    setError(err.response?.data?.message || err.message || "An error occurred.");
  };

  // Fetch transactions with filters
  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (currencyFilter) params.currency = currencyFilter;
      if (providerFilter) params.provider = providerFilter;

      const { data } = await employeeAPI.getTransactions(params);
      const payload = Array.isArray(data?.transactions) ? data.transactions : data;
      setTransactions(normalizeTransactions(payload));
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, currencyFilter, providerFilter]);

  // Toggle selection for all or one
  const toggleAll = () => {
    const validIds = mode === 'verify' ? pendingIds : verifiedIds;
    if (selectedIds.length === validIds.length && validIds.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(validIds);
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  // API actions
  const verifyTransaction = async (id) => {
    try {
      await employeeAPI.verifyTransaction(id);
      await fetchTransactions();
    } catch (err) {
      handleApiError(err);
    }
  };

  const startReject = (id) => {
    setRejectingId(id);
    setRejectReason('');
  };

  const confirmReject = async () => {
    const trimmed = rejectReason.trim();
    if (!trimmed) {
      setError('Please provide a reason for rejection.');
      return;
    }
    try {
      await employeeAPI.rejectTransaction(rejectingId, trimmed);
      setRejectingId(null);
      setRejectReason('');
      await fetchTransactions();
    } catch (err) {
      handleApiError(err);
    }
  };

  const submitBatch = async () => {
    if (selectedIds.length === 0) return;
    setSubmitting(true);
    try {
      await employeeAPI.submitToSwift(selectedIds);
      setSelectedIds([]);
      await fetchTransactions();
    } catch (err) {
      handleApiError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMassVerify = async () => {
    if (selectedIds.length === 0) {
      setError("Select at least one transaction to verify.");
      return;
    }
    if (!window.confirm(`Verify ${selectedIds.length} selected transactions?`)) {
      return;
    }
    try {
      await employeeAPI.massVerify(selectedIds);
      alert(`Verified ${selectedIds.length} transaction(s).`);
      setSelectedIds([]);
      await fetchTransactions();
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className="ep-gradient-bg">
      {/* Navbar */}
      <header className="dashboard-header">
        <nav className="nav">
          <div className="nav-brand">
            <h2>INSY POE</h2>
          </div>
          <div className="nav-links">
            <span className="welcome-text">Welcome, {user?.firstName}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </nav>
      </header>

      {/* Main Portal Content */}
      <div className="ep-container" style={{ paddingTop: '90px' }}>
        <div className="ep-card">
          <div className="ep-header">
            <h2>International Payments – Employee Portal</h2>

            {/* Filters */}
            <div className="ep-filters">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="PendingVerification">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
                <option value="Submitted">Submitted</option>
              </select>

              <input
                type="text"
                placeholder="Currency (e.g. USD)"
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value.toUpperCase())}
              />

              <input
                type="text"
                placeholder="Provider (e.g. SWIFT)"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value.toUpperCase())}
              />

              <button className="ep-btn" onClick={fetchTransactions} disabled={loading}>
                Apply Filters
              </button>
              <button className="ep-btn" onClick={() => {
                setStatusFilter('');
                setCurrencyFilter('');
                setProviderFilter('');
              }}>
                Clear
              </button>
            </div>

            {/* Actions Bar */}
            <div className="ep-actions-bar">
              <button
                className="ep-btn"
                onClick={handleMassVerify}
                disabled={!canVerify || selectedIds.length === 0}
              >
                Verify Selected ({selectedIds.length})
              </button>

              <button
                className="ep-btn ep-btn-primary"
                onClick={submitBatch}
                disabled={submitting || !canSubmit || selectedIds.length === 0}
              >
                {submitting ? 'Submitting…' : `Submit ${selectedIds.length} to SWIFT`}
              </button>

              <button className="ep-btn" onClick={fetchTransactions} disabled={loading}>
                Refresh
              </button>
            </div>
          </div>

          {error && <div className="ep-error">{error}</div>}

          {loading ? (
            <div className="ep-loading">Loading…</div>
          ) : transactions.length === 0 ? (
            <EmptyState text="No transactions available." />
          ) : (
            <div className="ep-table-wrapper">
              <table className="ep-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === (mode === 'verify' ? pendingIds.length : verifiedIds.length) &&
                          (mode === 'verify' ? pendingIds.length : verifiedIds.length) > 0
                        }
                        onChange={toggleAll}
                        disabled={(mode === 'verify' ? pendingIds.length : verifiedIds.length) === 0}
                      />
                    </th>
                    <th>Reference</th>
                    <th>Payer Account</th>
                    <th>Payee Account</th>
                    <th>Amount</th>
                    <th>Provider</th>
                    <th>SWIFT Code</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <TransactionRow
                      key={txn.id}
                      txn={txn}
                      onVerify={verifyTransaction}
                      onReject={startReject}
                      onToggle={toggleOne}
                      selected={selectedIds.includes(txn.id)}
                      mode={mode}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="ep-modal-backdrop" onClick={() => setRejectingId(null)}>
          <div className="ep-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Reject Transaction</h3>
            <textarea
              className="ep-textarea"
              rows={4}
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            />
            <div className="ep-modal-actions">
              <button className="ep-btn" onClick={() => setRejectingId(null)}>Cancel</button>
              <button className="ep-btn ep-btn-reject" onClick={confirmReject}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
