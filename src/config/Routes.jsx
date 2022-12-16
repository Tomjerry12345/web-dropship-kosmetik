import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/autentikasi/login/LoginPage";
import RegisterPage from "../pages/autentikasi/register/RegisterPage";
import { VerifyLogin } from "../pages/autentikasi/verifyLogin/VerifyLogin";
import DashboardPembeliPage from "../pages/pembeli/dashboard/DashboardPembeliPage";
import DashboardPenjualPage from "../pages/penjual/dashboard/DashboardPenjualPage";
import { auth } from "../services/FirebaseApp";
import { useDispatch } from "react-redux";
import ForgetPassword from "../pages/autentikasi/forgetPassword/ForgetPassword";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const PrivateRoute = ({ component: Component, statusLogin, ...rest }) => {
  return <Route {...rest} render={(props) => (statusLogin === "true" ? <Component {...props} /> : <Redirect to={{ pathname: "/login" }} />)} />;
};

const HomeComponent = (props) => {
  const statusLogin = localStorage.getItem("login");
  let page;
  if (props.jenisAkun != null || statusLogin === "false") {
    page = props.jenisAkun === "dropshiper" ? <PrivateRoute path="/" component={DashboardPenjualPage} statusLogin={statusLogin} /> : <PrivateRoute path="/" component={DashboardPembeliPage} statusLogin={statusLogin} />;
  } else {
    page = null;
  }
  return page;
};

const Routes = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [jenisAkun, setJenisAkun] = useState(null);

  useEffect(() => {
    // localStorage.setItem("login", true);
    getCurrentUser();
  }, [jenisAkun]);

  const getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`email 1 => ${user.email}`);
        getDataUsers(user.email);
      } else {
        // localStorage.setItem("login", false);
        console.log(`Jaringan bermasalah`);
      }
    });
  };

  const getDataUsers = (email) => {
    axios
      .post("http://localhost:4000/users/getByEmail", { email: email })
      .then((result) => {
        dispatch({ type: "UPDATE_USERS", payload: result.data });
        const jenisAkun = result.data.jenisAkun;
        setJenisAkun(jenisAkun);
      })
      .catch((err) => {
        console.log("err: ", err.message);
      });
  };

  return (
    <Router>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/verify-login" component={VerifyLogin} />
        <Route path="/forget-password" component={ForgetPassword} />
        {/* <HomeComponent jenisAkun={jenisAkun} /> */}
        {console.log(jenisAkun)}
        {jenisAkun === "dropshiper" ? <Route path="/" component={DashboardPenjualPage} /> : <Route path="/" component={DashboardPembeliPage} />}
      </Switch>
    </Router>
  );
};

export default Routes;
