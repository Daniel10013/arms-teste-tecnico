import { NavLink } from 'react-router-dom';
import type { NavLinkRenderProps } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const activeClass = ({ isActive }: NavLinkRenderProps) =>
    isActive ? 'active-link' : '';

  return (
    <nav>
      <NavLink to="/home" className={activeClass}>
        Home
      </NavLink>
      <NavLink to="/gerar-artigo" className={activeClass}>
        Gerar Artigo
      </NavLink>
    </nav>
  );
}

export default Navigation;
