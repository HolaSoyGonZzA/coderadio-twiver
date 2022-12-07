import { useState } from "react";
import NchanSubscriber from "nchan";
import { useEffect } from "react";

import "./App.css";

const SUB = new NchanSubscriber(
  "wss://coderadio-admin.freecodecamp.org/api/live/nowplaying/coderadio"
);

function App() {
  const [currentSong, setCurrentSong] = useState({});
  const [style, setStyle] = useState({});

  useEffect(() => {
    SUB.on("message", (message) => {
      const np = JSON.parse(message);
      // We only need to update the metadata if the song has been changed
      if (np.now_playing.song.id !== currentSong.id) {
        setCurrentSong(np.now_playing.song);
      }
    });
    SUB.reconnectTimeout = 1000;
    if (!SUB.running) {
      SUB.start();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("color"))
      setStyle((prev) => ({ ...prev, color: params.get("color") }));
  }, []);

  return (
    <div className="twiver">
      <div className="player">
        <div
          className="art"
          style={{
            backgroundImage: `url(${currentSong.art})`,
          }}
        ></div>
        <div className="meta" style={style}>
          <div className="title">{currentSong.title}</div>
          <div className="artist">{currentSong.artist}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
