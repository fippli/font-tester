const title = document.getElementById("title");
const titleBlack = document.getElementById("title-black");

const listFonts = async () => {
  const response = await fetch(
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBt94_Dg26EwmJ3UjpwarkB87xBai475Gs"
  );
  return await response.json();
};

const getRandomFont = (fonts) => {
  const randomIndex = Math.floor(Math.random() * fonts.items.length);
  return fonts.items[randomIndex];
};

const loadAllAvailableVariants = async (fontObj) => {
  const entries = Object.entries(fontObj.files); // [ ["100", "..."], ["200","..."], ... ]

  const promises = entries.map(([variant, url]) => {
    const weight = variant === "regular" ? "400" : String(variant);
    const face = new FontFace(fontObj.family, `url(${url})`, { weight });
    return face.load().then((f) => document.fonts.add(f));
  });

  await Promise.all(promises);
};

const setFragmentInUrl = (fontObj) => {
  window.location.hash = fontObj.family;
};

const main = async () => {
  const fonts = await listFonts();

  console.log(
    window.location.hash,
    decodeURIComponent(window.location.hash.slice(1))
  );

  const selectedFont = window.location.hash
    ? fonts.items.find((font) => {
        console.log({ font });
        return (
          font.family === decodeURIComponent(window.location.hash.slice(1))
        );
      })
    : getRandomFont(fonts);

  console.log({ selectedFont });

  // Example:
  loadAllAvailableVariants(selectedFont).then(() => {
    document.documentElement.style.setProperty(
      "--app-font",
      `"${selectedFont.family}", system-ui, sans-serif`
    );
    // then in CSS use: font-family: var(--app-font);
    title.textContent = selectedFont.family;
    titleBlack.textContent = selectedFont.family;
    setFragmentInUrl(selectedFont);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      const newFont = getRandomFont(fonts);

      loadAllAvailableVariants(newFont).then(() => {
        document.documentElement.style.setProperty(
          "--app-font",
          `"${newFont.family}", system-ui, sans-serif`
        );
        title.textContent = newFont.family;
        titleBlack.textContent = newFont.family;
        setFragmentInUrl(newFont);
      });
    }
  });
};

main();
