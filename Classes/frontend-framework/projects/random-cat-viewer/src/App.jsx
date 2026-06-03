import { useState,useEffect } from 'react'

function App() {
  const [cats, setCats] = useState(null)
  const [status, setStatus] = useState("idle")


  useEffect (() => {
    const controller = new AbortController();

    async function loadCats() {
      try{
        setStatus("loading")
        const response = await fetch("https://api.freeapi.app/api/v1/public/cats/cat/random",
          {signal: controller.signal}
        );
        const data = await response.json();
        setCats(data.data);
        setStatus("Success");
      } catch(error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setStatus("error")
        }
      }
    }
    loadCats();
  },[])

  return (
    <>
      <div>
        {cats && (
          <img src={cats.image} alt={cats.name} />
        )}
      </div>
    </>
  )
}

export default App
