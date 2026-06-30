import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function StoreLayout() {
  return (
    <div className="sh-app">
      <Header />
      <main className="sh-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
