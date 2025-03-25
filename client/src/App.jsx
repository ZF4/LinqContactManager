import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/contacts");
      console.log('Fetched contacts:', response.data);
      setContacts(response.data);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error fetching contacts:', err);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="container">
      <h1>Contacts</h1>
      {error && <p className="error">{error}</p>}
      {contacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        <div className="contacts-list">
          {contacts.map((contact, index) => (
            <div key={index} className="contact-card">
              <p><strong>Name:</strong> {contact.name}</p>
              <p><strong>Email:</strong> {contact.email}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
