import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const ChatProvider = ({ children, userProfile }) => {
  // Initialize messages state
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Keep track of conversation history in the format Gemini expects
  const [conversationHistory, setConversationHistory] = useState([]);

  // Reinitialize messages and conversation history when userProfile changes
  useEffect(() => {
    // Initialize with the greeting message that includes user's name
    setMessages([{
      id: 1,
      text: `Hello ${userProfile?.name || 'Guest'}! I am your personal healthcare assistant. I already know your health profile, so feel free to ask any health-related questions.`,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Initialize conversation history
    setConversationHistory([{
      role: "model",
      parts: [{
        text: `Hello! I am a healthcare assistant. I have access to your health profile: 
        - Name: ${userProfile?.name || 'Guest'}
        - Age: ${userProfile?.age || 'Not specified'}
        - Gender: ${userProfile?.gender || 'Not specified'}
        - Exercise Frequency: ${userProfile?.exerciseFrequency || 'Not specified'}
        - Smoking: ${userProfile?.smoking || 'Not specified'}
        - Diabetes: ${userProfile?.diabetes || 'Not specified'}
        I will use this information to provide personalized health advice. I will make sure its concise and to the point.
        I will also make sure to use the latest medical information and guidelines to provide the most accurate advice.
        I will also make sure to not like asterisks and such`
      }]
    }]);
  }, [userProfile]);

  const addMessage = (text, sender = 'user') => {
    const newMessage = {
      id: messages.length + 1,
      text,
      sender,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);

    if (sender === 'user') {
      handleAssistantResponse(text);
    }
  };

  const handleAssistantResponse = async (userMessage) => {
    setIsTyping(true);
    console.log('Sending message to Gemini:', userMessage); // Debug log

    try {
      // Format the question with user profile context
      const userContext = `
        Context: I am a ${userProfile?.age || 'Not specified'} year old ${userProfile?.gender || 'person'}, 
        with ${userProfile?.exerciseFrequency || 'unspecified'} exercise frequency, 
        ${userProfile?.smoking === 'yes' ? 'I am a smoker' : userProfile?.smoking === 'no' ? 'I do not smoke' : 'smoking status not specified'}, 
        and ${userProfile?.diabetes === 'yes' ? 'I have diabetes' : userProfile?.diabetes === 'no' ? 'I do not have diabetes' : 'diabetes status not specified'}.
      `;
      
      const conciseQuestion = `You are a Healthcare assistant. Using the following user profile information:
      ${userContext}
      
      Please provide a personalized, direct answer to this question: ${userMessage}
      
      Make sure your response takes into account the user's health profile and provide relevant advice.`;
      
      // Update conversation history with user's message
      const updatedHistory = [
        ...conversationHistory,
        { role: "user", parts: [{ text: conciseQuestion }] }
      ];
      
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GOOGLE_API_KEY}`,
        {
          contents: updatedHistory
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Gemini response:', response.data); // Debug log

      if (response.data.candidates && response.data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiResponse = response.data.candidates[0].content.parts[0].text.trim();
        
        // Update conversation history with bot's response
        setConversationHistory([
          ...updatedHistory,
          { role: "model", parts: [{ text: aiResponse }] }
        ]);
        
        addMessage(aiResponse, 'bot');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      let errorMessage = "I'm sorry, I couldn't retrieve an answer. Please consult a healthcare professional.";
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = "There seems to be an issue with the API key. Please make sure you're using a valid Google AI API key.";
      } else if (error.response?.status === 429) {
        errorMessage = "I've reached my quota limit. Please try again later.";
      }
      
      addMessage(errorMessage, 'bot');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isTyping }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext); 