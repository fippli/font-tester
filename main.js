const title = document.getElementById("title");
const titleBlack = document.getElementById("title-black");
const paragraph = document.getElementById("paragraph");

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
  if (window.location.hash) {
    const fontObj = await listFonts();
    const font = fontObj.items.find(
      (font) => font.family === window.location.hash.slice(1)
    );
    loadAllAvailableVariants(font).then(() => {
      document.documentElement.style.setProperty(
        "--app-font",
        `"${font.family}", system-ui, sans-serif`
      );
    });
  }

  const fonts = await listFonts();

  const randomFont = getRandomFont(fonts);

  // Example:
  loadAllAvailableVariants(randomFont).then(() => {
    document.documentElement.style.setProperty(
      "--app-font",
      `"${randomFont.family}", system-ui, sans-serif`
    );
    // then in CSS use: font-family: var(--app-font);
    title.textContent = randomFont.family;
    titleBlack.textContent = randomFont.family;
    setFragmentInUrl(randomFont);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      console.log({ event });
      // load a new font

      const newFont = getRandomFont(fonts);
      console.log({ newFont });
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
