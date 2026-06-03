import { useState, useEffect } from 'react'

function App() {

  const [joke, setJoke] = useState(null)
  const [status, setStatus] = useState("idle")

  async function loadJoke() {

    try {

      setStatus("loading")

      const response = await fetch(
        "https://api.freeapi.app/api/v1/public/randomjokes/joke/random"
      )

      const data = await response.json()

      setJoke(data.data)

      setStatus("success")

    } catch (error) {

      console.log(error)
      setStatus("error")

    }
  }

  useEffect(() => {
    loadJoke()
  }, [])

  return (
    <div>

      <h1>Random Joke Generator </h1>

      {status === "loading" && <p>Loading...</p>}

      {status === "error" && <p>Error loading joke</p>}

      {joke && (
        <p>{joke.content}</p>
      )}

      <button className="btn btn-primary p-2 m-2 border border-white" onClick={loadJoke}>
        New Joke
      </button>

    </div>
  )
}

export default App