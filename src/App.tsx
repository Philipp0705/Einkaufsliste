import { useState } from 'react'


//Aufbau eines Produktes
interface produkt {
  artikel: string,
  menge: number,
  status: string,
  id: number,
}

export default function App() {
  //Variablen für Produkte
  const [liste, setListe] = useState<produkt[]>([])
  const [artikel, setArtikel] = useState("")
  const [menge, setMenge] = useState("")
  const [id, setId] = useState(1)

  //Variablen für Filter
  const [filter, setFilter] = useState("")
  const [enabledFilter, setEnabledFilter] = useState("disabled")

  return (
    <div>
      <> {/* Neue Artikel hinzufügen */}
        <input type="text" placeholder="Artikel" value={artikel} onChange={(e) => {
          const maxArtikel = e.target.value
          if (maxArtikel.length <= 30) {
            setArtikel(maxArtikel)
          }
        }} />
        <input type="Number" placeholder="Menge" value={menge} onChange={(e) => setMenge(e.target.value)} />
        <button onClick={() => {
          const neuesProdukt = { artikel: artikel, menge: Number(menge), id: id, status: "undone" }
          setListe([...liste, neuesProdukt])
          setId(prevId => prevId + 1)
        }}>Hinzufügen</button>
      </>

      <> {/* Nach Artikeln filtern */}
        <br /><br />
        <button onClick={() => enabledFilter === "enabled" ? setEnabledFilter("disabled") : setEnabledFilter("enabled")}>{enabledFilter === "enabled" ? "Deaktiviere" : "Aktiviere"} Filter</button>
        {enabledFilter === "disabled" ? "" : <input type="text" placeholder="Filter nach Artikel" value={filter} onChange={(e) => setFilter(e.target.value)} />}
      </>

      <> {/* Anzeige in Form einer Tabelle */}
        <br /><br />
        <table>
          <thead>
            <tr>
              <td>Artikel</td>
              <td>Menge</td>
              <td>Status</td>
              <td>Löschen</td>
            </tr>
          </thead>
          <tbody>
            {liste.filter(item => item.artikel.includes(filter)).sort((a, b) => (a.status === "done" ? 1 : -1)).map(item => (
              <tr key={item.id}>
                <td>{item.artikel}</td>
                <td>{item.menge}</td>
                <td><button onClick={() => {
                  setListe(prevListe => prevListe.map(artikel => artikel.id === item.id ? { ...artikel, status: artikel.status === "done" ? "undone" : "done" } : artikel))
                }}>{item.status === "undone" ? "Ausstehend" : "Erledigt"}</button></td>
                <td><button onClick={() => {
                  setListe(prevListe => prevListe.filter(artikel => artikel.id !== item.id))
                }}>Löschen</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
}