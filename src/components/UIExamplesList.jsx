import Gumshoe from 'gumshoejs';
import { useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';
const UIExamplesList = ({
  examples
}) => {
  const navRef = useRef(null);
  useEffect(() => {
    if (navRef.current) new Gumshoe('.docs-nav a');
  }, []);
  return <Card ref={navRef} className="docs-nav">
      <ul className="nav bg-transparent flex-column">
        {examples.map((example, idx) => <li key={example.link + idx} className="nav-item">
            <a href={example.link} className="nav-link">
              {example.label}
            </a>
          </li>)}
      </ul>
    </Card>;
};
export default UIExamplesList;