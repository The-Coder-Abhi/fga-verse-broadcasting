/**
 * Parses VerseView XML and maps it to the book names from version.json.
 * Features an automatic fallback to forgiving HTML parsing if the XML is malformed.
 */
export const parseBibleXML = (xmlString, bookNamesArray) => {
  // 1. Sanitize the string
  let safeXml = xmlString.trim().replace(/<\?xml[^>]*\?>/gi, '').trim();
  
  // Fix unescaped ampersands (The #1 cause of silent XML crashes)
  safeXml = safeXml.replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]+|#\d+);)/g, '&amp;');
  
  // Ensure a root wrapper exists
  if (!safeXml.startsWith('<Bible') && !safeXml.startsWith('<bible')) {
    safeXml = `<Bible>${safeXml}</Bible>`;
  }

  const parser = new DOMParser();
  let doc = parser.parseFromString(safeXml, "text/xml");
  let isHtmlMode = false;

  // 2. Fallback if strict XML parsing fails
  if (doc.getElementsByTagName("parsererror").length > 0) {
    console.warn("Strict XML parsing failed. Falling back to forgiving parser.");
    doc = parser.parseFromString(safeXml, "text/html");
    isHtmlMode = true;
  }

  const bibleData = {};
  const bookTag = isHtmlMode ? "book" : "Book";
  const chapterTag = isHtmlMode ? "chapter" : "Chapter";

  // 3. Parse Data
  const books = doc.getElementsByTagName(bookTag);

  Array.from(books).forEach((bookNode) => {
    const bookId = bookNode.getAttribute("id")?.trim();
    if (!bookId) return;

    const bookName = bookNamesArray[parseInt(bookId) - 1] || `Book ${bookId}`;
    bibleData[bookId] = { name: bookName, chapters: {} };

    const chapters = bookNode.getElementsByTagName(chapterTag);
    
    Array.from(chapters).forEach((chapterNode) => {
      const chapterId = chapterNode.getAttribute("id")?.trim();
      if (!chapterId) return;
      
      const chapterContent = [];

      Array.from(chapterNode.children).forEach((node) => {
        const tagName = node.tagName.toLowerCase();
        
        if (tagName === "verse") {
          chapterContent.push({
            type: "verse",
            id: node.getAttribute("id")?.trim(),
            text: node.textContent.trim(),
            ref: `${bookName} ${chapterId}:${node.getAttribute("id")?.trim()}`
          });
        } else if (tagName === "caption") {
          const vref = node.getAttribute("vref")?.trim();
          chapterContent.push({
            type: "caption",
            id: `cap-${vref}`,
            vref: vref,
            text: node.textContent.trim()
          });
        }
      });

      bibleData[bookId].chapters[chapterId] = chapterContent;
    });
  });

  return bibleData;
};