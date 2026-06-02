import { useState, useEffect } from 'react'

function App() {
  const [meals, setMeals] = useState([]);
  const [status, setStatus] = useState("idle");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMeals() {
      try {
        setStatus("loading")
        const response = await fetch(
          'https://api.freeapi.app/api/v1/public/meals',
          { signal: controller.signal }
        );
        const data = await response.json();
        setMeals(data.data.data);
        setStatus("Success")
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          setStatus("error")
        }
      }
    }
    loadMeals();

    return () => {
      controller.abort();
    }
  }, [])

  return (
    <>
    
      <div className="flex justify-center gap-2">
        <section className="left">
          <div className="cards grid grid-cols-4 p-5 m-5 gap-5">
              {meals.map((meal) => (
                <div>
                  <div onClick={() => setSelectedMeal(meal)} key={meal.idMeal} className="flex flex-col justify-center items-center cursor-pointer">
                    <img width={150} src={meal.strMealThumb}/>
                    <p>{meal.strMeal}</p>
                  </div>
                </div>
              ))}
          </div>

          <div>
            <div>
              {selectedMeal && (
                    <div className="meal-details flex flex-col justify-center items-center gap-5 p-5 m-5">
                      <div className="image">
                        <img src={selectedMeal.strMealThumb} alt="" />
                      </div>
                      <div className="content flex flex-col gap-2">
                        <h2>Name : {selectedMeal.strMeal}</h2>
                        <p>Category : {selectedMeal.strCategory}</p>
                        <p>Area : {selectedMeal.strArea}</p>
                        <div>
                          <h3>Instruction: </h3>
                          <p>{selectedMeal.strInstructions}</p>
                        </div>
                        <p>Tags: {selectedMeal.strTags}</p>
                        <table className="table-auto border-collapse border border-slate-400">
                          <thead>
                            <tr>
                              <th>Ingredient</th>
                              <th>Measure</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(selectedMeal).map(([key, value]) => {
                              if (key.startsWith("strIngredient") && value) {
                                const measureKey = key.replace("strIngredient", "strMeasure");
                                const measure = selectedMeal[measureKey];
                                return (
                                  <tr key={key}>
                                    <td>{value}</td>
                                    <td>{measure}</td>
                                  </tr>
                                );
                              }
                              return null;
                            })}
                          </tbody>
                        </table>
                        <p>Youtube: {selectedMeal.strYoutube}</p>
                      </div>
                    </div>
                )}
                </div>
          </div>
        </section>

        <section>

        </section>
      </div>
    </>
  )
}

export default App
