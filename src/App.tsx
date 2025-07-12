import { useState } from 'react'



//Aufbau eines Produktes
interface produkt {
  artikel: string,
  menge: number,
  status: string,
  kategorie: string,
  fav: string,
  id: number,
}

export default function App() {
  //Variablen für Produkte
  const [liste, setListe] = useState<produkt[]>([])
  const [artikel, setArtikel] = useState("")
  const [menge, setMenge] = useState("")
  const [kategorie, setKategorie] = useState("")
  const [id, setId] = useState(1)

  //Variablen für Filter
  const [filter, setFilter] = useState("")
  const [kategorieFilter, setKategorieFilter] = useState("")
  const [favFilter, setFavFilter] = useState("no")
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
        <input type="number" placeholder="Menge" value={menge} onChange={(e) => setMenge(e.target.value)} />
        <input type="text" placeholder="Kategorie (optional)" value={kategorie} onChange={(e) => setKategorie(e.target.value)} />
        <button onClick={() => {
          setListe([...liste, { artikel: artikel, menge: Number(menge), id: id, status: "undone", kategorie: kategorie === "" ? "" : kategorie, fav: "no" }])
          setId(prevId => prevId + 1)
          setArtikel("")
          setMenge("")
        }}>Hinzufügen</button>
      </>

      <> {/* Nach Artikeln filtern */}
        <br /><br />
        <button onClick={() => {
          if (enabledFilter === "enabled") {
            setEnabledFilter("disabled")
            setFilter("")
            setKategorieFilter("")
            setFavFilter("no")
          } else setEnabledFilter("enabled")
        }}>{enabledFilter === "enabled" ? "Deaktiviere" : "Aktiviere"} Filter</button>
        {enabledFilter === "disabled" ? "" : <input type="text" placeholder="Filter nach Artikel" value={filter} onChange={(e) => setFilter(e.target.value)} />}
        {enabledFilter === "disabled" ? "" : <input type="text" placeholder="Filter nach Kategorie" value={kategorieFilter} onChange={(e) => setKategorieFilter(e.target.value)} />}
        {enabledFilter === "disabled" ? "" : <button onClick={() => { favFilter === "no" ? setFavFilter("yes") : setFavFilter("no") }}>⭐</button>}
      </>

      <> {/* Anzeige in Form einer Tabelle */}
        <br /><br />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#dac5c5ff" }}>
              <td style={{ textAlign: "center", padding: "8px" }}>Favoritisieren</td>
              <td style={{ textAlign: "center", padding: "8px" }}>Artikel</td>
              <td style={{ textAlign: "center", padding: "8px" }}>Menge</td>
              <td style={{ textAlign: "center", padding: "8px" }}>Kategorie</td>
              <td style={{ textAlign: "center", padding: "8px" }}>Status</td>
              <td style={{ textAlign: "center", padding: "8px" }}>Löschen</td>
            </tr>
          </thead>
          <tbody>
            {liste.filter(item => item.artikel.includes(filter)).filter(item => item.kategorie.includes(kategorieFilter)).filter(item => favFilter === "yes" ? item.fav === "yes" : true).sort((a, b) => (a.status === "done" ? 1 : -1)).map(item => (
              <tr key={item.id}>
                <td style={{ textAlign: "center", padding: "8px" }}><button onClick={() => {
                  const updateFav = liste.map((produkt) => (
                    produkt.id === item.id ? { ...produkt, fav: produkt.fav === "no" ? "yes" : "no" } : produkt
                  ))
                  setListe(updateFav)
                }}>{item.fav === "no" ? "" : "⭐"}</button></td>
                <td style={{ textAlign: "center", padding: "8px" }}>{item.artikel}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{item.menge}</td>
                <td style={{ textAlign: "center", padding: "8px" }}>{item.kategorie}</td>
                <td style={{ textAlign: "center", padding: "8px" }}><button onClick={() => {
                  setListe(prevListe => prevListe.map(artikel => artikel.id === item.id ? { ...artikel, status: artikel.status === "done" ? "undone" : "done" } : artikel))
                }}>{item.status === "undone" ? "Ausstehend" : "Erledigt"}</button></td>
                <td style={{ textAlign: "center", padding: "8px" }}><button onClick={() => {
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