import { useState, useEffect } from "react";

function App() {

  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("idle")
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const controller = new AbortController();

    async function loadUser() {
      try {
        setStatus("loading")
        const response = await fetch(
          'https://api.freeapi.app/api/v1/public/randomusers',
          { signal: controller.signal }
        );
        const data = await response.json();
        setUsers(data.data.data);
        setStatus("Success");

      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Fetch Aborted")
        } else {
          setStatus("error");
        }
      }
    }
    loadUser();

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className="min-h-screen p-8 flex gap-10 justify-center items-start text-gray-100">
      <section className="w-2/3">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-4">Users Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-center mt-5">
          {users.map((user, i) => (
            <div
              key={user.id}
              style={{ animationDelay: `${i * 80}ms` }}
              className="userlist card p-4 rounded-xl w-80 hover:shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col justify-center items-center gap-3">
              <img className="avatar" src={user.picture.medium} alt={`${user.name.first} ${user.name.last}`} />

              <h2 className="text-lg font-semibold text-gray-100">
                {user.name.first} {user.name.last}
              </h2>

              <p className="text-sm text-gray-300">{user.email}</p>

              <button className="view-btn mt-2 px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition" onClick={() => setSelectedUser(user)}>View Details</button>
            </div>
          ))}
        </div>
      </section>

      <section className="w-1/3">
        {selectedUser && (
          <div className="p-6 mt-5 rounded-xl details-panel">
            <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" src={selectedUser.picture.large} alt={`${selectedUser.name.first} ${selectedUser.name.last}`} />
            <p className="text-sm text-gray-300"><strong>Name:</strong> {selectedUser.name.title} {selectedUser.name.first} {selectedUser.name.last}</p>
            <p className="text-sm text-gray-300"><strong>Gender:</strong> {selectedUser.gender}</p>
            <p className="text-sm text-gray-300"><strong>Address:</strong> {selectedUser.location.street.number} {selectedUser.location.street.name}, {selectedUser.location.city}, {selectedUser.location.state}, {selectedUser.location.country}</p>
            <p className="text-sm text-gray-300"><strong>Age:</strong> {selectedUser.dob.age}</p>
            <p className="text-sm text-gray-300"><strong>Phone:</strong> {selectedUser.phone}</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
