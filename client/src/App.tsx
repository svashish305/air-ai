import { useState } from 'react'
import { bot, user, send } from './assets';
import './App.scss'

function App() {
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<any>([]);
  const [isAi, setIsAi] = useState(false);
  const [cityAqiInfo, setCityAqiInfo] = useState<any>([]);

  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
  };

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
        const { data: cityAqiData, answer } = data;
        setCityAqiInfo(cityAqiData);
        const parsedData = answer.trim();
        
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

  return (
    <div id="app">
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
          {/* AQI Scale as Visual Indicator */}
          {cityAqiInfo?.map((data: any) => (
            <div key={data.id}>
              <div 
                style={{textAlign: "center", padding: "1rem", color: "white"}}
              >
                {data.city} has a current AQI of {data.aqi}, selected region in below AQI Scale has the blue border 
              </div>
              <div className="aqiScaleContainer">
                <div 
                  className={`aqiScaleBox aqiScaleMaroonColor ${data.color === "maroon" ? "blueBorder" : ""}`} 
                >
                  Hazardous (&gt; 300)
                </div>
                <div 
                  className={`aqiScaleBox aqiScalePurpleColor ${data.color === "purple" ? "blueBorder" : ""}`} 
                >
                  Very Unhealthy (201-300)
                </div>
                <div
                  className={`aqiScaleBox aqiScaleRedColor ${data.color === "red" ? "blueBorder" : ""}`} 
                >
                  Unhealthy (151-200)
                </div>
                <div 
                  className={`aqiScaleBox aqiScaleOrangeColor ${data.color === "orange" ? "blueBorder" : ""}`} 
                >
                  Unhealthy for Sensitive Groups (101-150)
                </div>
                <div 
                  className={`aqiScaleBox aqiScaleYellowColor ${data.color === "yellow" ? "blueBorder" : ""}`} 
                >
                  Moderate (51-100)
                </div>
                <div 
                  className={`aqiScaleBox aqiScaleGreenColor ${data.color === "green" ? "blueBorder" : ""}`} 
                >
                  Good (0-50)
                </div>
              </div>
            </div>
          ))}
        </div>}
      </>
    </div>
  )
}

export default App
