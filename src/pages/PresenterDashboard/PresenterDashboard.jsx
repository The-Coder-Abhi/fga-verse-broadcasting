import React, { useState, useEffect, useCallback } from "react";
import { parseBibleXML } from "../../utils/bibleParser";
import { ref, set } from "firebase/database";
import { db } from "../../services/firebase"; 
import "./PresenterDashboard.css";

const PresenterDashboard = () => {
  const [bibles, setBibles] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Navigation State
  const [activeBookId, setActiveBookId] = useState("1");
  const [activeChapterId, setActiveChapterId] = useState("1");
  const [selectedVerseIndex, setSelectedVerseIndex] = useState(0);

  // UI State
  const [versionA, setVersionA] = useState("HIN");
  const [versionB, setVersionB] = useState("KJV");
  const [indexVersion, setIndexVersion] = useState("KJV"); 
  const [searchQuery, setSearchQuery] = useState("");

  const [pinnedVerses, setPinnedVerses] = useState([]);

  useEffect(() => {
    const loadBibles = async () => {
      setIsLoading(true);
      try {
        const baseUrl = process.env.PUBLIC_URL || "";
        const versionRes = await fetch(`${baseUrl}/bibles/version.json`);
        const versionData = versionRes.ok ? await versionRes.json() : { version: [] };

        const loadedBibles = {};

        try {
          const resKjv = await fetch(`${baseUrl}/bibles/kjv.xml`);
          if (resKjv.ok) {
            const xml = await resKjv.text();
            const bookNames = versionData.version.find((v) => v.name === "English (KJV)")?.booknames || [];
            loadedBibles["KJV"] = { id: "KJV", name: "English (KJV)", data: parseBibleXML(xml, bookNames) };
          }
        } catch (e) { console.error("KJV Load Error:", e); }

        try {
          const resHin = await fetch(`${baseUrl}/bibles/hindiov.xml`);
          if (resHin.ok) {
            const xml = await resHin.text();
            const bookNames = versionData.version.find((v) => v.name === "New Bible")?.booknames || [];
            loadedBibles["HIN"] = { id: "HIN", name: "Hindi (BSI/OV)", data: parseBibleXML(xml, bookNames) };
          }
        } catch (e) { console.error("Hindi Load Error:", e); }

        setBibles(loadedBibles);
      } catch (error) {
        console.error("Master Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBibles();
  }, []);

  const activeChapterDataA = bibles[versionA]?.data?.[activeBookId]?.chapters?.[activeChapterId] || [];
  const activeChapterDataB = bibles[versionB]?.data?.[activeBookId]?.chapters?.[activeChapterId] || [];
  
  const getBilingualBookName = useCallback((bookId) => {
    const nameA = bibles[versionA]?.data?.[bookId]?.name;
    const nameB = versionB !== "NONE" ? bibles[versionB]?.data?.[bookId]?.name : null;
    
    if (nameA && nameB && nameA !== nameB) {
      return `${nameA} (${nameB})`;
    }
    return nameA || "Unknown";
  }, [bibles, versionA, versionB]);

  useEffect(() => {
    if (selectedVerseIndex === -1) return;
    const selectedEl = document.getElementById(`verse-card-${selectedVerseIndex}`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedVerseIndex, activeBookId, activeChapterId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (!activeChapterDataA.length) return;

      if (e.key === "ArrowRight") {
        setSelectedVerseIndex((prevIndex) => {
          let nextIndex = prevIndex === -1 ? 0 : prevIndex + 1;
          while (nextIndex < activeChapterDataA.length && activeChapterDataA[nextIndex].type === "caption") {
            nextIndex++;
          }
          return nextIndex < activeChapterDataA.length ? nextIndex : prevIndex;
        });
      } else if (e.key === "ArrowLeft") {
        setSelectedVerseIndex((prevIndex) => {
          if (prevIndex === -1) return -1;
          let nextIndex = prevIndex - 1;
          while (nextIndex >= 0 && activeChapterDataA[nextIndex].type === "caption") {
            nextIndex--;
          }
          return nextIndex >= 0 ? nextIndex : prevIndex;
        });
      }
    },
    [activeChapterDataA],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleBlankScreen = async () => {
    try {
      await set(ref(db, 'live_presentation'), {
        title: "Blank",
        body1: "Blank", 
        body2: "",
        type: "bible"
      });
      // Clear the local selection so clicking the same verse re-triggers the sync
      setSelectedVerseIndex(-1);
    } catch (error) {
      console.error("Firebase Blank Error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const match = searchQuery.trim().match(/^(.*?)\s+(\d+)(?:\s+(\d+))?$/);

    if (!match) {
      alert("Please use the format: [Book] [Chapter] [Verse] (e.g., rev 11 1)");
      return;
    }

    const bookQuery = match[1].toLowerCase();
    const chapterQuery = match[2];
    const verseQuery = match[3] || "1";

    const referenceBible = bibles["KJV"]?.data || bibles[versionA]?.data;
    if (!referenceBible) return;

    let foundBookId = null;

    for (const [id, book] of Object.entries(referenceBible)) {
      if (book.name.toLowerCase().startsWith(bookQuery)) {
        foundBookId = id;
        break;
      }
    }

    if (foundBookId) {
      const chapterData = referenceBible[foundBookId].chapters[chapterQuery];
      if (chapterData) {
        const vIndex = chapterData.findIndex((v) => v.id === verseQuery && v.type === "verse");
        if (vIndex !== -1) {
          setActiveBookId(foundBookId);
          setActiveChapterId(chapterQuery);
          setSelectedVerseIndex(vIndex);
          setSearchQuery("");
        } else {
          alert(`Verse ${verseQuery} not found in Chapter ${chapterQuery}`);
        }
      } else {
        alert(`Chapter ${chapterQuery} not found in ${referenceBible[foundBookId].name}`);
      }
    } else {
      alert(`Book matching "${bookQuery}" not found.`);
    }
  };

  const currentItemA = activeChapterDataA[selectedVerseIndex];
  const currentItemB = versionB !== "NONE" && currentItemA
    ? activeChapterDataB.find((v) => v.id === currentItemA.id && v.type === currentItemA.type)
    : null;

  const isCurrentlyPinned = pinnedVerses.some(
    (v) => v.bookId === activeBookId && v.chapterId === activeChapterId && v.verseIndex === selectedVerseIndex
  );

  const handleTogglePin = () => {
    if (selectedVerseIndex === -1) return; // Prevent pinning a blank screen

    if (isCurrentlyPinned) {
      setPinnedVerses((prev) => prev.filter(
        (v) => !(v.bookId === activeBookId && v.chapterId === activeChapterId && v.verseIndex === selectedVerseIndex)
      ));
    } else {
      const bilingualRef = currentItemA?.type === "verse" 
        ? `${getBilingualBookName(activeBookId)} ${activeChapterId}:${currentItemA.id}`
        : currentItemA?.ref;

      setPinnedVerses((prev) => [...prev, {
        bookId: activeBookId,
        chapterId: activeChapterId,
        verseIndex: selectedVerseIndex,
        ref: bilingualRef
      }]);
    }
  };

  useEffect(() => {
    if (!currentItemA) return;

    const syncToFirebase = async () => {
      try {
        let displayTitle = currentItemA.ref;
        if (currentItemA.type === "verse") {
          displayTitle = `${getBilingualBookName(activeBookId)} ${activeChapterId}:${currentItemA.id}`;
        }

        const payload = {
          title: displayTitle,
          body1: currentItemA.text, 
          body2: currentItemB ? currentItemB.text : "",
          type: "bible"
        };
        await set(ref(db, 'live_presentation'), payload);
      } catch (error) {
        console.error("Firebase Sync Error:", error);
      }
    };
    syncToFirebase();
  }, [currentItemA, currentItemB, activeBookId, activeChapterId, getBilingualBookName]);

  if (isLoading || Object.keys(bibles).length === 0) {
    return (
      <div className="presenter-theme dashboard-container flex items-center justify-center">
        <div className="text-2xl font-bold text-[#0ab7ea] animate-pulse">
          Loading Bible Databases...
        </div>
      </div>
    );
  }

  // Derive the bilingual title for the Live Preview Header
  const previewTitle = currentItemA 
    ? (currentItemA.type === "verse" 
        ? `${getBilingualBookName(activeBookId)} ${activeChapterId}:${currentItemA.id}`
        : `${getBilingualBookName(activeBookId)} ${activeChapterId} (Caption)`)
    : "Screen Blanked";

  return (
    <div className="presenter-theme dashboard-container">
      <header className="top-navbar">
        <div className="brand-title">Verse Controller</div>
        
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Shortcut search (e.g., rev 11 1)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>

        <div className="header-actions" style={{ flex: 1, justifyContent: 'flex-end', overflow: 'hidden' }}>
          {pinnedVerses.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingRight: '1rem', alignItems: 'center' }}>
              {pinnedVerses.map((pv) => {
                const isActivePin = pv.bookId === activeBookId && pv.chapterId === activeChapterId && pv.verseIndex === selectedVerseIndex;
                return (
                  <button 
                    key={`${pv.bookId}-${pv.chapterId}-${pv.verseIndex}`}
                    className="btn-pin" 
                    style={{ 
                      backgroundColor: isActivePin ? 'var(--accent-blue)' : 'var(--accent-blue-transparent)', 
                      borderColor: 'var(--accent-blue)', 
                      color: isActivePin ? '#ffffff' : 'var(--accent-blue)',
                      whiteSpace: 'nowrap'
                    }}
                    onClick={() => {
                      setActiveBookId(pv.bookId);
                      setActiveChapterId(pv.chapterId);
                      setSelectedVerseIndex(pv.verseIndex);
                    }}
                  >
                    {pv.ref}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={handleTogglePin} className="btn-pin" style={{ whiteSpace: 'nowrap', opacity: selectedVerseIndex === -1 ? 0.5 : 1 }}>
            <svg className="icon-pin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            {isCurrentlyPinned ? "Unpin" : "Pin"}
          </button>
          <button onClick={handleBlankScreen} className="btn-blank">
            BLANK
          </button>
        </div>
      </header>

      <div className="main-layout">
        <aside className="sidebar-index">
          <div className="sidebar-nav-header">
            <select
              value={indexVersion}
              onChange={(e) => setIndexVersion(e.target.value)}
              className="nav-select"
            >
              {Object.values(bibles).map((b) => (
                <option key={b.id} value={b.id}>
                  Index Language: {b.name}
                </option>
              ))}
            </select>

            <select
              value={activeBookId}
              onChange={(e) => {
                setActiveBookId(e.target.value);
                setActiveChapterId("1");
                setSelectedVerseIndex(0);
              }}
              className="nav-select"
            >
              {Object.keys(bibles[versionA]?.data || {}).map((id) => {
                const bookName = bibles[indexVersion]?.data?.[id]?.name || bibles[versionA]?.data?.[id]?.name;
                return (
                  <option key={id} value={id}>
                    {bookName}
                  </option>
                );
              })}
            </select>

            <select
              value={activeChapterId}
              onChange={(e) => {
                setActiveChapterId(e.target.value);
                setSelectedVerseIndex(0);
              }}
              className="nav-select"
            >
              {Object.keys(bibles[versionA]?.data?.[activeBookId]?.chapters || {}).map((id) => (
                <option key={id} value={id}>
                  Chapter {id}
                </option>
              ))}
            </select>
          </div>

          <div className="verse-list">
            {activeChapterDataA.map((item, index) => {
              const indexItem = indexVersion === versionA
                ? item
                : bibles[indexVersion]?.data?.[activeBookId]?.chapters?.[activeChapterId]?.find(
                    (v) => v.id === item.id && v.type === item.type
                  );

              const displayText = indexItem ? indexItem.text : (item.text || "...");

              return (
                <button
                  key={`${item.type}-${item.id}`}
                  onClick={() => setSelectedVerseIndex(index)}
                  className={`verse-btn ${selectedVerseIndex === index ? "active" : ""}`}
                  style={item.type === "caption" ? { fontStyle: "italic", opacity: 0.8 } : {}}
                >
                  <span className="verse-id">
                    {item.type === "verse" ? `v${item.id}` : "Cap"}
                  </span>
                  <span className="verse-preview">{displayText}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="preview-area">
          <div className="preview-header">
            <h2>
              Live Preview: <span>{previewTitle}</span>
            </h2>
          </div>

          <div className="dropdown-container">
            <select
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
              className="version-select"
            >
              {Object.values(bibles).map((b) => (
                <option key={b.id} value={b.id}>
                  Translation A ({b.name})
                </option>
              ))}
            </select>
            <select
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
              className="version-select"
            >
              <option value="NONE">None</option>
              {Object.values(bibles).map((b) => (
                <option key={b.id} value={b.id}>
                  Translation B ({b.name})
                </option>
              ))}
            </select>
          </div>

          <div className={`verses-grid ${versionB === "NONE" ? "single-column" : ""}`}>
            {activeChapterDataA.map((itemA, index) => {
              const itemB = versionB !== "NONE"
                ? activeChapterDataB.find((v) => v.id === itemA.id && v.type === itemA.type)
                : null;
              const isSelected = selectedVerseIndex === index;

              return (
                <React.Fragment key={`${itemA.type}-${itemA.id}`}>
                  <div
                    id={versionB === "NONE" ? `verse-card-${index}` : undefined}
                    className={`verse-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedVerseIndex(index)}
                  >
                    <div
                      className="verse-text"
                      style={itemA.type === "caption" ? { color: "#0ab7ea", fontWeight: "bold" } : {}}
                    >
                      {itemA.type === "verse" && <sup className="verse-number">{itemA.id}</sup>}
                      {itemA.text}
                    </div>
                  </div>

                  {versionB !== "NONE" && (
                    <div
                      id={`verse-card-${index}`}
                      className={`verse-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedVerseIndex(index)}
                    >
                      {itemB ? (
                        <div
                          className="verse-text"
                          style={itemB.type === "caption" ? { color: "#0ab7ea", fontWeight: "bold" } : {}}
                        >
                          {itemB.type === "verse" && <sup className="verse-number">{itemB.id}</sup>}
                          {itemB.text}
                        </div>
                      ) : (
                        <div className="verse-text" style={{ fontStyle: "italic", opacity: 0.5 }}>
                          No matching text
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PresenterDashboard;