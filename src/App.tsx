import { useState } from 'react'

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
  const [id, setId] = useState(1)

  //Variablen für Filter
  const [filter, setFilter] = useState("")
  const [kategorieFilter, setKategorieFilter] = useState("")
  const [favFilter, setFavFilter] = useState("no")
  const [enabledFilter, setEnabledFilter] = useState("disabled")

  return (
    <div>
      <> {/* Text */}
        <h1>Einkaufsliste</h1>
      </>

      <> {/* Neue Artikel hinzufügen */}
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
            setListe([...liste, { artikel: artikel, menge: menge === "" ? 1 : Number(menge), id: id, status: "undone", kategorie: kategorie === "" ? "" : kategorie, fav: "no" }])
            setId(prevId => prevId + 1)
            setArtikel("")
            setMenge("")
            setKategorie("")
          }}><AddIcon /></Fab>
        </Box>
      </>

      <> {/* Nach Artikeln filtern */}
      <br />
        <Box sx={{ '& > :not(style)': { m: 1 } }}>
          <Fab sx={{ backgroundColor: enabledFilter === "enabled" ? 'lime' : 'default'}} onClick={() => {
            if (enabledFilter === "enabled") {
              setEnabledFilter("disabled")
              setFilter("")
              setKategorieFilter("")
              setFavFilter("no")
            } else setEnabledFilter("enabled")
          }}><FilterAltIcon /></Fab>
          {enabledFilter === "disabled" ? "" : <TextField id="outlined-basic" label="Filter nach Artikel" variant="outlined" type="text" value={filter} onChange={(e) => setFilter(e.target.value)} />}
          {enabledFilter === "disabled" ? "" : <TextField id="outlined-basic" label="Filter nach Kategorie" variant="outlined" type="text" value={kategorieFilter} onChange={(e) => setKategorieFilter(e.target.value)} />}
          {enabledFilter === "disabled" ? "" : <Fab sx={{ backgroundColor: favFilter === "yes" ? 'yellow' : 'default'}} onClick={() => { favFilter === "no" ? setFavFilter("yes") : setFavFilter("no") }}><StarIcon /></Fab>}
        </Box>
      </>

      <> {/* Anzeige in Form einer Tabelle */}
        <br /><br />
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#dac5c5ff" }}>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black'}}>Favoritisieren</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Artikel</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Menge</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Kategorie</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Status</td>
              <td style={{ textAlign: "center", padding: "8px", border: '2px solid black' }}>Löschen</td>
            </tr>
          </thead>
          <tbody>
            {liste.filter(item => item.artikel.includes(filter)).filter(item => item.kategorie.includes(kategorieFilter)).filter(item => favFilter === "yes" ? item.fav === "yes" : true).sort((a, b) => (a.status === "done" ? 1 : -1)).map(item => (
              <tr key={item.id}>
                <td style={{ textAlign: "center", padding: "8px", width: "5%", border: '1px solid black' }}><Fab sx={{ backgroundColor: item.fav === "yes" ? 'yellow' : 'default'}}onClick={() => {
                  const updateFav = liste.map((produkt) => (
                    produkt.id === item.id ? { ...produkt, fav: produkt.fav === "no" ? "yes" : "no" } : produkt
                  ))
                  setListe(updateFav)
                }}><StarIcon /></Fab></td>
                <td style={{ textAlign: "center", padding: "8px", border: '1px solid black' }}>{item.artikel}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "10%", border: '1px solid black' }}>{item.menge}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "20%", border: '1px solid black' }}>{item.kategorie}</td>
                <td style={{ textAlign: "center", padding: "8px", width: "10%", border: '1px solid black' }}><Fab sx={{ backgroundColor: item.status === "done" ? 'lime' : 'default' }} variant = "extended" onClick={() => {
                  setListe(prevListe => prevListe.map(artikel => artikel.id === item.id ? { ...artikel, status: artikel.status === "done" ? "undone" : "done" } : artikel))
                }}>{item.status === "undone" ? "Ausstehend" : "Erledigt"}</Fab></td>
                <td style={{ textAlign: "center", padding: "8px", width: "5%", border: '1px solid black' }}><Fab sx={{ backgroundColor: "red" }} onClick={() => {
                  setListe(prevListe => prevListe.filter(artikel => artikel.id !== item.id))
                }}><DeleteIcon /></Fab></td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    </div>
  );
}