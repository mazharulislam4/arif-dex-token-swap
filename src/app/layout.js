import "bootstrap/dist/css/bootstrap.min.css";
import Provider from "./Provider";
import Navbar from "./component/Navbar";
import Footer from "./component/footer/Footer";
import "./globals.css";
export const metadata = {
  title: "Swap",
  description: "Token swap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <header>
            <Navbar />
          </header>

          <main>{children}</main>
        </Provider>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
