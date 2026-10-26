'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import '@/styles/admin-animations.css';

const contactsStyles = {
  filterBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  filterBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    borderTop: '1px solid var(--line)',
    borderRight: '1px solid var(--line)',
    borderBottom: '1px solid var(--line)',
    borderLeft: '1px solid var(--line)',
    background: 'var(--cream)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  },
  filterBtnActive: {
    background: 'var(--sage-100)',
    color: 'var(--green-700)',
    borderTop: '1px solid var(--green-700)',
    borderRight: '1px solid var(--green-700)',
    borderBottom: '1px solid var(--green-700)',
    borderLeft: '1px solid var(--green-700)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--green-900)',
    borderBottom: '1px solid var(--line)',
    textTransform: 'uppercase',
  },
  td: {
    padding: '12px 8px',
    fontSize: '13px',
    color: 'var(--charcoal)',
    borderBottom: '1px solid var(--line)',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  alert: {
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: 500,
  },
  alertSuccess: {
    background: 'rgba(106, 168, 79, 0.1)',
    color: 'var(--green-700)',
    border: '1px solid var(--green-700)',
  },
  alertError: {
    background: 'rgba(255, 67, 67, 0.1)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: '#fff',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '600px',
    width: '95%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--green-900)',
    marginBottom: '24px',
    borderBottom: '2px solid var(--line)',
    paddingBottom: '16px',
  },
  contactDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px',
  },
  detailField: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--charcoal-60)',
    textTransform: 'uppercase',
    marginBottom: '8px',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--charcoal)',
    lineHeight: 1.5,
  },
  detailValueFull: {
    gridColumn: '1 / -1',
  },
  messageBox: {
    background: 'var(--sage-100)',
    padding: '16px',
    borderRadius: '8px',
    borderLeft: '4px solid var(--green-700)',
    marginBottom: '24px',
  },
  message: {
    fontSize: '13px',
    color: 'var(--charcoal)',
    lineHeight: 1.6,
    margin: 0,
  },
  notesArea: {
    width: '100%',
    padding: '12px',
    border: '1px solid var(--line)',
    borderRadius: '6px',
    fontFamily: 'inherit',
    fontSize: '13px',
    minHeight: '100px',
    marginBottom: '12px',
    fontFamily: '"Courier New", monospace',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    borderTop: '1px solid var(--line)',
    paddingTop: '24px',
  },
};

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/contact');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.submissions)) {
        setContacts(data.submissions);
      } else {
        setError('Failed to load contact requests');
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Failed to load contact requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      setError('');
      setSuccess('');

      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update contact status');
        return;
      }

      // Update local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === contactId
            ? { ...contact, status: newStatus }
            : contact
        )
      );

      if (selectedContact?._id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }

      setSuccess('Status updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating contact status:', err);
      setError('Failed to update contact status');
    }
  };

  const handleSaveNotes = async (contactId) => {
    try {
      setError('');
      setSuccess('');

      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: adminNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to save notes');
        return;
      }

      // Update local state
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact._id === contactId
            ? { ...contact, notes: adminNotes }
            : contact
        )
      );

      if (selectedContact?._id === contactId) {
        setSelectedContact({ ...selectedContact, notes: adminNotes });
      }

      setSuccess('Notes saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving notes:', err);
      setError('Failed to save notes');
    }
  };

  const filteredContacts = (selectedStatus === 'all'
    ? contacts
    : contacts.filter((c) => c.status === selectedStatus))
    .filter((contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return { background: '#FBE9CF', color: '#8A5A0E' };
      case 'read':
        return { background: '#DCE7F5', color: '#2F5A9E' };
      case 'replied':
        return { background: 'var(--sage-100)', color: 'var(--green-700)' };
      case 'closed':
        return { background: '#E3DCF5', color: '#5A3E9E' };
      default:
        return {};
    }
  };

  const statuses = ['new', 'read', 'replied', 'closed'];

  const contactCounts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === 'new').length,
    read: contacts.filter((c) => c.status === 'read').length,
    replied: contacts.filter((c) => c.status === 'replied').length,
    closed: contacts.filter((c) => c.status === 'closed').length,
  };

  return (
    <div className="admin-page-enter">
      {error && (
        <div style={{ ...contactsStyles.alert, ...contactsStyles.alertError }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {success && (
        <div style={{ ...contactsStyles.alert, ...contactsStyles.alertSuccess }}>
          <span>{success}</span>
          <button onClick={() => setSuccess('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', float: 'right' }}>×</button>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search by Name, Email or Subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '50%',
            padding: '12px 14px',
            border: '1px solid var(--line)',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'inherit',
            transition: 'all 0.3s ease',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = '0 0 0 3px rgba(106, 168, 79, 0.1)';
            e.target.style.borderColor = 'var(--green-700)';
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.borderColor = 'var(--line)';
          }}
        />
      </div>

      {/* Filter Bar */}
      <div style={contactsStyles.filterBar} className="admin-filter-bar">
        <button
          style={{
            ...contactsStyles.filterBtn,
            ...(selectedStatus === 'all' ? contactsStyles.filterBtnActive : {}),
          }}
          className="admin-filter-btn"
          onClick={() => setSelectedStatus('all')}
        >
          All Requests ({contactCounts.all})
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            style={{
              ...contactsStyles.filterBtn,
              ...(selectedStatus === status ? contactsStyles.filterBtnActive : {}),
            }}
            className="admin-filter-btn"
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({contactCounts[status]})
          </button>
        ))}
      </div>

      {/* Contacts Table */}
      <div style={{ background: 'var(--cream)', borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }} className="admin-section-card">
        {isLoading ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <p>Loading contact requests...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--charcoal)' }}>
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>
              {searchQuery ? `No requests found matching "${searchQuery}"` : 'No contact requests found for the selected status.'}
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--green-700)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  textDecoration: 'underline',
                  marginTop: '8px',
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <table style={contactsStyles.table} className="admin-table">
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                <th style={contactsStyles.th}>Name</th>
                <th style={contactsStyles.th}>Email</th>
                <th style={contactsStyles.th}>Subject</th>
                <th style={contactsStyles.th}>Status</th>
                <th style={contactsStyles.th}>Date</th>
                <th style={contactsStyles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr key={contact._id}>
                  <td style={contactsStyles.td}>
                    <span style={{ fontWeight: 600 }}>{contact.name}</span>
                  </td>
                  <td style={contactsStyles.td}>{contact.email}</td>
                  <td style={contactsStyles.td}>
                    <span style={{ 
                      maxWidth: '200px', 
                      display: 'inline-block', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {contact.subject}
                    </span>
                  </td>
                  <td style={contactsStyles.td}>
                    <select
                      value={contact.status}
                      onChange={(e) => handleStatusChange(contact._id, e.target.value)}
                      style={{
                        ...contactsStyles.statusBadge,
                        ...getStatusColor(contact.status),
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={contactsStyles.td}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td style={contactsStyles.td}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedContact(contact);
                        setAdminNotes(contact.notes || '');
                      }}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div style={contactsStyles.modal} onClick={() => setSelectedContact(null)}>
          <div style={contactsStyles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={contactsStyles.modalTitle}>
              Contact Request from {selectedContact.name}
            </div>

            <div style={contactsStyles.contactDetails}>
              <div style={contactsStyles.detailField}>
                <div style={contactsStyles.detailLabel}>Name</div>
                <div style={contactsStyles.detailValue}>{selectedContact.name}</div>
              </div>

              <div style={contactsStyles.detailField}>
                <div style={contactsStyles.detailLabel}>Email</div>
                <div style={contactsStyles.detailValue}>{selectedContact.email}</div>
              </div>

              <div style={contactsStyles.detailField}>
                <div style={contactsStyles.detailLabel}>Phone</div>
                <div style={contactsStyles.detailValue}>{selectedContact.phone || 'Not provided'}</div>
              </div>

              <div style={contactsStyles.detailField}>
                <div style={contactsStyles.detailLabel}>Status</div>
                <div style={{
                  ...contactsStyles.detailValue,
                  ...getStatusColor(selectedContact.status),
                  display: 'inline-block',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  width: 'fit-content',
                  fontWeight: 600,
                }}>
                  {selectedContact.status.charAt(0).toUpperCase() + selectedContact.status.slice(1)}
                </div>
              </div>

              <div style={contactsStyles.detailField}>
                <div style={contactsStyles.detailLabel}>Received</div>
                <div style={contactsStyles.detailValue}>
                  {new Date(selectedContact.createdAt).toLocaleDateString()} at {new Date(selectedContact.createdAt).toLocaleTimeString()}
                </div>
              </div>

              <div style={{ ...contactsStyles.detailField, ...contactsStyles.detailValueFull }}>
                <div style={contactsStyles.detailLabel}>Subject</div>
                <div style={contactsStyles.detailValue}>{selectedContact.subject}</div>
              </div>
            </div>

            {/* Message */}
            <div style={contactsStyles.messageBox}>
              <div style={contactsStyles.detailLabel} style={{ marginBottom: '12px' }}>Message</div>
              <p style={contactsStyles.message}>{selectedContact.message}</p>
            </div>

            {/* Admin Notes */}
            <div>
              <label style={{ ...contactsStyles.detailLabel, display: 'block' }}>Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this request..."
                style={contactsStyles.notesArea}
              />
            </div>

            <div style={contactsStyles.modalActions}>
              <Button 
                variant="primary"
                onClick={() => handleSaveNotes(selectedContact._id)}
              >
                Save Notes
              </Button>
              <Button 
                variant="outline"
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
