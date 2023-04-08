import { useState } from 'react'
import { bot, user, send } from './assets';
import './App.scss'

function App() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<any>([]);
  const [isAi, setIsAi] = useState(false);

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // add user's chat to chat list
    setIsAi(false);
    setChat((chat: any) => [...chat, { isAi: false, value: prompt, uniqueId: generateUniqueId() }]);
    setPrompt("");

    // fetch data from server
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/query`, {
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
        setIsAi(true);
        setChat((chat: any) => [...chat, { isAi: true, value: parsedData, uniqueId: generateUniqueId() }]);
      } else {
        const err = await response.text();
        alert(err);
      }
    } catch (error) {
      setIsAi(false);
      console.log(error);
      alert(error);
    }
    
  };

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

  return (
    <div className="App">
      <>
        {/* Chat Container */}
        <div id="chat_container">
          {chat.map(({ isAi, value, uniqueId }: { isAi: boolean, value: string, uniqueId: any }) =>
            (
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
            )
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
            onKeyDown={handleKeyDown}
          ></textarea>
          <button type="submit"><img src={send} /></button>
        </form>
      </>
      <>
        {((!prompt || !prompt.length)) && isAi && <div>
          {/* Visual Indicator of AQI */}
          <div>
            <div style={{textAlign: "center", padding: "1rem", color: "white"}}>AQI Scale</div>
            <div className="aqiScaleContainer">
              <div className="aqiScaleBox" style={{backgroundColor: 'maroon'}}>Hazardous (&gt; 300)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'purple'}}>Very Unhealthy (201-300)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'red'}}>Unhealthy (151-200)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'orange'}}>Unhealthy for Sensitive Groups (101-150)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'yellow'}}>Moderate (51-100)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'green'}}>Good (0-50)</div>
            </div>
          </div>

          {/* Visual Indicator of PM2.5 Concentration averaged over 1 hour */}
          <div>
            <div style={{textAlign: "center", marginTop: "1rem", padding: "1rem", color: "white"}}>PM2.5 µg/m3 Concentration Scale (averaged over 1 hour)</div>
            <div className="aqiScaleContainer">
              <div className="aqiScaleBox" style={{backgroundColor: 'maroon'}}>Extremely Poor (&gt; 300)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'red'}}>Very Poor (100-300)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'orange'}}>Poor (50-100)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'yellow'}}>Fair (25-50)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'green'}}>Good (0-25)</div>
            </div>
          </div>

          {/* Visual Indicator of PM2.5 Concentration averaged over 24 hours */}
          <div>
            <div style={{textAlign: "center", marginTop: "1rem", padding: "1rem", color: "white"}}>PM2.5 µg/m3 Concentration Scale (averaged over 24 hours)</div>
            <div className="aqiScaleContainer">
              <div className="aqiScaleBox" style={{backgroundColor: 'maroon'}}>Extremely Poor (&gt; 150)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'red'}}>Very Poor (50-150)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'orange'}}>Poor (25-50)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'yellow'}}>Fair (12.5-25)</div>
              <div className="aqiScaleBox" style={{backgroundColor: 'green'}}>Good (0-12.5)</div>
            </div>
          </div>
        </div>}
      </>
    </div>
  )
}

export default App
