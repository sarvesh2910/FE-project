import Navbar from "./Navigation/nav";
import "./globals.css";

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <body>
                <Navbar/>
                <div className={'content'}>
                    {children}
                </div>
            </body>
        </html>
    );
}
