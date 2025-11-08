import React, { useState, useEffect } from 'react';

function EditProfile({ onBack, onSave, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    gender: 'male',
    age: '',
    exerciseFrequency: 'moderate',
    smoking: 'no',
    diabetes: 'no',
    emergencyContacts: [{ name: '', phone: '' }]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = {
      ...newContacts[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      emergencyContacts: newContacts
    }));
  };

  const addEmergencyContact = () => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, { name: '', phone: '' }]
    }));
  };

  const removeEmergencyContact = (index) => {
    setFormData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4 border-b border-gray-700">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-green-500">Basic Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="120"
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Health Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-green-500">Health Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400">Exercise Frequency</label>
                  <select
                    name="exerciseFrequency"
                    value={formData.exerciseFrequency}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="light">Light</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                    <option value="very_active">Very Active</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Smoking</label>
                  <select
                    name="smoking"
                    value={formData.smoking}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Diabetes</label>
                  <select
                    name="diabetes"
                    value={formData.diabetes}
                    onChange={handleChange}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-green-500">Emergency Contacts</h2>
              <button
                type="button"
                onClick={addEmergencyContact}
                className="text-green-500 hover:text-green-400 transition-colors text-sm"
              >
                + Add Contact
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Contact #{index + 1}</h3>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEmergencyContact(index)}
                        className="text-red-500 hover:text-red-400 transition-colors text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-gray-400">Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleEmergencyContactChange(index, 'name', e.target.value)}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400">Phone</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleEmergencyContactChange(index, 'phone', e.target.value)}
                        className="w-full bg-gray-600 rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile; 