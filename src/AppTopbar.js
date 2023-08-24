import React  from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../src/assets/SpaceX-Emblem-500x313-1.jpg';


export const AppTopbar = () => {

    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={logoImage} alt="SpaceX Logo" style={{ maxWidth: '25px' }} />
                <span>SpaceX</span>
            </Link>
        </div>
    );
}
