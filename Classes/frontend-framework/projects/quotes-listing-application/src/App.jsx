import { useState, useEffect } from 'react'


function App() {

  const [quotes, setQuotes] = useState(null);
  const [status, setStatus] = useState("idle");


  async function loadQuotes() {

    try {
      setStatus("loading");
      const response = await fetch("https://api.freeapi.app/api/v1/public/quotes/quote/random");
      const data = await response.json()
      setStatus("success")
      setQuotes(data.data);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch Aborted")
      } else {
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    loadQuotes();
  }, [])



  return (
    <>
    <div className="flex flex-col justify-center items-center"> 
    <h1>Random Quote Generator </h1>

      {status === "loading" && <p>Loading...</p>}

      {status === "error" && <p>Error loading joke</p>}

      {quotes && (
        <div className="w-2/3 p-4 m-4 border border-amber-100">
          <p className="font-bold text-3xl">{quotes.content}</p>
          <p className="text-sm pt-5"> - by {quotes.author}</p>
        </div>
      )}

      <button className="btn btn-primary p-2 m-2 border border-white" onClick={loadQuotes}>
        New quote
      </button>
      </div>
    </>
  )
}

export default App
