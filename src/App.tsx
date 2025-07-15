import { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [id, setId] = useState(Number())

  //Variablen für Filter
  const [filter, setFilter] = useState("")
  const [kategorieFilter, setKategorieFilter] = useState("")
  const [favFilter, setFavFilter] = useState("no")
  const [enabledFilter, setEnabledFilter] = useState("disabled")

  //Variablen für den User
  const [user, setUser] = useState("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!user) return

      fetch(`http://192.168.178.108:3001/users/${user}/items`)
        .then(response => response.json())
        .then(jsonData => setListe(jsonData))
        .catch(error => setListe([]));
    }, 1000)
    return () => clearInterval(intervalId);
  }, [user, liste]);


  return (
    <div>
      <> {/* Text */}
        <h1>Einkaufsliste</h1>
      </>

      <> {/* User Eingabe */}
        <TextField id="outlined-basic" label="User" variant="outlined" type="number" value={user} onChange={(e) => setUser(e.target.value)} />
      </>

      <> {/* Neue Artikel hinzufügen */}
        <br /><br /><br />
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <TextField id="outlined-basic" label="Artikel" variant="outlined" type="text" value={artikel} onChange={(e) => {
            const maxArtikel = e.target.value
            if (maxArtikel.length <= 30) {
              setArtikel(maxArtikel)
            }
          }} />
          <TextField id="outlined-basic" label="Menge" helperText="Bei keiner Eingabe ist die Menge 1" variant="outlined" type="number" value={menge} onChange={(e) => setMenge(e.target.value)} />
          <TextField id="outlined-basic" label="Kategorie (optional)" variant="outlined" type="text" value={kategorie} onChange={(e) => setKategorie(e.target.value)} />
          <Fab sx={{ backgroundColor: 'lime' }} onClick={() => {
            const maxId = Math.max(...liste.map(item => item.id), 0) + 1
            const neuerArtikel = { artikel: artikel, menge: menge === "" ? 1 : Number(menge), id: maxId, status: "undone", kategorie: kategorie === "" ? "" : kategorie, fav: "no" }
            fetch(`http://192.168.178.108:3001/users/${user}/items`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(neuerArtikel)
            })
            setListe([...liste, neuerArtikel])
            setId(maxId)
            setArtikel("")
            setMenge("")
            setKategorie("")
          }}><AddIcon /></Fab>
        </Box>
      </>

      <> {/* Nach Artikeln filtern */}
        <br />
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab sx={{ backgroundColor: enabledFilter === "enabled" ? 'lime' : 'default' }} onClick={() => {
            if (enabledFilter === "enabled") {
              setEnabledFilter("disabled")
              setFilter("")
              setKategorieFilter("")
              setFavFilter("no")
            } else setEnabledFilter("enabled")
          }}><FilterAltIcon /></Fab>
          {enabledFilter === "disabled" ? "" : <TextField id="outlined-basic" label="Filter nach Artikel" variant="outlined" type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />}
          {enabledFilter === "disabled" ? "" : <TextField id="outlined-basic" label="Filter nach Kategorie" variant="outlined" type="text" value={kategorieFilter} onChange={(e) => setKategorieFilter(e.target.value)} />}
          {enabledFilter === "disabled" ? "" : <Fab sx={{ backgroundColor: favFilter === "yes" ? 'yellow' : 'default' }} onClick={() => { favFilter === "no" ? setFavFilter("yes") : setFavFilter("no") }}><StarIcon /></Fab>}
        </Box>
      </>

      <> {/* Anzeige in Form einer Tabelle */}
        <br /><br />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#dac5c5ff" }}>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Favoritisieren</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Artikel</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Menge</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Kategorie</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Status</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Löschen</td>
            </tr>
          </thead>
          <tbody>
            {liste.filter(item => item.artikel.includes(filter)).filter(item => item.kategorie.includes(kategorieFilter)).filter(item => favFilter === "yes" ? item.fav === "yes" : true).sort((a, b) => {
              if (a.status !== b.status) {
                return a.status === "undone" ? -1 : 1;
              }
              if (a.fav !== b.fav) {
                return a.fav === "yes" ? -1 : 1;
              }
              return 0;
            }).map((item, index) => (
              <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "white" }}>
                <td style={{ textAlign: "center", padding: "8px", width: "5%", border: '1px solid black' }}><Fab sx={{ backgroundColor: item.fav === "yes" ? 'yellow' : 'default' }} onClick={() => {
                  const neuerArtikel = { artikel: item.artikel, menge: item.menge, status: item.status, kategorie: item.kategorie, fav: item.fav === "yes" ? "no" : "yes" }
                  fetch(`http://192.168.178.108:3001/users/${user}/items/${item.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(neuerArtikel)
                  })
                    .then(res => res.json())
                    .then(updated => { setListe(prev => prev.map(produkt => produkt.id === updated.id ? updated : produkt)) })
                }}>{item.fav === "yes" ?<StarIcon /> : ""}</Fab></td>
                <td style={{ textAlign: "center", padding: "8px", border: '1px solid black' }}>{item.artikel}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "10%", border: '1px solid black' }}>{item.menge}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "20%", border: '1px solid black' }}>{item.kategorie}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "10%", border: '1px solid black' }}><Fab sx={{ backgroundColor: item.status === "done" ? 'lime' : 'default' }} variant="extended" onClick={() => {
                  const neuerArtikel = { artikel: item.artikel, menge: item.menge, status: item.status === "done" ? "undone" : "done", kategorie: item.kategorie, fav: item.fav }
                  fetch(`http://192.168.178.108:3001/users/${user}/items/${item.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(neuerArtikel)
                  })
                    .then(res => res.json())
                    .then(updated => { setListe(prev => prev.map(produkt => produkt.id === updated.id ? updated : produkt)) })
                }}>{item.status === "undone" ? "Ausstehend" : "Erledigt"}</Fab></td>
                <td style={{ textAlign: "center", padding: "8px", width: "5%", border: '1px solid black' }}><Fab sx={{ backgroundColor: "red" }} onClick={() => {
                  fetch(`http://192.168.178.108:3001/users/${user}/items/${item.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                  })
                  setListe(prev => prev.filter(produkt => produkt.id !== item.id))
                }}><DeleteIcon /></Fab></td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
}