import './styles/globals.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Industry from './components/Industry/Industry';
import Coverage from './components/Coverage/Coverage';
import Projects from './components/Projects/Projects';
import Experience from './components/Experience/Experience';


import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Industry />
        <Coverage />
        <Projects />
        <Experience />


        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
