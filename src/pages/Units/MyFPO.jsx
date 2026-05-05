import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/routeConfig";

const MyFPO = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(ROUTES.UNITS_ALLFPO, {
      replace: true,
      state: { typeFilter: "myfpo" },
    });
  }, [navigate]);

  return null;
};

export default MyFPO;
