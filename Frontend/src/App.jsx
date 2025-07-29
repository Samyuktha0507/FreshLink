import { Outlet } from 'react-router-dom';
import Header from './components/Header.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // Assuming this is your AuthProvider path
import { CartProvider } from './context/CartContext.jsx'; // Importing the CartProvider

function App() {
  return (
    // AuthProvider should typically wrap the entire application that needs authentication context
    <AuthProvider>
      {/* CartProvider wraps components that need access to cart state */}
      <CartProvider>
        <div>
          <Header />
          <main>
            {/* Outlet renders the matched child route component */}
            <Outlet />
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
