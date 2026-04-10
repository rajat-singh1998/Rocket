module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2f8f16",
          dark: "#0f1720",
          soft: "#f4f7f1",
          line: "#dce5d7"
        }
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 32, 0.08)"
      },
      fontFamily: {
        sans: ['"Avenir Next"', '"Segoe UI"', "sans-serif"]
      }
    }
  },
  plugins: []
};
