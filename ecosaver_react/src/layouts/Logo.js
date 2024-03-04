/* eslint-disable */
import { ReactComponent as LogoDark } from "../assets/images/logos/adminpro.svg";
import { Link } from "react-router-dom";
import Kt from "../assets/images/logos/img.svg";

const Logo = () => {
  return (
    <Link to="/">
      <Kt/>
    </Link>
  );
};

export default Logo;
