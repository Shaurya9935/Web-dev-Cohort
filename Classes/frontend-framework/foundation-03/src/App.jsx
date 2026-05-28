import AvatarCard from "./components/AvatarCard.jsx"




const avatars = [
  {
    id: 1,
    name: "Nova",
    role: "Navigator",
    power: "Routing",
    initials: "NV",
  },
  {
    id: 2,
    name: "Flux",
    role: "State Keeper",
    power: "useState",
    initials: "FX",
  },
  {
    id: 3,
    name: "Memo",
    role: "Optimizer",
    power: "Memoization",
    initials: "MM",
  },
];

function Shell({title, children}) {
  return(
    <section>
      <p>Reusable Shell</p>
      <h2>{title}</h2>
      {children}
    </section>
  )
}



function App() {

  return (
    <>
      <h1>Hello from Shaurya</h1>
      <section>
        {avatars.map((avatar) => (
          <AvatarCard 
          level = {avatar.id === 1 ? "Captain": undefined }
          avatar={avatar} 
          />
        ))}
      </section>
    </>
  )
}

export default App
