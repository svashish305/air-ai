import { useState } from 'react'
import { bot, user, send } from './assets';
import './App.scss'

function App() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<any>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // add user's chat to chat list
    setChat((chat: any) => [...chat, { isAi: false, value: prompt, uniqueId: generateUniqueId() }]);
    setPrompt("");

    // fetch data from server
    const response = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.data.trim();
      
      // add bot's chat to chat list
      setChat((chat: any) => [...chat, { isAi: true, value: parsedData, uniqueId: generateUniqueId() }]);
    } else {
      const err = await response.text();
      alert(err);
    }
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  const renderChat = (isAi: boolean, value: string | null, uniqueId: any) => {
    return (
      <div key={uniqueId} className={`wrapper ${isAi && "ai"}`}>
        <div className="chat">
          <div className="profile">
            <img src={isAi ? bot : user} alt={`${isAi ? "bot" : "user"}`} />
          </div>
          <div className="message" id={uniqueId}>
            {value}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <>
        {/* Chat Container */}
        <div id="chat_container">
          {chat.map(({ isAi, value, uniqueId }: 
            { isAi: boolean, value: string, uniqueId: any }) =>
            renderChat(isAi, value, uniqueId)
          )}
        </div>
        <form onSubmit={handleSubmit}>
          <textarea 
            name="prompt" 
            rows={1} 
            cols={1} 
            placeholder="Ask AirAI..." 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <button type="submit"><img src={send} /></button>
        </form>
      </>
      <>
        {/* Visual Indicator of AQI */}
        <div style={{textAlign: "center"}}>AQI Scale</div>
        <div className="aqiScaleContainer">
          <div className="aqiScaleBox" style={{backgroundColor: 'maroon'}}>Hazardous (&gt; 300)</div>
          <div className="aqiScaleBox" style={{backgroundColor: 'purple'}}>Very Unhealthy (201-300)</div>
          <div className="aqiScaleBox" style={{backgroundColor: 'red'}}>Unhealthy (151-200)</div>
          <div className="aqiScaleBox" style={{backgroundColor: 'orange'}}>Unhealthy for Sensitive Groups (101-150)</div>
          <div className="aqiScaleBox" style={{backgroundColor: 'yellow'}}>Moderate (51-100)</div>
          <div className="aqiScaleBox" style={{backgroundColor: 'green'}}>Good (0-50)</div>
        </div>
      </>
    </div>
  )
}

export default App
