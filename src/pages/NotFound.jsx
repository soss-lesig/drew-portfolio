import { Link } from "react-router-dom";
import MeekoBubble from "../components/MeekoBubble";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-404">404</div>
      <h1 className="not-found-heading">page not found</h1>
      <p className="not-found-sub">
        whatever you were looking for, it's not here. in the meantime, here's a
        quote from meeko.
      </p>
      <div className="not-found-meeko">
        <img
          src="/images/meeks-transparent.png"
          alt="Meeko looking bewildered"
          className="not-found-meeko-img"
        />
        <MeekoBubble />
      </div>
      <Link to="/" className="cta-primary">
        back to home
      </Link>
    </div>
  );
}
