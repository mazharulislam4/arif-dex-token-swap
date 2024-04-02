import { Suspense } from "react";
import Provider from "./Provider";
import Navbar from "./component/Navbar";
import Footer from "./component/footer/Footer";
import "./globals.css";
import Loading from "./loading";
export const metadata = {
  title: "Swap",
  description: "Token swap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <Provider>
            <header>
              <Navbar />
            </header>

            <main>{children}</main>
          </Provider>
        </Suspense>

        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}
