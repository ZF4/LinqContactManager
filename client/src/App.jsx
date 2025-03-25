import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/contacts", newContact);
      setNewContact({ name: '', email: '' });
      setIsModalOpen(false);
      fetchContacts();
    } catch (err) {
      setError('Failed to add contact');
      console.error('Error adding contact:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <div className="header">
        <h1>ZF x Linq</h1>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          +
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}

      <div className="contacts-list">
        <h2>Contacts</h2>
        {contacts.length === 0 ? (
          <p>No contacts yet. Click the Add Contact button to get started!</p>
        ) : (
          <div className="contacts-grid">
            {contacts.map(contact => (
              <div key={contact.id} className="contact-card">
                <h3>{contact.name}</h3>
                {contact.email && <p>{contact.email}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Contact</h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  value={newContact.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  value={newContact.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;