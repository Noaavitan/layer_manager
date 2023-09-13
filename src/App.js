import { useState, useEffect } from "react";

const layerData = [
  {
    imdbID: "tt1375666",
    Title: "שם שכבה 1",
    inCharge: "פדם/ענף/מדור",
    Poster: `https://cdn1.vectorstock.com/i/1000x1000/50/90/layers-panel-dark-mode-glyph-ui-icon-vector-43805090.jpg`,
    Description: "השכבה נועדה ל... עבור ... ומיצצגת ...",
    entity: 148,
  },
  {
    imdbID: "tt0133093",
    Title: "שם שכבה 2",
    inCharge: "פדם/ענף/מדור",
    Poster: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYoMzNxjIqxE1kfYmxa0Diw8eNyDPooKJLwAd44XTOf9LuvcyRpQKOMIKlPDhFvp-fWx0&usqp=CAU`,
    Description: "השכבה נועדה ל... עבור ... ומיצצגת ...",
    entity: 120,
  },
  {
    imdbID: "tt6751668",
    Title: "שם שכבה 3",
    inCharge: "פדם/ענף/מדור",
    Poster: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYoMzNxjIqxE1kfYmxa0Diw8eNyDPooKJLwAd44XTOf9LuvcyRpQKOMIKlPDhFvp-fWx0&usqp=CAU`,
    Description: "השכבה נועדה ל... עבור ... ומיצצגת ...",
    entity: 18,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const sum = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur, 0);
export default function App() {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState(layerData);
  const [saved, setSaved] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const savedLayers = layerData.filter((layer) =>
    saved.some((savedLayer) => savedLayer.imdbID === layer.imdbID)
  );

  function handleSelectLayer(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseLayer() {
    setSelectedId(null);
  }

  function handleAddSaved(layer) {
    setSaved((saved) => [...saved, layer]);

    // Update the saved property for the corresponding layer in layerData
    setLayer((prevLayers) =>
      prevLayers.map((prevLayer) =>
        prevLayer.imdbID === layer.imdbID
          ? { ...prevLayer, saved: true }
          : prevLayer
      )
    );
  }

  function handleDeleteSaved(id) {
    setSaved((saved) => saved.filter((layer) => layer.imdbID !== id));

    // Update the saved property for the corresponding layer in layerData
    setLayer((prevLayers) =>
      prevLayers.map((prevLayer) =>
        prevLayer.imdbID === id ? { ...prevLayer, saved: false } : prevLayer
      )
    );
  }

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <Resulte layer={layer} />
      </Navbar>
      <Main>
        <Box>
          {selectedId ? (
            <LayerDetails
              selectedId={selectedId}
              handleCloseLayer={handleCloseLayer}
              handleAddSaved={handleAddSaved}
              saved={savedLayers}
              layer={layer}
              layerData={layerData}
            />
          ) : (
            <>
              <SavedSummary saved={saved} />
              <SavedLayerList
                saved={savedLayers}
                handleDeleteSaved={handleDeleteSaved}
              />
            </>
          )}
        </Box>
        <Box>
          <LayerList
            layer={layer}
            handleSelectLayer={handleSelectLayer}
            query={query}
          />
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return (
    <>
      {" "}
      <nav className="nav-bar">
        <Logo />
        {children}
      </nav>
    </>
  );
}

function Search({ query, setQuery }) {
  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search Layers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </>
  );
}
function Logo() {
  return (
    <>
      <div className="logo">
        <span role="img"></span>
        <h1>Geo-Data</h1>
      </div>
    </>
  );
}

function Resulte({ layer }) {
  return (
    <>
      <p className="num-results">
        נמצאו <strong>{layer?.length}</strong> שכבות
      </p>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function LayerList({ layer, handleSelectLayer, query }) {
  const filteredLayers = layer.filter((lyr) => lyr.Title.includes(query));
  return (
    <ul className="list list-layers">
      {filteredLayers?.map((lyr) => (
        <Layer
          lyr={lyr}
          key={lyr.imdbID}
          handleSelectLayer={handleSelectLayer}
        />
      ))}
    </ul>
  );
}

function Layer({ lyr, handleSelectLayer }) {
  return (
    <li onClick={() => handleSelectLayer(lyr.imdbID)}>
      <img src={lyr.Poster} alt={`${lyr.Title} poster`} />
      <h3>{lyr.Title}</h3>
      <div>
        <p>
          <span>{lyr.inCharge}</span>
          <span>| {lyr.entity} :מס ישויות</span>
        </p>
      </div>
    </li>
  );
}

function LayerDetails({
  selectedId,
  handleCloseLayer,
  handleAddSaved,
  saved,
  layerData,
}) {
  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          handleCloseLayer();
        }
      }

      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handleCloseLayer]
  );
  const isSaved = saved.map((save) => save.imdbID).includes(selectedId);

  const selectedLayer = layerData.find((layer) => layer.imdbID === selectedId);

  if (!selectedLayer) {
    // Handle the case where the selected layer is not found
    return <div>Layer not found</div>;
  }

  // Extract properties from the selected layer
  const {
    Title: title,
    Year: year,
    Poster: poster,
    inCharge: inCharge,
    entity: entity,
    Description: description,
  } = selectedLayer;

  function handleAdd() {
    const SelectedLayer = {
      imdbID: selectedId,
      title,
      year,
      poster,
      inCharge,
      entity,
      description,
    };
    handleAddSaved(SelectedLayer);
    handleCloseLayer();
  }

  return (
    <div className="details">
      <header>
        <button onClick={handleCloseLayer} className="btn-back">
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title} layer`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <h3>{inCharge}</h3>
          <h3>{entity} :מס ישויות</h3>
        </div>
      </header>
      <section>
        <p>
          <em>{description}</em>
        </p>
        <p>קישור לשכבה </p>
        <div className="rating">
          {isSaved ? (
            <h3>השכבה נשמרה ⭐️</h3>
          ) : (
            <button className="btn-add" onClick={handleAdd}>
              + שמירת שכבה
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function SavedSummary({ saved }) {
  const sumEntity = sum(saved.map((lyr) => lyr.entity));
  return (
    <div className="summary">
      <h2>שכבות שמורות</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{saved.length} שכבות</span>
        </p>

        <p>
          <span>{sumEntity} ישויות</span>
        </p>
      </div>
    </div>
  );
}

function SavedLayerList({ saved, handleDeleteSaved }) {
  return (
    <>
      <ul className="list">
        {saved.map((lyr) => (
          <SavedLayer
            lyr={lyr}
            key={lyr.imdbID}
            handleDeleteSaved={handleDeleteSaved}
          />
        ))}
      </ul>
    </>
  );
}

function SavedLayer({ lyr, handleDeleteSaved }) {
  return (
    <li key={lyr.imdbID}>
      <img src={lyr.Poster} alt={`${lyr.Title} poster`} />
      <h3>{lyr.Title}</h3>
      <div>
        <p>
          <span>{lyr.inCharge}</span>
          <span>| {lyr.entity} :מס ישויות</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => handleDeleteSaved(lyr.imdbID)}
        >
          -
        </button>
      </div>
    </li>
  );
}