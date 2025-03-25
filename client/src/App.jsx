import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [emailError, setEmailError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/contacts");
      setContacts(response.data);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      (contact.email && contact.email.toLowerCase().includes(searchLower))
    );
  });

  const checkEmailExists = async (email, excludeId = null) => {
    try {
      const params = { email };
      if (excludeId) params.excludeId = excludeId;
      
      const response = await axios.get("http://localhost:8080/api/contacts/check-email", { params });
      return response.data.exists;
    } catch (err) {
      console.error('Error checking email:', err);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setError('');

    try {
      // Check if email exists
      const emailExists = await checkEmailExists(
        currentContact.email, 
        modalMode === 'edit' ? currentContact.id : null
      );

      if (emailExists) {
        setEmailError('A contact with this email already exists');
        return;
      }

      if (modalMode === 'add') {
        await axios.post("http://localhost:8080/api/contacts", currentContact);
      } else {
        await axios.put(`http://localhost:8080/api/contacts/${currentContact.id}`, currentContact);
      }
      setCurrentContact({ name: '', email: '' });
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(`Failed to ${modalMode} contact`);
      }
      console.error(`Error ${modalMode}ing contact:`, err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/contacts/${currentContact.id}`);
      setCurrentContact({ name: '', email: '' });
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
      console.error('Error deleting contact:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentContact(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (name === 'email') setEmailError('');
    setError('');
  };

  const openAddModal = () => {
    setCurrentContact({ name: '', email: '' });
    setModalMode('add');
    setIsModalOpen(true);
    setEmailError('');
    setError('');
  };

  const openEditModal = (contact) => {
    setCurrentContact(contact);
    setModalMode('edit');
    setIsModalOpen(true);
    setEmailError('');
    setError('');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>ZF x Linq</h1>
        <button className="add-button" onClick={openAddModal}>
          +
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search" 
            onClick={() => setSearchTerm('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="contacts-list">
        <h2>Contacts</h2>
        {filteredContacts.length === 0 ? (
          <p>{searchTerm ? 'No contacts found matching your search.' : 'No contacts yet. Click the Add Contact button to get started!'}</p>
        ) : (
          <div className="contacts-grid">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id} 
                className="contact-card"
                onClick={() => openEditModal(contact)}
              >
                <h3>{contact.name}</h3>
                {contact.email && <p>{contact.email}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Contact' : 'Edit Contact'}</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={currentContact.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={currentContact.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className={emailError ? 'error-input' : ''}
                />
                {emailError && <div className="field-error">{emailError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                {modalMode === 'edit' && (
                  <button type="button" className="delete-button" onClick={handleDelete}>
                    Delete
                  </button>
                )}
                <button type="submit">
                  {modalMode === 'add' ? 'Add Contact' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
