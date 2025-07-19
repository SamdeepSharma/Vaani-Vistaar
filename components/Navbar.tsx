import Link from 'next/link';
import ClientSession from './ClientSession';

const Navbar: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between p-6">
        <h1 className="text-4xl font-bold mb-4 md:mb-0 hover:text-yellow-300 transition duration-300">
          VaaniVista
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="text-lg hover:text-yellow-300 transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-lg hover:text-yellow-300 transition duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-lg hover:text-yellow-300 transition duration-300">
                Products
              </Link>
            </li>
            <ClientSession />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
