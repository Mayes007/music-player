import { useEffect, useState } from "react";
import pb from "./pocketbase";

function App() {
  const [songs, setSongs] = useState([]);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  // Fetch songs
  const fetchSongs = async () => {
    const records = await pb.collection("songs").getFullList();
    setSongs(records);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  // Upload song
 const handleUpload = async () => {
  if (!file) {
    alert("Select a file first!");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("artist", artist);
  formData.append("audio", file);

  try {
    await pb.collection("songs").create(formData);
    fetchSongs();
  } catch (err) {
    console.log(err.response);
  }
};

  // Delete song
  const deleteSong = async (id) => {
    await pb.collection("songs").delete(id);
    fetchSongs();
  };

  return (
    <div style={{ padding: "20px", background: "#121212", color: "white", minHeight: "100vh" }}>
      <h1>🎵 Music Player Manager</h1>

      {/* Upload Form */}
      <div>
        <input placeholder="title" onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="artist" onChange={(e) => setArtist(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <hr />

      {/* Song List */}
      {songs.map((song) => (
        <div key={song.id} style={{ marginBottom: "20px" }}>
          <h3>{song.title} - {song.artist}</h3>

          <audio controls
            src={pb.files.getUrl(song, song.audio)}
          />

          <br />
          <button onClick={() => deleteSong(song.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;